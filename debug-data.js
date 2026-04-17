import mongoose from "mongoose";
import User from "./server/models/User.js";
import Lead from "./server/models/Lead.js";

async function debugData() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crm");

    const employees = await User.find({ role: "User" });
    console.log(`\n📊 Total Employees: ${employees.length}`);
    employees.forEach((emp) => {
      console.log(`  └─ ${emp.firstName} ${emp.lastName} (ID: ${emp._id})`);
    });

    const leads = await Lead.find().select("name assignedTo status");
    console.log(`\n📋 Total Leads: ${leads.length}`);
    
    if (leads.length > 0) {
      console.log("Lead details:");
      leads.slice(0, 10).forEach((lead) => {
        console.log(`  └─ ${lead.name} → Assigned: ${lead.assignedTo || "UNASSIGNED"}, Status: ${lead.status}`);
      });
    }

    // Check assigned leads per employee
    console.log("\n✅ Assigned Leads per Employee:");
    for (const emp of employees) {
      const assignedCount = await Lead.countDocuments({
        assignedTo: emp._id,
        status: "Ongoing",
      });
      const closedCount = await Lead.countDocuments({
        assignedTo: emp._id,
        status: "Closed",
      });
      console.log(`  ${emp.firstName} ${emp.lastName}: ${assignedCount} ongoing, ${closedCount} closed`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

debugData();
