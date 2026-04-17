import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      default: null,
    },
    actorEmail: {
      type: String,
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: ["lead_assigned", "lead_updated", "employee_created", "employee_updated", "employee_deleted", "settings_updated", "csv_uploaded"],
      default: "lead_assigned",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
