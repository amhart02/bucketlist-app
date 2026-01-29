import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import Category from "@/models/Category";

/**
 * GET /api/library/categories
 * Fetch all categories ordered by order field
 */
export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find()
      .sort({ order: 1 })
      .select("_id name slug description order")
      .lean();

    const response = NextResponse.json({ categories }, { status: 200 });
    
    // Cache for 24 hours (library ideas are relatively static)
    response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    
    return response;
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
