import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import BucketList from "@/models/BucketList";
import BucketListItem from "@/models/BucketListItem";
import LibraryIdea from "@/models/LibraryIdea";
import { requireAuth } from "@/lib/auth/middleware";
import { CreateItemSchema } from "@/lib/validation/schemas";

// POST /api/lists/[id]/items - Add item to list
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();

    // Validate request body
    const validation = CreateItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { text, sourceLibraryIdeaId } = validation.data;

    await dbConnect();

    // Verify list exists and user owns it
    const list = await BucketList.findById(params.id);
    if (!list) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    if (list.userId.toString() !== (session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get next order number
    const maxOrderItem = await BucketListItem.findOne({
      bucketListId: params.id,
    })
      .sort({ order: -1 })
      .lean();

    const nextOrder = maxOrderItem ? maxOrderItem.order + 1 : 1;

    // Create item
    const item = await BucketListItem.create({
      bucketListId: params.id,
      text,
      isCompleted: false,
      order: nextOrder,
      sourceLibraryIdeaId: sourceLibraryIdeaId || undefined,
    });

    // If this is from library, increment usage count
    if (sourceLibraryIdeaId) {
      await LibraryIdea.findByIdAndUpdate(sourceLibraryIdeaId, {
        $inc: { usageCount: 1 },
      });
    }

    // Update list counts and timestamp
    list.itemCount += 1;
    list.lastActivityAt = new Date();
    await list.save();

    return NextResponse.json(
      { message: "Item added successfully", item },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add item error:", error);
    return NextResponse.json(
      { error: "Failed to add item" },
      { status: 500 }
    );
  }
}
