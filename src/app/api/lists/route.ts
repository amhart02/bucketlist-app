import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import BucketList from "@/models/BucketList";
import { requireAuth } from "@/lib/auth/middleware";
import { CreateBucketListSchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/utils/logger";

// GET /api/lists - Get all lists for authenticated user
export async function GET() {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    await dbConnect();

    const lists = await BucketList.find({ userId: (session.user as any).id })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate completionPercentage for each list since .lean() doesn't include virtuals
    const listsWithPercentage = lists.map(list => ({
      ...list,
      completionPercentage: list.itemCount === 0 ? 0 : Math.round((list.completedCount / list.itemCount) * 100)
    }));

    return NextResponse.json({ lists: listsWithPercentage });
  } catch (error) {
    logger.error('Failed to fetch lists', error, { userId: (session.user as any).id });
    return NextResponse.json(
      { error: "Failed to fetch lists" },
      { status: 500 }
    );
  }
}

// POST /api/lists - Create a new list
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();

    // Validate request body
    const validation = CreateBucketListSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name } = validation.data;

    await dbConnect();

    // Create list
    const list = await BucketList.create({
      userId: (session.user as any).id,
      name,
      itemCount: 0,
      completedCount: 0,
      lastActivityAt: new Date(),
    });

    logger.info('Bucket list created', { userId: (session.user as any).id, listId: list._id.toString(), name });

    return NextResponse.json(
      { message: "List created successfully", list },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Failed to create list', error, { userId: (session.user as any).id });
    return NextResponse.json(
      { error: "Failed to create list" },
      { status: 500 }
    );
  }
}
