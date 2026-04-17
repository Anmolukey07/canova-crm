import express from "express";
import Lead from "../models/Lead.js";
import User from "../models/User.js";
import { authMiddleware, adminOnly } from "../middleware/auth.js";
import { formatActivityMessage } from "../utils/activityFormatter.js";

const router = express.Router();

router.get("/metrics", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const unassignedLeads = await Lead.countDocuments({ assignedTo: null });
    const assignedLeads = totalLeads - unassignedLeads;
    const closedLeads = await Lead.countDocuments({ status: "Closed" });
    const activeSalespeople = await User.countDocuments({
      role: "User",
      status: "Active",
    });

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const assignedThisWeek = await Lead.countDocuments({
      assignedAt: { $gte: weekStart },
    });

    const conversionRate =
      assignedLeads > 0 ? Math.round((closedLeads / assignedLeads) * 100) : 0;

    response.json({
      success: true,
      metrics: {
        unassignedLeads,
        assignedThisWeek,
        activeSalespeople,
        conversionRate,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/chart-data", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const today = new Date();
    const chartData = [];

    for (let i = 13; i >= 0; i--) {
      const pointDate = new Date(today);
      pointDate.setDate(today.getDate() - i);
      pointDate.setHours(0, 0, 0, 0);

      const nextDate = new Date(pointDate);
      nextDate.setDate(nextDate.getDate() + 1);

      const assigned = await Lead.countDocuments({
        assignedAt: {
          $gte: pointDate,
          $lt: nextDate,
        },
      });

      const closed = await Lead.countDocuments({
        closedAt: {
          $gte: pointDate,
          $lt: nextDate,
        },
      });

      const value = assigned > 0 ? Math.round((closed / assigned) * 100) : 0;

      chartData.push({
        day: pointDate.toLocaleDateString("en-US", { weekday: "short" }),
        value,
      });
    }

    response.json({
      success: true,
      chartData,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/activities", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const Activity = (await import("../models/Activity.js")).default;
    const activities = await Activity.find()
      .populate("actorId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(7);

    const formattedActivities = activities.map((activity) => {
      const formatted = formatActivityMessage(activity);
      return {
        id: activity._id,
        message: formatted.message,
        time: formatted.time,
        type: activity.type,
        createdAt: activity.createdAt,
      };
    });

    response.json({
      success: true,
      activities: formattedActivities,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/active-salespeople", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const salespeople = await User.find({ role: "User", status: "Active" })
      .select("firstName lastName assignedLeads closedLeads status language")
      .sort({ firstName: 1 });

    response.json({
      success: true,
      salespeople,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
