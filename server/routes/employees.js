import express from "express";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import Lead from "../models/Lead.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 8;
    const search = request.query.search || "";

    const query = {
      role: "User",
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const total = await User.countDocuments(query);
    const employees = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    console.log(`[Employees API] Found ${employees.length} employees, calculating leads...`);

    // Get lead counts for each employee
    const employeesWithCounts = await Promise.all(
      employees.map(async (employee) => {
        try {
          const assignedLeads = await Lead.countDocuments({
            assignedTo: employee._id,
            status: "Ongoing",
          });
          const closedLeads = await Lead.countDocuments({
            assignedTo: employee._id,
            status: "Closed",
          });
          console.log(`  ${employee.firstName} ${employee.lastName}: ${assignedLeads} ongoing, ${closedLeads} closed`);
          return {
            ...employee.toObject(),
            assignedLeads,
            closedLeads,
          };
        } catch (err) {
          console.error(`Error calculating leads for ${employee.firstName}:`, err);
          throw err;
        }
      })
    );

    console.log(`[Employees API] Sending ${employeesWithCounts.length} employees with counts`);
    
    response.json({
      success: true,
      employees: employeesWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[Employees API] Error:", error);
    next(error);
  }
});

router.get("/:id", authMiddleware, async (request, response, next) => {
  try {
    const employee = await User.findById(request.params.id);
    if (!employee) {
      return response.status(404).json({ success: false, message: "Employee not found" });
    }
    response.json({ success: true, employee });
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const { firstName, lastName, email, location, language } = request.body;

    if (!firstName || !lastName || !email) {
      return response.status(400).json({
        success: false,
        message: "First name, last name, and email are required",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return response.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const employee = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: email.toLowerCase(),
      role: "User",
      language: language || "English",
      location: location || "",
      status: "Active",
    });

    await employee.save();

    await Activity.create({
      message: `You created employee ${firstName} ${lastName}`,
      actorEmail: request.user.email,
      type: "employee_created",
      employeeId: employee._id,
      actorId: request.user.id,
    });

    response.json({
      success: true,
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        language: employee.language,
        location: employee.location,
        status: employee.status,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const { firstName, lastName, location, language, status } = request.body;

    const employee = await User.findById(request.params.id);
    if (!employee) {
      return response.status(404).json({ success: false, message: "Employee not found" });
    }

    if (firstName) employee.firstName = firstName;
    if (lastName) employee.lastName = lastName;
    if (location) employee.location = location;
    if (language) employee.language = language;
    if (status) employee.status = status;

    await employee.save();

    await Activity.create({
      message: `You edited employee ${employee.firstName} ${employee.lastName}`,
      actorEmail: request.user.email,
      type: "employee_updated",
      employeeId: employee._id,
      actorId: request.user.id,
    });

    response.json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const employee = await User.findByIdAndDelete(request.params.id);
    if (!employee) {
      return response.status(404).json({ success: false, message: "Employee not found" });
    }

    await Activity.create({
      message: `You deleted employee ${employee.firstName} ${employee.lastName}`,
      actorEmail: request.user.email,
      type: "employee_deleted",
      actorId: request.user.id,
    });

    response.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/bulk-delete", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const { ids } = request.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response.status(400).json({
        success: false,
        message: "No employee IDs provided",
      });
    }

    await User.deleteMany({ _id: { $in: ids } });

    await Activity.create({
      message: `You bulk deleted ${ids.length} employee(s)`,
      actorEmail: request.user.email,
      type: "employee_deleted",
      actorId: request.user.id,
    });

    response.json({
      success: true,
      message: `${ids.length} employee(s) deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
