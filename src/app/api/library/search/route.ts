import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import LibraryIdea from "@/models/LibraryIdea";

export const dynamic = 'force-dynamic';

/**
 * GET /api/library/search?q=keyword&page=1&limit=20
 * Search library ideas by keyword
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    if (!query.trim()) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Search in title and tags (case-insensitive)
    const searchRegex = new RegExp(query, "i");
    const ideas = await LibraryIdea.find({
      $or: [
        { title: searchRegex },
        { tags: { $in: [searchRegex] } },
      ],
    })
      .sort({ usageCount: -1, title: 1 })
      .skip(skip)
      .limit(limit)
      .select("_id title description tags usageCount categoryId")
      .populate("categoryId", "name slug")
      .lean();

    // Get total count for pagination
    const total = await LibraryIdea.countDocuments({
      $or: [
        { title: searchRegex },
        { tags: { $in: [searchRegex] } },
      ],
    });

    const response = NextResponse.json(
      {
        ideas,
        query,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
    
    // Cache search results for 1 hour
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
    
    return response;
  } catch (error) {
    console.error("Search ideas error:", error);
    return NextResponse.json(
      { error: "Failed to search ideas" },
      { status: 500 }
    );
  }
}
