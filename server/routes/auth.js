import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";
import Activity from "../models/Activity.js";

const router = express.Router();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || "7d";

router.post("/register", async (request, response, next) => {
  try {
    const { firstName, lastName, email, password, role = "User", language = "English", location = "" } = request.body;

    if (!firstName || !lastName || !email || !password) {
      return response.status(400).json({
        success: false,
        message: "First name, last name, email, and password are required",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return response.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
      language,
      location,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await Activity.create({
      message: `User ${firstName} ${lastName} registered`,
      actorEmail: email,
      type: "employee_created",
      employeeId: user._id,
    });

    response.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    response.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        language: user.language,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authMiddleware, async (request, response) => {
  response.json({ success: true, message: "Logout successful" });
});

router.get("/me", authMiddleware, async (request, response, next) => {
  try {
    const user = await User.findById(request.user.id);
    response.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        language: user.language,
        status: user.status,
        location: user.location,
        assignedLeads: user.assignedLeads,
        closedLeads: user.closedLeads,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
