import jwt from "jsonwebtoken";

async function testAPI() {
  try {
    // Create a mock admin token (same secret as in .env)
    const token = jwt.sign(
      { email: "admin@crm.com", _id: "admin123", role: "Admin" },
      "your-secret-key-change-this-in-production",
      { expiresIn: "7d" }
    );

    console.log("🔑 Test token created");
    console.log(`Token: ${token.substring(0, 50)}...\n`);

    const response = await fetch("http://127.0.0.1:5050/api/employees?limit=10000", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log(`📡 Response Status: ${response.status}`);
    const data = await response.json();
    console.log("📊 Response Data:");
    console.log(JSON.stringify(data, null, 2));

    if (data.employees && data.employees.length > 0) {
      console.log(`\n✅ Got ${data.employees.length} employees`);
      data.employees.slice(0, 3).forEach((emp) => {
        console.log(`  ${emp.firstName} ${emp.lastName}: ${emp.assignedLeads} assigned, ${emp.closedLeads} closed`);
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testAPI();
