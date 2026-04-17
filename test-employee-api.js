import mongoose from "mongoose";
import User from "./server/models/User.js";
import Lead from "./server/models/Lead.js";

async function testEmployeeAPI() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/crm-system");
    console.log("✓ Connected to crm-system database");

    const query = { role: "User" };
    const employees = await User.find(query).limit(10000).sort({ createdAt: -1 });
    console.log(`\nFound ${employees.length} employees\n`);

    // Get lead counts for each employee (exactly like the API does)
    const employeesWithCounts = await Promise.all(
      employees.map(async (employee) => {
        const assignedLeads = await Lead.countDocuments({
          assignedTo: employee._id,
          status: "Ongoing",
        });
        const closedLeads = await Lead.countDocuments({
          assignedTo: employee._id,
          status: "Closed",
        });
        return {
          ...employee.toObject(),
          assignedLeads,
          closedLeads,
        };
      })
    );

    // Display results
    employeesWithCounts.forEach((emp) => {
      console.log(`${emp.firstName} ${emp.lastName}:`);
      console.log(`  - _id: ${emp._id}`);
      console.log(`  - email: ${emp.email}`);
      console.log(`  - assignedLeads: ${emp.assignedLeads}`);
      console.log(`  - closedLeads: ${emp.closedLeads}`);
      console.log();
    });

    // Log the exact response format
    console.log("\n📋 API Response Format:");
    console.log(JSON.stringify(
      {
        success: true,
        employees: employeesWithCounts,
        pagination: {
          page: 1,
          limit: 10000,
          total: employees.length,
          pages: 1,
        },
      },
      null,
      2
    ).substring(0, 500) + "...");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

testEmployeeAPI();
