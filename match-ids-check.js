import mongoose from "mongoose";
import User from "./server/models/User.js";
import Lead from "./server/models/Lead.js";

async function matchIDsCheck() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crm-system");

    const employees = await User.find({ role: "User" });
    console.log("📊 Employees in DB:");
    const empMap = {};
    employees.forEach((emp) => {
      console.log(`  _id: ${emp._id} | ${emp.firstName} ${emp.lastName} (${emp.language})`);
      empMap[emp._id.toString()] = `${emp.firstName} ${emp.lastName}`;
    });

    console.log("\n📋 Leads assigned to:");
    const uniqueAssignees = new Set();
    const leads = await Lead.find();
    leads.forEach((lead) => {
      if (lead.assignedTo) {
        uniqueAssignees.add(lead.assignedTo.toString());
      }
    });

    console.log(`  Total unique assignees: ${uniqueAssignees.size}`);
    uniqueAssignees.forEach((id) => {
      const name = empMap[id];
      if (name) {
        console.log(`  ✓ ${id} → ${name}`);
      } else {
        console.log(`  ✗ ${id} → UNKNOWN (not in employees)`);
      }
    });

    console.log("\n🔍 Detailed verification:");
    for (const [empId, empName] of Object.entries(empMap)) {
      const count = await Lead.countDocuments({
        assignedTo: new mongoose.Types.ObjectId(empId),
        status: "Ongoing"
      });
      console.log(`  ${empName}: ${count} ongoing leads`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

matchIDsCheck();
