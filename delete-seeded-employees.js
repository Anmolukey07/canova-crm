import mongoose from "mongoose";
import User from "./server/models/User.js";

const DELETE_NAMES = [
  { firstName: "Tanner", lastName: "Finsha" },
  { firstName: "Emeto", lastName: "Winner" },
  { firstName: "Priya", lastName: "Sharma" },
  { firstName: "Kavya", lastName: "Rao" },
  { firstName: "Rahul", lastName: "Desai" },
];

async function deleteSeededEmployees() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crm");
    console.log("✓ Connected to MongoDB");

    for (const { firstName, lastName } of DELETE_NAMES) {
      const result = await User.deleteOne({
        firstName,
        lastName,
        role: "User",
      });
      if (result.deletedCount > 0) {
        console.log(`✓ Deleted ${firstName} ${lastName}`);
      }
    }

    const remaining = await User.countDocuments({ role: "User" });
    console.log(`\n✓ Remaining employees: ${remaining}`);

    await mongoose.disconnect();
    console.log("✓ Database connection closed");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

deleteSeededEmployees();
