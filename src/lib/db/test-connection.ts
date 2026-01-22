import dbConnect from "./mongodb";

/**
 * Test MongoDB connection.
 * This script can be run independently to verify database connectivity.
 */
async function testConnection() {
  console.log("🔌 Testing MongoDB connection...");
  
  try {
    const mongoose = await dbConnect();
    
    console.log("✅ Successfully connected to MongoDB!");
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'N/A'}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log(`🔗 Connection state: ${mongoose.connection.readyState === 1 ? "Connected" : "Not Connected"}`);
    
    // Test a simple query
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📁 Collections found: ${collections.length}`);
      
      if (collections.length > 0) {
        console.log("   Collections:", collections.map(c => c.name).join(", "));
      }
    }
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
      
      // Provide helpful troubleshooting tips
      if (error.message.includes("ENOTFOUND")) {
        console.error("\n💡 Troubleshooting tips:");
        console.error("   - Check that your MONGODB_URI is correct in .env.local");
        console.error("   - Verify your cluster hostname is correct");
        console.error("   - Check your internet connection");
      } else if (error.message.includes("authentication failed")) {
        console.error("\n💡 Troubleshooting tips:");
        console.error("   - Verify your MongoDB username and password are correct");
        console.error("   - Check that the database user has proper permissions");
      } else if (error.message.includes("timeout")) {
        console.error("\n💡 Troubleshooting tips:");
        console.error("   - Check MongoDB Atlas Network Access settings");
        console.error("   - Add your IP address (or 0.0.0.0/0 for development) to the allowlist");
        console.error("   - Verify firewall settings aren't blocking MongoDB port 27017");
      }
    } else {
      console.error("   Unknown error:", error);
    }
    
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  testConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default testConnection;
