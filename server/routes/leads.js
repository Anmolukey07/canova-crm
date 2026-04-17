import express from "express";
import Lead from "../models/Lead.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
import { authMiddleware, adminOnly, userOnly } from "../middleware/auth.js";
import { assignLead, bulkAssignLeads } from "../utils/leadAssignment.js";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authMiddleware, async (request, response, next) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const search = request.query.search || "";
    const status = request.query.status || "";

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ],
    };

    if (status) {
      query.status = status;
    }

    if (request.user.role === "User") {
      query.assignedTo = request.user.id;
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate("assignedTo", "firstName lastName email")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    response.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", authMiddleware, async (request, response, next) => {
  try {
    const lead = await Lead.findById(request.params.id).populate("assignedTo", "firstName lastName email");
    if (!lead) {
      return response.status(404).json({ success: false, message: "Lead not found" });
    }

    if (request.user.role === "User" && lead.assignedTo?.toString() !== request.user.id) {
      return response.status(403).json({ success: false, message: "Unauthorized" });
    }

    response.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
});

router.post("/", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const { name, email, source, date, location, language, phone = "--", type = "Warm", scheduledDate = "-" } = request.body;

    if (!name || !email || !source || !date || !location || !language) {
      return response.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const leadData = {
      name,
      email,
      source,
      date,
      location,
      language,
      phone,
      type,
      scheduledDate,
    };

    const assignment = await assignLead(leadData, User, Lead);

    const lead = new Lead({
      ...leadData,
      assignedTo: assignment.assignedTo,
      assignedAt: assignment.assignedAt,
      assignedDateLabel: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }),
      stripe: "warm",
    });

    await lead.save();

    const assignedUser = assignment.assignedTo
      ? await User.findById(assignment.assignedTo)
      : null;

    await Activity.create({
      message: assignedUser
        ? `Admin added lead ${name} and assigned it to ${assignedUser.firstName} ${assignedUser.lastName}`
        : `Admin added lead ${name} but no user matched the language`,
      actorEmail: request.user.email,
      type: "lead_assigned",
      leadId: lead._id,
      actorId: request.user.id,
    });

    response.json({
      success: true,
      message: "Lead created successfully",
      lead: {
        ...lead.toObject(),
        assignedTo: assignedUser,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", authMiddleware, async (request, response, next) => {
  try {
    const { type, scheduledDate, status } = request.body;

    const lead = await Lead.findById(request.params.id);
    if (!lead) {
      return response.status(404).json({ success: false, message: "Lead not found" });
    }

    if (request.user.role === "User" && lead.assignedTo?.toString() !== request.user.id) {
      return response.status(403).json({ success: false, message: "Unauthorized" });
    }

    let updated = false;
    const changes = [];

    if (type && type !== lead.type) {
      lead.type = type;
      changes.push(`type to ${type}`);
      updated = true;
    }

    if (scheduledDate && scheduledDate !== lead.scheduledDate) {
      lead.scheduledDate = scheduledDate;
      changes.push(`scheduled date to ${scheduledDate}`);
      updated = true;
    }

    if (status && status !== lead.status) {
      lead.status = status;
      if (status === "Closed") {
        lead.closedAt = new Date();
      }
      changes.push(`status to ${status}`);
      updated = true;
    }

    if (updated) {
      lead.updatedAt = new Date();
      await lead.save();
      const actor = await User.findById(request.user.id).select("firstName lastName email");
      const actorName = actor ? `${actor.firstName} ${actor.lastName}`.trim() : request.user.email;

      await Activity.create({
        message: `${actorName} updated lead ${lead.name}: ${changes.join(", ")}`,
        actorEmail: actor?.email || request.user.email,
        type: "lead_updated",
        leadId: lead._id,
        actorId: request.user.id,
      });
    }

    response.json({
      success: true,
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/bulk-csv-upload", authMiddleware, adminOnly, upload.single("file"), async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).json({
        success: false,
        message: "No CSV file provided",
      });
    }

    // Required CSV columns
    const REQUIRED_COLUMNS = ["Name", "Email", "Source", "Date", "Location", "Language"];

    // Parse CSV from buffer
    const csvData = [];
    const errors = [];
    let headerRow = null;

    return new Promise(() => {
      Readable.from([request.file.buffer])
        .pipe(csv())
        .on("headers", (headers) => {
          headerRow = headers;
          // Validate column headers
          const missingColumns = REQUIRED_COLUMNS.filter(
            (col) => !headers.includes(col)
          );
          if (missingColumns.length > 0) {
            errors.push(`Missing columns: ${missingColumns.join(", ")}`);
          }
        })
        .on("data", (row) => {
          // Only process if headers are valid
          if (errors.length === 0) {
            csvData.push({
              name: row.Name,
              email: row.Email,
              source: row.Source,
              date: row.Date,
              location: row.Location,
              language: row.Language,
              phone: row.Phone || "--",
              type: "Warm",
              scheduledDate: "-",
              status: "Ongoing",
            });
          }
        })
        .on("error", (error) => {
          errors.push(error.message);
        })
        .on("end", async () => {
          try {
            if (errors.length > 0) {
              return response.status(400).json({
                success: false,
                message: "CSV validation failed",
                errors,
              });
            }

            if (csvData.length === 0) {
              return response.status(400).json({
                success: false,
                message: "No valid leads found in CSV",
              });
            }

            // Validate each row
            const validLeads = [];
            const validationErrors = [];

            const validLanguages = ["Marathi", "Kannada", "Hindi", "English", "Bengali"];

            for (const lead of csvData) {
              const rowErrors = [];

              if (!lead.name || lead.name.trim() === "") {
                rowErrors.push("Name is required");
              }
              if (!lead.email || lead.email.trim() === "") {
                rowErrors.push("Email is required");
              }
              if (!lead.source || lead.source.trim() === "") {
                rowErrors.push("Source is required");
              }
              if (!lead.date || lead.date.trim() === "") {
                rowErrors.push("Date is required");
              }
              if (!lead.location || lead.location.trim() === "") {
                rowErrors.push("Location is required");
              }
              if (!lead.language || !validLanguages.includes(lead.language)) {
                rowErrors.push(`Language must be one of: ${validLanguages.join(", ")}`);
              }

              if (rowErrors.length > 0) {
                validationErrors.push({
                  name: lead.name || "Unknown",
                  errors: rowErrors,
                });
              } else {
                validLeads.push(lead);
              }
            }

            if (validLeads.length === 0) {
              return response.status(400).json({
                success: false,
                message: "No valid leads after validation",
                errors: validationErrors,
              });
            }

            // Assign leads using round-robin logic with threshold
            const assignments = await bulkAssignLeads(validLeads, User, Lead);

            // Create all leads in parallel using Promise.all
            const createdLeads = await Promise.all(
              assignments.map((leadData) =>
                new Lead({
                  ...leadData,
                  assignedDateLabel: new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                  }),
                  stripe: "warm",
                }).save()
              )
            );

            // Create activity logs for all leads
            await Promise.all(
              createdLeads.map(async (lead) => {
                if (lead.assignedTo) {
                  const assignedUser = await User.findById(lead.assignedTo);
                  return Activity.create({
                    message: `CSV lead ${lead.name} was assigned to ${assignedUser.firstName} ${assignedUser.lastName}`,
                    actorEmail: request.user.email,
                    type: "lead_assigned",
                    leadId: lead._id,
                    actorId: request.user.id,
                  });
                } else {
                  return Activity.create({
                    message: `CSV lead ${lead.name} could not be assigned (no matching user for language: ${lead.language})`,
                    actorEmail: request.user.email,
                    type: "lead_assigned",
                    leadId: lead._id,
                    actorId: request.user.id,
                  });
                }
              })
            );

            // Create overall CSV upload activity log
            await Activity.create({
              message: `You uploaded ${createdLeads.length} lead(s) via CSV${validationErrors.length > 0 ? ` (${validationErrors.length} rows skipped due to validation errors)` : ""}`,
              actorEmail: request.user.email,
              type: "csv_uploaded",
              actorId: request.user.id,
            });

            response.json({
              success: true,
              message: `${createdLeads.length} leads uploaded successfully${validationErrors.length > 0 ? ` (${validationErrors.length} rows skipped)` : ""}`,
              leads: createdLeads,
              skipped: validationErrors.length,
              skippedRows: validationErrors,
            });
          } catch (parseError) {
            next(parseError);
          }
        });
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint to save already-parsed leads from frontend (after CSV verification)
router.post("/upload-parsed", authMiddleware, adminOnly, async (request, response, next) => {
  try {
    const { leads: parsedLeads } = request.body;

    if (!Array.isArray(parsedLeads) || parsedLeads.length === 0) {
      return response.status(400).json({
        success: false,
        message: "No leads provided",
      });
    }

    const validLanguages = ["Marathi", "Kannada", "Hindi", "English", "Bengali"];
    const validLeads = [];
    const validationErrors = [];

    // Validate each lead
    for (const lead of parsedLeads) {
      const rowErrors = [];
      const trimmedName = lead.name ? lead.name.trim() : "";
      const trimmedEmail = lead.email ? lead.email.trim() : "";
      const trimmedSource = lead.source ? lead.source.trim() : "";
      const trimmedDate = lead.date ? lead.date.trim() : "";
      const trimmedLocation = lead.location ? lead.location.trim() : "";
      const trimmedLanguage = lead.language ? lead.language.trim() : "";

      if (!trimmedName) rowErrors.push("Name is required");
      if (!trimmedEmail) rowErrors.push("Email is required");
      if (!trimmedSource) rowErrors.push("Source is required");
      if (!trimmedDate) rowErrors.push("Date is required");
      if (!trimmedLocation) rowErrors.push("Location is required");
      if (!trimmedLanguage) {
        rowErrors.push("Language is required");
      } else if (!validLanguages.includes(trimmedLanguage)) {
        rowErrors.push(`Language "${trimmedLanguage}" not valid. Use: ${validLanguages.join(", ")}`);
      }

      if (rowErrors.length > 0) {
        validationErrors.push({ 
          name: trimmedName || "Unknown", 
          errors: rowErrors 
        });
      } else {
        validLeads.push({
          name: trimmedName,
          email: trimmedEmail,
          source: trimmedSource,
          date: trimmedDate,
          location: trimmedLocation,
          language: trimmedLanguage,
          phone: lead.phone ? lead.phone.trim() : "--",
          type: "Warm",
          scheduledDate: "-",
          status: "Ongoing",
        });
      }
    }

    if (validLeads.length === 0) {
      return response.status(400).json({
        success: false,
        message: "No valid leads after validation",
        errors: validationErrors,
        skippedRows: validationErrors,
      });
    }

    // Assign leads using round-robin logic with threshold
    const assignments = await bulkAssignLeads(validLeads, User, Lead);

    // Create all leads in parallel using Promise.all
    const createdLeads = await Promise.all(
      assignments.map((leadData) =>
        new Lead({
          ...leadData,
          assignedDateLabel: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          }),
          stripe: "warm",
        }).save()
      )
    );

    // Create activity logs for all leads in parallel
    await Promise.all(
      createdLeads.map(async (lead) => {
        if (lead.assignedTo) {
          const assignedUser = await User.findById(lead.assignedTo);
          return Activity.create({
            message: `CSV lead ${lead.name} was assigned to ${assignedUser.firstName} ${assignedUser.lastName}`,
            actorEmail: request.user.email,
            type: "lead_assigned",
            leadId: lead._id,
            actorId: request.user.id,
          });
        } else {
          return Activity.create({
            message: `CSV lead ${lead.name} could not be assigned (no matching user for language: ${lead.language})`,
            actorEmail: request.user.email,
            type: "lead_assigned",
            leadId: lead._id,
            actorId: request.user.id,
          });
        }
      })
    );

    // Create overall CSV upload activity log
    await Activity.create({
      message: `You uploaded ${createdLeads.length} lead(s) via CSV${validationErrors.length > 0 ? ` (${validationErrors.length} rows skipped)` : ""}`,
      actorEmail: request.user.email,
      type: "csv_uploaded",
      actorId: request.user.id,
    });

    response.json({
      success: true,
      message: `${createdLeads.length} leads uploaded successfully${validationErrors.length > 0 ? ` (${validationErrors.length} rows skipped)` : ""}`,
      leads: createdLeads,
      skipped: validationErrors.length,
      skippedRows: validationErrors,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
