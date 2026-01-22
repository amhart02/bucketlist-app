import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import BucketList from "@/models/BucketList";
import BucketListItem from "@/models/BucketListItem";
import { requireAuth } from "@/lib/auth/middleware";
import { UpdateItemSchema } from "@/lib/validation/schemas";

// PATCH /api/items/[id] - Update item text or completion status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();

    // Validate request body
    const validation = UpdateItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    await dbConnect();

    const item = await BucketListItem.findById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Verify user owns the list this item belongs to
    const list = await BucketList.findById(item.bucketListId);
    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    if (list.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Track if completion status changed
    const wasCompleted = item.isCompleted;

    // Update item fields
    if (validation.data.text !== undefined) {
      item.text = validation.data.text;
    }

    if (validation.data.isCompleted !== undefined) {
      item.isCompleted = validation.data.isCompleted;
      item.completedAt = validation.data.isCompleted ? new Date() : undefined;
    }

    await item.save();

    // Update list counts if completion status changed
    if (
      validation.data.isCompleted !== undefined &&
      wasCompleted !== validation.data.isCompleted
    ) {
      if (validation.data.isCompleted) {
        list.completedCount += 1;
      } else {
        list.completedCount -= 1;
      }
    }

    // Always update lastActivityAt
    list.lastActivityAt = new Date();
    await list.save();

    return NextResponse.json({ message: "Item updated successfully", item });
  } catch (error) {
    console.error("Update item error:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    await dbConnect();

    const item = await BucketListItem.findById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Verify user owns the list this item belongs to
    const list = await BucketList.findById(item.bucketListId);
    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    if (list.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update list counts
    list.itemCount -= 1;
    if (item.isCompleted) {
      list.completedCount -= 1;
    }
    list.lastActivityAt = new Date();
    await list.save();

    // Delete item
    await item.deleteOne();

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete item error:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
