import express from "express";
import { authMiddleware, adminOnly } from "../middleware/auth.js";
import User from "../models/User.js";
import Lead from "../models/Lead.js";

const router = express.Router();

// Test endpoint to debug employees calculation
router.get("/test-employees", authMiddleware, adminOnly, async (req, res) => {
  try {
    console.log("\n🔍 DEBUG: /api/test-employees endpoint called");
    console.log(`Auth user: ${req.user.email}`);

    const employees = await User.find({ role: "User" }).limit(10);
    console.log(`Found ${employees.length} employees`);

    const result = [];
    for (const emp of employees) {
      const assigned = await Lead.countDocuments({
        assignedTo: emp._id,
        status: "Ongoing",
      });
      const closed = await Lead.countDocuments({
        assignedTo: emp._id,
        status: "Closed",
      });
      result.push({
        name: `${emp.firstName} ${emp.lastName}`,
        _id: emp._id,
        assignedLeads: assigned,
        closedLeads: closed,
      });
      console.log(`  ${emp.firstName} ${emp.lastName}: ${assigned} / ${closed}`);
    }

    res.json({
      success: true,
      debug: "This is a debug endpoint",
      employees: result,
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
