import mongoose from "mongoose";
import User from "./server/models/User.js";

async function checkEmployees() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crm");
    const employees = await User.find({ role: "User" });
    console.log(`Total employees: ${employees.length}`);
    if (employees.length > 0) {
      employees.forEach((emp) => {
        console.log(`- ${emp.firstName} ${emp.lastName} (${emp.language})`);
      });
    } else {
      console.log("No employees found in database");
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkEmployees();
