import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import LibraryIdea from "@/models/LibraryIdea";
import Category from "@/models/Category";

/**
 * GET /api/library/categories/[id]/ideas
 * Fetch ideas for a specific category with pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const categoryId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Verify category exists
    const category = await Category.findById(categoryId).lean();
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Fetch ideas for this category
    const ideas = await LibraryIdea.find({ categoryId })
      .sort({ usageCount: -1, title: 1 }) // Sort by popularity, then alphabetically
      .skip(skip)
      .limit(limit)
      .select("_id title description tags usageCount")
      .lean();

    // Get total count for pagination
    const total = await LibraryIdea.countDocuments({ categoryId });

    const response = NextResponse.json(
      {
        ideas,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
    
    // Cache for 24 hours (library ideas are relatively static)
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    
    return response;
  } catch (error) {
    console.error("Get category ideas error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}
