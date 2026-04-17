import mongoose from "mongoose";
import User from "./server/models/User.js";

async function restoreEmployees() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crm-system");
    console.log("✓ Connected to MongoDB (crm-system)");

    const employees = [
      {
        firstName: "Tanner",
        lastName: "Finsha",
        email: "tanner.finsha@company.com",
        language: "Marathi",
        location: "Pune",
        status: "Active",
      },
      {
        firstName: "Emeto",
        lastName: "Winner",
        email: "emeto.winner@company.com",
        language: "Kannada",
        location: "Bengaluru",
        status: "Active",
      },
      {
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.sharma@company.com",
        language: "Hindi",
        location: "Delhi",
        status: "Active",
      },
      {
        firstName: "Kavya",
        lastName: "Rao",
        email: "kavya.rao@company.com",
        language: "English",
        location: "Mumbai",
        status: "Active",
      },
      {
        firstName: "Rahul",
        lastName: "Desai",
        email: "rahul.desai@company.com",
        language: "Bengali",
        location: "Kolkata",
        status: "Active",
      },
    ];

    for (const empData of employees) {
      const existing = await User.findOne({ email: empData.email });
      if (!existing) {
        const employee = new User({
          ...empData,
          password: empData.email,
          role: "User",
        });
        await employee.save();
        console.log(`✓ Created ${empData.firstName} ${empData.lastName} (${empData.language})`);
      }
    }

    const count = await User.countDocuments({ role: "User" });
    console.log(`\n✓ Total employees: ${count}`);

    await mongoose.disconnect();
    console.log("✓ Database connection closed");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

restoreEmployees();
