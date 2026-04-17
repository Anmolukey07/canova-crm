import express from "express";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const admin = await User.findById(request.user.id);
    if (!admin) {
      return response.status(404).json({ success: false, message: "Admin not found" });
    }

    response.json({
      success: true,
      profile: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/profile", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const { firstName, lastName, email } = request.body;

    const admin = await User.findById(request.user.id);
    if (!admin) {
      return response.status(404).json({ success: false, message: "Admin not found" });
    }

    if (firstName) admin.firstName = firstName;
    if (lastName) admin.lastName = lastName;
    if (email && email !== admin.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return response.status(400).json({ success: false, message: "Email already in use" });
      }
      admin.email = email.toLowerCase();
    }

    await admin.save();

    await Activity.create({
      message: "Admin updated default profile settings",
      actorEmail: request.user.email,
      type: "settings_updated",
      actorId: request.user.id,
    });

    response.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
