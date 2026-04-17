import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import Activity from "../models/Activity.js";

const router = express.Router();

// Log break start
router.post("/:userId/start", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    const activity = new Activity({
      type: "break_started",
      actorId: userId,
      message: `${req.user.firstName} started a break`,
      createdAt: new Date(),
    });

    await activity.save();
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log break end
router.post("/:userId/end", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    const activity = new Activity({
      type: "break_ended",
      actorId: userId,
      message: `${req.user.firstName} ended a break`,
      createdAt: new Date(),
    });

    await activity.save();
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
