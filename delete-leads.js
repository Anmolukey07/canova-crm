import mongoose from "mongoose";
import dotenv from "dotenv";
import Lead from "./server/models/Lead.js";

dotenv.config();

async function deleteAllLeads() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await Lead.deleteMany({});
    console.log(`✓ Successfully deleted ${result.deletedCount} leads`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error deleting leads:", error.message);
    process.exit(1);
  }
}

deleteAllLeads();
