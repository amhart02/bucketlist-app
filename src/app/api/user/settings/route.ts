import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/lib/auth/middleware";

/**
 * GET /api/user/settings
 * Fetch user settings
 */
export async function GET() {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    await dbConnect();

    const user = await User.findById((session.user as any).id).select("settings");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ settings: user.settings || {} }, { status: 200 });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/settings
 * Update user settings
 */
export async function PATCH(request: Request) {
  const session = await requireAuth();
  if (session instanceof NextResponse) return session;

  try {
    const body = await request.json();
    const { activityRemindersEnabled } = body;

    // Validate input
    if (typeof activityRemindersEnabled !== "boolean") {
      return NextResponse.json(
        { error: "activityRemindersEnabled must be a boolean" },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      {
        $set: {
          "settings.activityRemindersEnabled": activityRemindersEnabled,
        },
      },
      { new: true, runValidators: true }
    ).select("settings");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Settings updated successfully",
        settings: user.settings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
