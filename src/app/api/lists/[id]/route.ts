import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import BucketList from "@/models/BucketList";
import BucketListItem from "@/models/BucketListItem";
import { requireAuth } from "@/lib/auth/middleware";
import { UpdateBucketListSchema } from "@/lib/validation/schemas";
import mongoose from "mongoose";

// GET /api/lists/[id] - Get single list with items
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    await dbConnect();

    const list = await BucketList.findById(params.id).lean();

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Check authorization
    if (list.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get items for this list
    const items = await BucketListItem.find({ bucketListId: params.id })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ list, items });
  } catch (error) {
    console.error("Get list error:", error);
    return NextResponse.json({ error: "Failed to fetch list" }, { status: 500 });
  }
}

// PATCH /api/lists/[id] - Update list name
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();

    // Validate request body
    const validation = UpdateBucketListSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name } = validation.data;

    await dbConnect();

    const list = await BucketList.findById(params.id);

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Check authorization
    if (list.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update list
    list.name = name;
    list.lastActivityAt = new Date();
    await list.save();

    return NextResponse.json({ message: "List updated successfully", list });
  } catch (error) {
    console.error("Update list error:", error);
    return NextResponse.json({ error: "Failed to update list" }, { status: 500 });
  }
}

// DELETE /api/lists/[id] - Delete list and all its items
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    await dbConnect();

    const list = await BucketList.findById(params.id);

    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    // Check authorization
    if (list.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete all items in this list
    await BucketListItem.deleteMany({ bucketListId: params.id });

    // Delete the list
    await list.deleteOne();

    return NextResponse.json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Delete list error:", error);
    return NextResponse.json({ error: "Failed to delete list" }, { status: 500 });
  }
}
