// Load environment variables FIRST before any imports
import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import dbConnect from "../db/mongodb";
import { seedLibraryIdeas } from "./library-ideas";

/**
 * Main seed script entry point.
 * Seeds all necessary data for the application.
 */
async function seed() {
  console.log("🌱 Starting database seed...");
  
  try {
    // Connect to database
    await dbConnect();
    console.log("✅ Connected to MongoDB");
    
    // Seed library ideas and categories
    await seedLibraryIdeas();
    
    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:");
    console.error(error);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

export default seed;
