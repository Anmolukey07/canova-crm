import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/auth.js";
import employeesRoutes from "./routes/employees.js";
import leadsRoutes from "./routes/leads.js";
import dashboardRoutes from "./routes/dashboard.js";
import adminRoutes from "./routes/admin.js";
import debugRoutes from "./routes/debug.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const uploadsDir = path.join(__dirname, "uploads");

fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();
const port = process.env.PORT || 5050;
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function connectDatabase() {
  try {
    const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/crm-system";

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

async function initializeSeedData() {
  const User = (await import("./models/User.js")).default;

  const adminExists = await User.findOne({ role: "Admin" });
  if (!adminExists) {
    await User.create({
      firstName: "Sarthak",
      lastName: "Pal",
      email: "admin@crm.com",
      password: "admin123",
      role: "Admin",
      location: "Karnataka",
      language: "English",
      status: "Active",
    });
    console.log("Default admin user created");
  }
}

function parseLine(line) {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
}

async function parseCsvFile(filePath) {
  const rows = [];
  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  const interfaceHandle = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let headers = [];

  for await (const rawLine of interfaceHandle) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    if (headers.length === 0) {
      headers = parseLine(line).map((header) => header.toLowerCase().trim());
      continue;
    }

    const values = parseLine(line);
    const row = headers.reduce((accumulator, header, headerIndex) => {
      accumulator[header] = (values[headerIndex] ?? "").trim();
      return accumulator;
    }, {});

    rows.push({
      id: `csv-${Date.now()}-${rows.length}`,
      name: row.name || "",
      email: row.email || "",
      source: row.source || "",
      date: row.date || "",
      location: row.location || "",
      language: row.language || "",
      status: "Ongoing",
      type: "Warm",
      scheduledDate: "-",
      phone: row.phone || "--",
    });
  }

  return rows;
}

app.post(
  "/api/parse-csv",
  express.raw({ type: ["text/csv", "application/octet-stream", "text/plain"], limit: "4mb" }),
  async (request, response) => {
    try {
      if (!request.body || request.body.length === 0) {
        response.status(400).json({ success: false, message: "CSV file body is empty." });
        return;
      }

      const filename = (request.headers["x-filename"] || `upload-${Date.now()}.csv`)
        .toString()
        .replace(/[^\w.-]/g, "_");
      const tempFile = path.join(uploadsDir, filename);

      await fs.promises.writeFile(tempFile, request.body);
      const rows = await parseCsvFile(tempFile);

      response.json({ success: true, rows });
    } catch (error) {
      response.status(500).json({
        success: false,
        message: error.message || "Unable to parse CSV file.",
      });
    }
  }
);

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/debug", debugRoutes);

app.use(errorHandler);

connectDatabase().then(() => {
  initializeSeedData();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
