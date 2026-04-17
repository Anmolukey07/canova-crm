import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "--",
    },
    source: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["Marathi", "Kannada", "Hindi", "English", "Bengali"],
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Closed"],
      default: "Ongoing",
      index: true,
    },
    type: {
      type: String,
      enum: ["Hot", "Warm", "Cold", "-"],
      default: "Warm",
    },
    scheduledDate: {
      type: String,
      default: "-",
    },
    assignedDateLabel: {
      type: String,
      default: "",
    },
    stripe: {
      type: String,
      default: "warm",
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    closedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
