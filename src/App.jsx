import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STORAGE_KEY = "canova-crm-preview-v2";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const LANGUAGE_OPTIONS = ["Marathi", "Kannada", "Hindi", "English", "Bengali"];

const adminNavigation = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/leads", label: "Leads" },
  { path: "/admin/employees", label: "Employees" },
  { path: "/admin/settings", label: "Settings" },
];

const userNavigation = [
  { path: "/user/home", label: "Home", icon: "home" },
  { path: "/user/leads", label: "Leads", icon: "leads" },
  { path: "/user/schedule", label: "Schedule", icon: "calendar" },
  { path: "/user/profile", label: "Profile", icon: "profile" },
];

const dashboardChart = [
  { day: "Sat", value: 18 },
  { day: "Sun", value: 33 },
  { day: "Mon", value: 19 },
  { day: "Tue", value: 11 },
  { day: "Wed", value: 18 },
  { day: "Thu", value: 24 },
  { day: "Fri", value: 58 },
  { day: "Sat ", value: 46 },
  { day: "Sun ", value: 35 },
  { day: "Mon ", value: 18 },
  { day: "Tue ", value: 24 },
  { day: "Wed ", value: 21 },
  { day: "Thu ", value: 0 },
  { day: "Fri ", value: 0 },
];

const defaultState = {
  adminProfile: {
    firstName: "Sarthak",
    lastName: "Pal",
    email: "Sarthakpal08@gmail.com",
    password: "************",
    confirmPassword: "************",
  },
  employees: [
    {
      id: "emp-1",
      employeeId: "#23454GH6J7YT6",
      mongoId: "4f75-2g6t-t6hhu",
      firstName: "Tanner",
      lastName: "Finsha",
      name: "Tanner Finsha",
      email: "Tannerfisher@gmail.com",
      location: "Karnataka",
      language: "Kannada",
      assignedLeads: 5,
      closedLeads: 2,
      status: "Active",
      tone: "lavender",
    },
    {
      id: "emp-2",
      employeeId: "#23454GH6J7YT6",
      mongoId: "5f75-2g6t-t6hhu",
      firstName: "Emeto",
      lastName: "Winner",
      name: "Emeto Winner",
      email: "Emetowinner@gmail.com",
      location: "Karnataka",
      language: "Marathi",
      assignedLeads: 3,
      closedLeads: 1,
      status: "Active",
      tone: "peach",
    },
    {
      id: "emp-3",
      employeeId: "#23454GH6J7YT6",
      mongoId: "6f75-2g6t-t6hhu",
      firstName: "Tassy",
      lastName: "Omah",
      name: "Tassy Omah",
      email: "Tassyomah@gmail.com",
      location: "Karnataka",
      language: "Kannada",
      assignedLeads: 5,
      closedLeads: 0,
      status: "Inactive",
      tone: "photo",
    },
    {
      id: "emp-4",
      employeeId: "#23454GH6J7YT6",
      mongoId: "7f75-2g6t-t6hhu",
      firstName: "James",
      lastName: "Muriel",
      name: "James Muriel",
      email: "JamesMuriel@Aerten.finance",
      location: "Karnataka",
      language: "Marathi",
      assignedLeads: 2,
      closedLeads: 0,
      status: "Inactive",
      tone: "peach",
    },
    {
      id: "emp-5",
      employeeId: "#23454GH6J7YT6",
      mongoId: "8f75-2g6t-t6hhu",
      firstName: "Emeto",
      lastName: "Winner",
      name: "Emeto Winner",
      email: "Emetowinner@gmail.com",
      location: "Karnataka",
      language: "Kannada",
      assignedLeads: 1,
      closedLeads: 0,
      status: "Inactive",
      tone: "peach",
    },
    {
      id: "emp-6",
      employeeId: "#23454GH6J7YT6",
      mongoId: "9f75-2g6t-t6hhu",
      firstName: "Tassy",
      lastName: "Omah",
      name: "Tassy Omah",
      email: "Tassyomah@gmail.com",
      location: "Karnataka",
      language: "Marathi",
      assignedLeads: 8,
      closedLeads: 3,
      status: "Active",
      tone: "peach",
    },
    {
      id: "emp-7",
      employeeId: "#23454GH6J7YT6",
      mongoId: "af75-2g6t-t6hhu",
      firstName: "James",
      lastName: "Muriel",
      name: "James Muriel",
      email: "JamesMuriel@Aerten.finance",
      location: "Karnataka",
      language: "Marathi",
      assignedLeads: 6,
      closedLeads: 4,
      status: "Active",
      tone: "peach",
    },
    {
      id: "emp-8",
      employeeId: "#23454GH6J7YT6",
      mongoId: "bf75-2g6t-t6hhu",
      firstName: "Emeto",
      lastName: "Winner",
      name: "Emeto Winner",
      email: "Emetowinner@gmail.com",
      location: "Karnataka",
      language: "Kannada",
      assignedLeads: 4,
      closedLeads: 0,
      status: "Inactive",
      tone: "peach",
    },
  ],
  adminLeads: [
    {
      id: "lead-1",
      name: "John Smith",
      email: "johnsmit@gmail.com",
      phone: "949-365-6533",
      source: "Referral",
      date: "14-04-2026",
      location: "Mumbai",
      language: "Marathi",
      assignedEmployeeId: "emp-1",
      assignedTo: "4f75-2g6t-t6hhu",
      status: "Ongoing",
      type: "Warm",
      scheduledDate: "-",
      assignedDateLabel: "December 04, 2025",
      stripe: "hot",
      createdAt: "2026-04-14T09:10:00.000Z",
      assignedAt: "2026-04-14T09:10:00.000Z",
      updatedAt: "2026-04-14T09:10:00.000Z",
      closedAt: null,
    },
    {
      id: "lead-2",
      name: "Tanner Finsha",
      email: "Tannerfisher@gmail.com",
      phone: "365-865-8854",
      source: "Referral",
      date: "13-04-2026",
      location: "Brooklyn",
      language: "Kannada",
      assignedEmployeeId: "emp-1",
      assignedTo: "4f75-2g6t-t6hhu",
      status: "Ongoing",
      type: "Warm",
      scheduledDate: "18/04/26 02:30 PM",
      assignedDateLabel: "December 04, 2025",
      stripe: "warm",
      createdAt: "2026-04-13T10:30:00.000Z",
      assignedAt: "2026-04-13T10:30:00.000Z",
      updatedAt: "2026-04-13T10:30:00.000Z",
      closedAt: null,
    },
    {
      id: "lead-3",
      name: "Tanner Finsha",
      email: "Tannerfisher@gmail.com",
      phone: "654-692-8895",
      source: "Cold call",
      date: "12-04-2026",
      location: "Mumbai",
      language: "Marathi",
      assignedEmployeeId: "emp-1",
      assignedTo: "4f75-2g6t-t6hhu",
      status: "Closed",
      type: "Cold",
      scheduledDate: "-",
      assignedDateLabel: "December 04, 2025",
      stripe: "cold",
      createdAt: "2026-04-12T11:15:00.000Z",
      assignedAt: "2026-04-12T11:15:00.000Z",
      updatedAt: "2026-04-12T12:45:00.000Z",
      closedAt: "2026-04-12T12:45:00.000Z",
    },
    {
      id: "lead-4",
      name: "Priya Sharma",
      email: "priya.sharma@gmail.com",
      phone: "777-121-4567",
      source: "Referral",
      date: "11-04-2026",
      location: "Pune",
      language: "Marathi",
      assignedEmployeeId: "emp-6",
      assignedTo: "9f75-2g6t-t6hhu",
      status: "Closed",
      type: "Hot",
      scheduledDate: "-",
      assignedDateLabel: "April 11, 2026",
      stripe: "hot",
      createdAt: "2026-04-11T10:00:00.000Z",
      assignedAt: "2026-04-11T10:00:00.000Z",
      updatedAt: "2026-04-11T15:00:00.000Z",
      closedAt: "2026-04-11T15:00:00.000Z",
    },
    {
      id: "lead-5",
      name: "Kavya Rao",
      email: "kavya.rao@gmail.com",
      phone: "888-212-7865",
      source: "Website",
      date: "10-04-2026",
      location: "Bengaluru",
      language: "Kannada",
      assignedEmployeeId: "emp-2",
      assignedTo: "5f75-2g6t-t6hhu",
      status: "Ongoing",
      type: "Warm",
      scheduledDate: "-",
      assignedDateLabel: "April 10, 2026",
      stripe: "warm",
      createdAt: "2026-04-10T08:30:00.000Z",
      assignedAt: "2026-04-10T08:30:00.000Z",
      updatedAt: "2026-04-10T08:30:00.000Z",
      closedAt: null,
    },
    {
      id: "lead-6",
      name: "Rahul Deshmukh",
      email: "rahul.d@gmail.com",
      phone: "989-111-3232",
      source: "Campaign",
      date: "09-04-2026",
      location: "Nagpur",
      language: "Marathi",
      assignedEmployeeId: "emp-7",
      assignedTo: "af75-2g6t-t6hhu",
      status: "Closed",
      type: "Hot",
      scheduledDate: "-",
      assignedDateLabel: "April 09, 2026",
      stripe: "hot",
      createdAt: "2026-04-09T09:00:00.000Z",
      assignedAt: "2026-04-09T09:00:00.000Z",
      updatedAt: "2026-04-09T17:30:00.000Z",
      closedAt: "2026-04-09T17:30:00.000Z",
    },
    {
      id: "lead-7",
      name: "Sneha Kulkarni",
      email: "sneha.k@gmail.com",
      phone: "989-212-4545",
      source: "Referral",
      date: "08-04-2026",
      location: "Mumbai",
      language: "Marathi",
      assignedEmployeeId: "emp-6",
      assignedTo: "9f75-2g6t-t6hhu",
      status: "Ongoing",
      type: "Cold",
      scheduledDate: "-",
      assignedDateLabel: "April 08, 2026",
      stripe: "cold",
      createdAt: "2026-04-08T09:45:00.000Z",
      assignedAt: "2026-04-08T09:45:00.000Z",
      updatedAt: "2026-04-08T09:45:00.000Z",
      closedAt: null,
    },
    {
      id: "lead-8",
      name: "Megha Nair",
      email: "megha.nair@gmail.com",
      phone: "--",
      source: "Website",
      date: "07-04-2026",
      location: "Kochi",
      language: "English",
      assignedEmployeeId: null,
      assignedTo: "Unassigned",
      status: "Ongoing",
      type: "-",
      scheduledDate: "-",
      assignedDateLabel: "April 07, 2026",
      stripe: "warm",
      createdAt: "2026-04-07T11:20:00.000Z",
      assignedAt: null,
      updatedAt: "2026-04-07T11:20:00.000Z",
      closedAt: null,
    },
  ],
  activityFeed: [
    {
      id: "a-1",
      createdAt: "2026-04-14T09:12:00.000Z",
      message: "Admin assigned a new Marathi lead to Tanner Finsha",
      userEmail: "Tannerfisher@gmail.com",
      actorEmail: "admin@crm.com",
    },
    {
      id: "a-2",
      createdAt: "2026-04-14T10:02:00.000Z",
      message: "Tanner Finsha updated lead type to Warm",
      userEmail: "Tannerfisher@gmail.com",
      actorEmail: "Tannerfisher@gmail.com",
    },
    {
      id: "a-3",
      createdAt: "2026-04-14T10:15:00.000Z",
      message: "Tanner Finsha scheduled a lead for 18/04/26 02:30 PM",
      userEmail: "Tannerfisher@gmail.com",
      actorEmail: "Tannerfisher@gmail.com",
    },
    {
      id: "a-4",
      createdAt: "2026-04-14T10:25:00.000Z",
      message: "Priya Sharma lead was closed successfully",
      userEmail: "Tassyomah@gmail.com",
      actorEmail: "Tassyomah@gmail.com",
    },
    {
      id: "a-5",
      createdAt: "2026-04-14T10:32:00.000Z",
      message: "Admin updated default profile settings",
      userEmail: null,
      actorEmail: "admin@crm.com",
    },
    {
      id: "a-6",
      createdAt: "2026-04-14T10:35:00.000Z",
      message: "Tanner Finsha checked in for the day",
      userEmail: "Tannerfisher@gmail.com",
      actorEmail: "Tannerfisher@gmail.com",
    },
    {
      id: "a-7",
      createdAt: "2026-04-14T10:40:00.000Z",
      message: "Tanner Finsha ended a break session",
      userEmail: "Tannerfisher@gmail.com",
      actorEmail: "Tannerfisher@gmail.com",
    },
  ],
  adminActivities: [
    "You assigned a lead to Priya - 1 hour ago",
    "Jay closed a deal - 2 hours ago",
    "CSV upload verified and processed",
    "New employee created by admin",
    "Threshold routed a Marathi lead",
    "Settings updated successfully",
    "Lead schedule edited from user side",
  ],
  userLeads: [
    {
      id: "u-1",
      name: "Tanner Finsha",
      email: "@Tannerfisher@gmail.com",
      assignedDate: "December 04, 2025",
      status: "Ongoing",
      type: "Hot",
      scheduledAt: "",
      stripe: "hot",
    },
    {
      id: "u-2",
      name: "Tanner Finsha",
      email: "@Tannerfisher@gmail.com",
      assignedDate: "December 04, 2025",
      status: "Ongoing",
      type: "Warm",
      scheduledAt: "2026-04-14T14:30",
      stripe: "warm",
    },
    {
      id: "u-3",
      name: "Tanner Finsha",
      email: "@Tannerfisher@gmail.com",
      assignedDate: "December 04, 2025",
      status: "Closed",
      type: "Cold",
      scheduledAt: "",
      stripe: "cold",
    },
  ],
  scheduleItems: [
    {
      id: "s-1",
      from: "Referral",
      number: "949-365-6533",
      action: "Call",
      name: "Brooklyn Williamson",
      date: "10/04/25",
      highlighted: true,
    },
    {
      id: "s-2",
      from: "Referral",
      number: "365-865-8854",
      action: "Call",
      name: "Julie Watson",
      date: "12/04/25",
      highlighted: false,
    },
    {
      id: "s-3",
      from: "Cold call",
      number: "654-692-8895",
      action: "Call",
      name: "Jenny Alexander",
      date: "12/04/25",
      highlighted: false,
    },
  ],
  userTiming: {
    checkIn: "9:15 AM",
    checkOut: "--:-- --",
    breakStart: "--:-- --",
    breakEnd: "--:-- --",
    checkedIn: true,
    checkedOut: false,
    breakRunning: false,
    breakEnded: false,
    breakLogs: [
      { start: "01:25 pm", end: "02:15 PM", date: "10/04/25" },
      { start: "01:00 pm", end: "02:05 PM", date: "09/04/25" },
      { start: "01:05 pm", end: "02:30 PM", date: "08/04/25" },
      { start: "01:10 pm", end: "02:00 PM", date: "07/04/25" },
    ],
  },
  userActivities: [
    "You were assigned 3 more new lead - 1 hour ago",
    "You Closed a deal today - 2 hours ago",
    "Break started for the day",
    "Schedule time updated for a lead",
    "Type changed from Warm to Hot",
    "Checked in successfully",
    "Admin assigned a new Marathi lead",
  ],
  userSession: {
    email: "",
  },
};


const AppContext = createContext(null);

function hydrateState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return defaultState;
  }

  try {
    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      adminProfile: { ...defaultState.adminProfile, ...(parsed.adminProfile || {}) },
      userSession: { ...defaultState.userSession, ...(parsed.userSession || {}) },
      employees: parsed.employees || defaultState.employees,
      adminLeads: parsed.adminLeads || defaultState.adminLeads,
      activityFeed: parsed.activityFeed || defaultState.activityFeed,
    };
  } catch (error) {
    return defaultState;
  }
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatShortDate(date = new Date()) {
  return date.toLocaleDateString("en-GB").replace(/\//g, "/");
}

function parseCsvText(text) {
  const rows = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].split(",").map((header) => header.trim().toLowerCase());
  const required = ["name", "email", "source", "date", "location", "language"];

  if (!required.every((field) => headers.includes(field))) {
    return [];
  }

  return rows.slice(1).map((row, index) => {
    const values = row.split(",").map((value) => value.trim());
    const record = {};

    headers.forEach((header, headerIndex) => {
      record[header] = values[headerIndex] ?? "";
    });

    return {
      id: `csv-${Date.now()}-${index}`,
      name: record.name,
      email: record.email,
      source: record.source,
      date: record.date,
      location: record.location,
      language: record.language,

      status: record.status && record.status.trim() !== "" ? record.status : "Ongoing",

      type: record.type && record.type.trim() !== "" ? record.type : "warm",

      scheduledDate: record["scheduled date"] && record["scheduled date"].trim() !== ""
        ? record["scheduled date"]
        : "-",

      assignedTo: "",
    };
  });
}

function createEmployeeId() {
  return `emp-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

function createEmployeeCode() {
  return `#${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now()
    .toString()
    .slice(-4)}`;
}

function createAssignedToId() {
  return `${Math.random().toString(36).slice(2, 6)}-${Math.random()
    .toString(36)
    .slice(2, 6)}-${Math.random().toString(36).slice(2, 6)}`;
}

function isScheduledInFuture(value) {
  if (!value) {
    return false;
  }

  const match = value.match(/(\d{2})\/(\d{2})\/(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)/i);

  if (!match) {
    return false;
  }

  const [, day, month, year, hourRaw, minute, meridiem] = match;
  let hour = Number(hourRaw);

  if (meridiem.toUpperCase() === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  const scheduledDate = new Date(
    2000 + Number(year),
    Number(month) - 1,
    Number(day),
    hour,
    Number(minute)
  );

  return scheduledDate.getTime() > Date.now();
}

function chooseEmployee(language, employees, leads) {
  const activeEmployees = employees.filter((employee) => employee.status === "Active");
  const matchingEmployees = activeEmployees.filter(
    (employee) => employee.language.toLowerCase() === language.toLowerCase()
  );
  const pool = matchingEmployees.length > 0 ? matchingEmployees : [];

  if (pool.length === 0) {
    return null;
  }

  const assignedCounts = leads.reduce((accumulator, lead) => {
    if (lead.assignedEmployeeId) {
      accumulator[lead.assignedEmployeeId] =
        (accumulator[lead.assignedEmployeeId] || 0) + 1;
    }
    return accumulator;
  }, {});

  const belowThreshold = pool.filter((employee) => (assignedCounts[employee.id] || 0) < 3);
  const effectivePool = belowThreshold.length > 0 ? belowThreshold : pool;

  return [...effectivePool].sort((left, right) => {
    const leftCount = assignedCounts[left.id] || 0;
    const rightCount = assignedCounts[right.id] || 0;
    return leftCount - rightCount;
  })[0];
}

function applyAssignedLead(employees, leads, payload) {
  const assignedEmployee = chooseEmployee(payload.language, employees, leads);
  const assignedTo = assignedEmployee ? assignedEmployee.mongoId : "Unassigned";

  const updatedLead = {
    ...payload,
    assignedEmployeeId: assignedEmployee ? assignedEmployee.id : null,
    assignedTo,
  };

  return {
    lead: updatedLead,
    employees,
  };
}

function updateUserLead(list, id, changes) {
  return list.map((lead) => (lead.id === id ? { ...lead, ...changes } : lead));
}

function addActivity(state, message, userEmail = null, actorEmail = "admin@crm.com") {
  return [
    {
      id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      createdAt: new Date().toISOString(),
      message,
      userEmail,
      actorEmail,
    },
    ...(state.activityFeed || []),
  ].slice(0, 40);
}

function getEmployeeLeadStats(leads) {
  return leads.reduce((accumulator, lead) => {
    if (!lead.assignedEmployeeId) {
      return accumulator;
    }

    if (!accumulator[lead.assignedEmployeeId]) {
      accumulator[lead.assignedEmployeeId] = { assigned: 0, closed: 0 };
    }

    accumulator[lead.assignedEmployeeId].assigned += 1;

    if (lead.status === "Closed") {
      accumulator[lead.assignedEmployeeId].closed += 1;
    }

    return accumulator;
  }, {});
}

function normalizeEmployeeRecord(employee) {
  const id = employee?._id || employee?.id || "";
  const firstName = employee?.firstName || "";
  const lastName = employee?.lastName || "";

  return {
    ...employee,
    id,
    _id: id,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    mongoId: employee?.mongoId || id,
    assignedLeads: employee?.assignedLeads ?? 0,
    closedLeads: employee?.closedLeads ?? 0,
    status: employee?.status || "Active",
    tone: employee?.tone || "peach",
  };
}

function normalizeLeadRecord(lead) {
  const id = lead?._id || lead?.id || "";
  const normalizedType =
    !lead?.type || lead.type === "-" ? "Warm" : lead.type;
  const assignedUser =
    lead?.assignedTo && typeof lead.assignedTo === "object" ? lead.assignedTo : null;
  const assignedEmployeeId =
    assignedUser?._id ||
    (typeof lead?.assignedTo === "string" && lead.assignedTo !== "Unassigned"
      ? lead.assignedTo
      : null);

  return {
    ...lead,
    id,
    _id: id,
    phone: lead?.phone || "--",
    status: lead?.status || "Ongoing",
    type: normalizedType,
    scheduledDate: lead?.scheduledDate || "-",
    assignedEmployeeId,
    assignedTo: assignedEmployeeId || "Unassigned",
    assignedDateLabel: lead?.assignedDateLabel || "",
    stripe:
      lead?.stripe ||
      normalizedType.toLowerCase(),
  };
}

async function requestApi(path, options = {}) {
  const authToken = localStorage.getItem("authToken");
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
  }

  return payload;
}

function persistAuthToken(token) {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

async function loginAsDefaultAdmin() {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@crm.com",
      password: "admin123",
    }),
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload.token) {
    throw new Error(payload.message || "Auto-login failed");
  }

  persistAuthToken(payload.token);
  return payload.token;
}

function getWeekStart(date = new Date()) {
  const next = new Date(date);
  const day = next.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  next.setDate(next.getDate() + diff);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getDashboardMetrics(state) {
  const assignedLeads = state.adminLeads.filter((lead) => Boolean(lead.assignedEmployeeId));
  const closedLeads = assignedLeads.filter((lead) => lead.status === "Closed");
  const weekStart = getWeekStart();
  const assignedThisWeek = assignedLeads.filter(
    (lead) => new Date(lead.assignedAt || lead.createdAt) >= weekStart
  ).length;

  return {
    unassignedLeads: state.adminLeads.filter((lead) => !lead.assignedEmployeeId).length,
    assignedThisWeek,
    activeSalespeople: state.employees.filter(
      (employee) => employee.status === "Active" && (!employee.role || employee.role === "User")
    ).length,
    conversionRate: assignedLeads.length
      ? Math.round((closedLeads.length / assignedLeads.length) * 100)
      : 0,
  };
}

function getChartRows(leads) {
  const today = new Date();

  return Array.from({ length: 14 }, (_, index) => {
    const pointDate = new Date(today);
    pointDate.setDate(today.getDate() - (13 - index));
    pointDate.setHours(0, 0, 0, 0);

    const assigned = leads.filter((lead) => {
      const value = lead.assignedAt || lead.createdAt;
      if (!value) {
        return false;
      }

      const current = new Date(value);
      current.setHours(0, 0, 0, 0);
      return current.getTime() === pointDate.getTime();
    }).length;

    const closed = leads.filter((lead) => {
      if (!lead.closedAt) {
        return false;
      }

      const current = new Date(lead.closedAt);
      current.setHours(0, 0, 0, 0);
      return current.getTime() === pointDate.getTime();
    }).length;

    return {
      day: pointDate.toLocaleDateString("en-US", { weekday: "short" }),
      value: assigned ? Math.round((closed / assigned) * 100) : 0,
    };
  });
}

function getUserLeadRecords(state, currentUser) {
  if (!currentUser) {
    return [];
  }

  return state.adminLeads.filter((lead) => lead.assignedEmployeeId === currentUser.id);
}

function getVisibleActivities(state, currentUser) {
  const feed = [...(state.activityFeed || [])].sort(
    (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
  );

  if (!currentUser) {
    return feed.slice(0, 7);
  }

  return feed
    .filter(
      (activity) =>
        activity.userEmail?.toLowerCase() === currentUser.email.toLowerCase() ||
        activity.actorEmail?.toLowerCase() === currentUser.email.toLowerCase()
    )
    .slice(0, 7);
}

function getScheduleRows(state, currentUser) {
  return getUserLeadRecords(state, currentUser)
    .filter((lead) => lead.scheduledDate && lead.scheduledDate !== "-")
    .map((lead) => ({
      id: lead.id,
      from: lead.source,
      number: lead.phone || "--",
      action: "Call",
      name: lead.name,
      date: lead.scheduledDate.split(" ")[0],
      highlighted: isScheduledInFuture(lead.scheduledDate),
    }));
}

function appReducer(state, action) {
  switch (action.type) {
    case "saveAdminProfile":
      return {
        ...state,
        adminProfile: {
          ...state.adminProfile,
          ...action.payload,
        },
        activityFeed: addActivity(state, "Admin updated default profile settings"),
      };
    case "addEmployee":
      return {
        ...state,
        employees: [
          {
            id: createEmployeeId(),
            employeeId: createEmployeeCode(),
            mongoId: createAssignedToId(),
            name: `${action.payload.firstName} ${action.payload.lastName}`,
            assignedLeads: 0,
            closedLeads: 0,
            status: "Active",
            tone: "peach",
            ...action.payload,
          },
          ...state.employees,
        ],
        activityFeed: addActivity(
          state,
          `Admin created employee ${action.payload.firstName} ${action.payload.lastName}`
        ),
      };
    case "updateEmployee":
      return {
        ...state,
        employees: state.employees.map((employee) =>
          employee.id === action.payload.id
            ? {
              ...employee,
              ...action.payload,
              name: `${action.payload.firstName} ${action.payload.lastName}`,
            }
            : employee
        ),
        activityFeed: addActivity(
          state,
          `Admin edited employee ${action.payload.firstName} ${action.payload.lastName}`
        ),
      };
    case "deleteEmployee":
      return {
        ...state,
        employees: state.employees.filter((employee) => employee.id !== action.payload),
        activityFeed: addActivity(state, "Admin deleted an employee"),
      };
    case "bulkDeleteEmployees":
      return {
        ...state,
        employees: state.employees.filter(
          (employee) => !action.payload.includes(employee.id)
        ),
        activityFeed: addActivity(
          state,
          `Admin bulk deleted ${action.payload.length} employee(s)`
        ),
      };
    case "addLeadManually": {
      const nextLead = {
        id: `${Date.now()}`,
        phone: action.payload.phone || "--",
        status: "Ongoing",
        type: action.payload.type || "Warm",
        scheduledDate: action.payload.scheduledDate || "-",
        assignedDateLabel: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        }),
        stripe: "warm",
        createdAt: new Date().toISOString(),
        assignedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        closedAt: null,
        ...action.payload,
      };
      const assigned = applyAssignedLead(state.employees, state.adminLeads, nextLead);
      const matchedEmployee = state.employees.find(
        (employee) => employee.id === assigned.lead.assignedEmployeeId
      );

      return {
        ...state,
        employees: assigned.employees,
        adminLeads: [assigned.lead, ...state.adminLeads],
        activityFeed: addActivity(
          state,
          matchedEmployee
            ? `Admin added lead ${assigned.lead.name} and assigned it to ${matchedEmployee.name}`
            : `Admin added lead ${assigned.lead.name} but no user matched the language`,
          matchedEmployee?.email || null
        ),
      };
    }
    case "uploadCsvLeads": {
      let runningEmployees = [...state.employees];
      let runningLeads = [...state.adminLeads];
      let runningFeed = [...(state.activityFeed || [])];

      action.payload.forEach((lead) => {
        const assigned = applyAssignedLead(runningEmployees, runningLeads, {
          ...lead,
          phone: lead.phone || "--",
          type: lead.type || "Warm",
          status: lead.status || "Ongoing",
          assignedDateLabel: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
          }),
          stripe: "warm",
          createdAt: new Date().toISOString(),
          assignedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          closedAt: null,
        });
        runningEmployees = assigned.employees;
        runningLeads = [...runningLeads, assigned.lead];
        const matchedEmployee = state.employees.find(
          (employee) => employee.id === assigned.lead.assignedEmployeeId
        );
        runningFeed = addActivity(
          { activityFeed: runningFeed },
          matchedEmployee
            ? `CSV lead ${assigned.lead.name} was assigned to ${matchedEmployee.name}`
            : `CSV lead ${assigned.lead.name} could not be assigned`,
          matchedEmployee?.email || null
        );
      });

      return {
        ...state,
        employees: runningEmployees,
        adminLeads: runningLeads,
        activityFeed: addActivity(
          { activityFeed: runningFeed },
          `You uploaded ${action.payload.length} lead(s) via CSV`
        ),
      };
    }
    case "loginUser":
      return {
        ...state,
        userSession: {
          email: action.payload,
        },
      };
    case "logoutUser":
      return {
        ...state,
        userSession: {
          email: "",
        },
      };
    case "toggleCheckin": {
      if (!state.userTiming.checkedIn) {
        return {
          ...state,
          userTiming: {
            ...state.userTiming,
            checkIn: formatTime(),
            checkedIn: true,
            checkedOut: false,
          },
          activityFeed: addActivity(
            state,
            `${state.userSession.email || "User"} checked in for the day`,
            state.userSession.email,
            state.userSession.email
          ),
        };
      }

      return {
        ...state,
        userTiming: {
          ...state.userTiming,
          checkOut: formatTime(),
          checkedOut: true,
        },
        activityFeed: addActivity(
          state,
          `${state.userSession.email || "User"} checked out for the day`,
          state.userSession.email,
          state.userSession.email
        ),
      };
    }
    case "toggleBreak": {
      if (!state.userTiming.breakRunning) {
        return {
          ...state,
          userTiming: {
            ...state.userTiming,
            breakStart: formatTime(),
            breakEnd: "--:-- --",
            breakRunning: true,
            breakEnded: false,
          },
          activityFeed: addActivity(
            state,
            `${state.userSession.email || "User"} started a break`,
            state.userSession.email,
            state.userSession.email
          ),
        };
      }

      return {
        ...state,
        userTiming: {
          ...state.userTiming,
          breakEnd: formatTime(),
          breakRunning: false,
          breakEnded: true,
          breakLogs: [
            {
              start: state.userTiming.breakStart,
              end: formatTime(),
              date: formatShortDate(),
            },
            ...state.userTiming.breakLogs,
          ].slice(0, 4),
        },
        activityFeed: addActivity(
          state,
          `${state.userSession.email || "User"} ended a break`,
          state.userSession.email,
          state.userSession.email
        ),
      };
    }
    case "updateUserLeadType":
      return {
        ...state,
        adminLeads: updateUserLead(state.adminLeads, action.payload.id, {
          type: action.payload.type,
          stripe: action.payload.type.toLowerCase(),
          updatedAt: new Date().toISOString(),
        }),
        activityFeed: addActivity(
          state,
          `${state.userSession.email || "User"} updated a lead type to ${action.payload.type}`,
          state.userSession.email,
          state.userSession.email
        ),
      };
    case "scheduleUserLead":
      return {
        ...state,
        adminLeads: updateUserLead(state.adminLeads, action.payload.id, {
          scheduledDate: action.payload.scheduledAt || "-",
          updatedAt: new Date().toISOString(),
        }),
        activityFeed: addActivity(
          state,
          `${state.userSession.email || "User"} scheduled a lead for ${action.payload.scheduledAt}`,
          state.userSession.email,
          state.userSession.email
        ),
      };
    case "updateUserLeadStatus":
      return {
        ...state,
        adminLeads: updateUserLead(state.adminLeads, action.payload.id, {
          status: action.payload.status,
          closedAt:
            action.payload.status === "Closed" ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString(),
        }),
        activityFeed: addActivity(
          state,
          `${state.userSession.email || "User"} changed a lead status to ${action.payload.status}`,
          state.userSession.email,
          state.userSession.email
        ),
      };
    case "updateUserProfile": {
      const updatedEmployees = state.employees.map((employee) =>
        employee.email.toLowerCase() === state.userSession.email.toLowerCase()
          ? {
            ...employee,
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            name: `${action.payload.firstName} ${action.payload.lastName}`,
            email: action.payload.email,
          }
          : employee
      );

      return {
        ...state,
        employees: updatedEmployees,
        userSession: {
          email: action.payload.email,
        },
        activityFeed: addActivity(
          state,
          `${action.payload.firstName} ${action.payload.lastName} updated profile details`,
          action.payload.email,
          action.payload.email
        ),
      };
    }
    case "hydrate":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, defaultState, hydrateState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const syncState = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) {
        return;
      }

      try {
        dispatch({ type: "hydrate", payload: JSON.parse(event.newValue) });
      } catch (error) {
        // Ignore malformed cross-tab updates.
      }
    };

    window.addEventListener("storage", syncState);
    return () => window.removeEventListener("storage", syncState);
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useAppContext() {
  return useContext(AppContext);
}

function useCurrentUser() {
  const { state } = useAppContext();

  return state.employees.find(
    (employee) => employee.email.toLowerCase() === state.userSession.email.toLowerCase()
  );
}

function Icon({ name, className }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
  };

  const icons = {
    search: (
      <svg {...common}>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
    ),
    close: (
      <svg {...common}>
        <path d="M6 6 18 18" />
        <path d="M18 6 6 18" />
      </svg>
    ),
    upload: (
      <svg {...common}>
        <path d="M12 16V5" />
        <path d="m8.5 8.5 3.5-3.5 3.5 3.5" />
        <path d="M5 18.5h14" />
      </svg>
    ),
    home: (
      <svg {...common}>
        <path d="m4 10 8-6 8 6" />
        <path d="M6.5 10.5v8h11v-8" />
      </svg>
    ),
    leads: (
      <svg {...common}>
        <path d="M12 4v8" />
        <path d="m8 8 4 4 4-4" />
        <path d="M5 18h14" />
      </svg>
    ),
    calendar: (
      <svg {...common}>
        <path d="M7 3.5v4" />
        <path d="M17 3.5v4" />
        <rect x="4" y="6.5" width="16" height="13" rx="2.5" />
        <path d="M4 10.5h16" />
      </svg>
    ),
    profile: (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
      </svg>
    ),
    pencil: (
      <svg {...common}>
        <path d="m4 20 4-.8L18 9.2 14.8 6 4.8 16z" />
        <path d="m13.5 7.2 3.3 3.3" />
      </svg>
    ),
    clock: (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l3 2" />
      </svg>
    ),
    chevron: (
      <svg {...common}>
        <path d="m7 10 5 5 5-5" />
      </svg>
    ),
    filter: (
      <svg {...common}>
        <path d="M4 7h9" />
        <path d="M16 7h4" />
        <circle cx="14" cy="7" r="2" />
        <path d="M4 17h4" />
        <path d="M11 17h9" />
        <circle cx="9" cy="17" r="2" />
      </svg>
    ),
    dotMenu: (
      <svg {...common}>
        <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    previous: (
      <svg {...common}>
        <path d="m14 7-5 5 5 5" />
        <path d="M20 12H9" />
      </svg>
    ),
    next: (
      <svg {...common}>
        <path d="m10 7 5 5-5 5" />
        <path d="M4 12h11" />
      </svg>
    ),
    pin: (
      <svg {...common}>
        <path d="M12 20s5-5.3 5-9a5 5 0 1 0-10 0c0 3.7 5 9 5 9Z" />
        <circle cx="12" cy="11" r="1.8" />
      </svg>
    ),
  };

  return <span className={`icon ${className || ""}`}>{icons[name]}</span>;
}

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrapAuth = async () => {
      setAuthLoading(true);

      try {
        let nextToken = authToken;

        if (nextToken) {
          const validationResponse = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${nextToken}`,
            },
          });

          if (!validationResponse.ok) {
            persistAuthToken(null);
            nextToken = null;
          }
        }

        if (!nextToken) {
          nextToken = await loginAsDefaultAdmin();
        }

        if (!cancelled) {
          setAuthToken(nextToken);
        }
      } catch (error) {
        console.error("Auth bootstrap failed:", error);
        persistAuthToken(null);
        if (!cancelled) {
          setAuthToken(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  if (authLoading) {
    return <div style={{ padding: "2rem", fontSize: "16px" }}>Authenticating...</div>;
  }

  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="employees" element={<AdminEmployees />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<UserHome />} />
            <Route path="leads" element={<UserLeads />} />
            <Route path="schedule" element={<UserSchedule />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

function AdminLayout() {
  const [query, setQuery] = useState("");
  const location = useLocation();
  const showSearch = !location.pathname.endsWith("/settings");

  return (
    <div className="desktop-shell">
      <aside className="desktop-sidebar">
        <div className="desktop-brand">
          <span>Canova</span>
          <span className="brand-accent">CRM</span>
        </div>

        <nav className="desktop-nav">
          {adminNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `desktop-nav-item ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section
        className="desktop-main"
        style={{
          maxHeight: "100vh",   // full screen height
          overflowY: "auto"     // vertical scrollbar
        }}
      >
        <header className="desktop-header">
          {showSearch ? (
            <label className="desktop-search">
              <Icon name="search" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search here..."
              />
            </label>
          ) : (
            <div className="desktop-header-spacer" />
          )}
        </header>

        <Outlet
          context={{
            query,
            pageLabel:
              location.pathname.split("/").filter(Boolean).slice(-1)[0] || "dashboard",
          }}
        />
      </section>
    </div>
  );
}

function AdminDashboard() {
  const { query } = useOutletContext();
  const { state } = useAppContext();
  const [realMetrics, setRealMetrics] = useState(null);
  const [realLeads, setRealLeads] = useState([]);
  const [realEmployees, setRealEmployees] = useState([]);

  // Fetch real data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        };

        // Fetch all leads (no pagination)
        const leadsResponse = await fetch(`${API_BASE_URL}/leads?limit=10000`, { headers });
        const leadsData = leadsResponse.ok ? await leadsResponse.json() : null;

        // Fetch all employees (no pagination)
        const employeesResponse = await fetch(`${API_BASE_URL}/employees?limit=10000`, { headers });
        const employeesData = employeesResponse.ok ? await employeesResponse.json() : null;

        if (leadsData && employeesData) {
          const leads = leadsData.leads || [];
          const employees = employeesData.employees || [];

          setRealLeads(leads);
          setRealEmployees(employees);

          // Calculate metrics from real data
          const unassigned = leads.filter((lead) => !lead.assignedTo).length;
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - 7);
          weekStart.setHours(0, 0, 0, 0);

          const assignedThisWeek = leads.filter(
            (lead) => lead.assignedTo && new Date(lead.assignedAt || lead.createdAt) >= weekStart
          ).length;

          // Count only salespeople (Users), not admins
          const activeSalespeople = employees.filter(
            (emp) => emp.status === "Active" && emp.role === "User"
          ).length;

          const assignedLeads = leads.filter((lead) => lead.assignedTo);
          const closedLeads = leads.filter((lead) => lead.status === "Closed");
          const conversionRate = assignedLeads.length
            ? Math.round((closedLeads.length / assignedLeads.length) * 100)
            : 0;

          setRealMetrics({
            unassignedLeads: unassigned,
            assignedThisWeek,
            activeSalespeople,
            conversionRate,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const employeeStats = getEmployeeLeadStats(realLeads.length > 0 ? realLeads : state.adminLeads);
  const metrics = realMetrics || getDashboardMetrics(state);
  const chartRows = getChartRows(realLeads.length > 0 ? realLeads : state.adminLeads);
  const allActivities = getVisibleActivities(state, null).map(
    (activity) => activity.message
  );

  // Use real employees for preview with scroller, show all employees
  const topEmployees = realEmployees.length > 0 ? realEmployees : [];
  const normalizedQuery = query.trim().toLowerCase();

  const filteredActivities = useMemo(() => {
    if (!normalizedQuery) {
      return allActivities;
    }
    return allActivities.filter((activity) =>
      activity.toLowerCase().includes(normalizedQuery)
    );
  }, [allActivities, normalizedQuery]);

  const filteredTopEmployees = useMemo(() => {
    if (!normalizedQuery) {
      return topEmployees;
    }

    return topEmployees.filter((employee) => {
      const searchableText = [
        employee.firstName,
        employee.lastName,
        employee.name,
        employee.email,
        employee.employeeId,
        employee._id,
        employee.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [normalizedQuery, topEmployees]);

  return (
    <div className="desktop-page">
      <div className="desktop-breadcrumb">Home &nbsp;&gt;&nbsp; Dashboard</div>

      <div className="dashboard-metrics">
        <MetricCard label="Unassigned Leads" value={metrics.unassignedLeads} icon="upload" />
        <MetricCard label="Assigned This Week" value={metrics.assignedThisWeek} icon="profile" />
        <MetricCard label="Active Salespeople" value={metrics.activeSalespeople} icon="leads" />
        <MetricCard label="Conversion Rate" value={`${metrics.conversionRate}%`} icon="calendar" />
      </div>

      <div className="dashboard-grid">
        <section className="desk-card analytics-card">
          <h3>Sale Analytics</h3>
          <div className="analytics-wrap">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartRows} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ececec" />
                <XAxis dataKey="day" tick={{ fill: "#7c7c7c", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#7c7c7c", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                <Bar dataKey="value" fill="#d4d4d4" radius={[10, 10, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="desk-card activity-card">
          <h3>Recent Activity Feed</h3>
          <div className="desk-scroll">
            {filteredActivities.length === 0 ? (
              <p className="activity-line">No activity matches your search.</p>
            ) : (
              filteredActivities.map((activity) => (
                <p key={activity} className="activity-line">
                  • {activity}
                </p>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="desk-card employees-preview-card">
        <h3 style={{ marginBottom: "12px", paddingLeft: "12px" }}>
          Top Employees
        </h3>

        <div className="desk-table headless">
          <div className="desk-table-head desk-table-row">
            <span>Name</span>
            <span>Employee ID</span>
            <span>Assigned Leads</span>
            <span>Closed Leads</span>
            <span>Status</span>
          </div>

          {/* ðŸ‘‡ ADD THIS WRAPPER */}
          <div
            style={{
              maxHeight: "240px",   // approx height for 4 rows (adjust if needed)
              overflowY: "auto"
            }}
          >
            {filteredTopEmployees.length === 0 ? (
              <div style={{ padding: "1rem 1.25rem", color: "#8a8a8a" }}>
                No employees match your search.
              </div>
            ) : (
              filteredTopEmployees.map((employee) => (
                <div key={employee._id || employee.id} className="desk-table-row">
                  <div className="employee-name-cell">
                    <AvatarBadge employee={employee} />
                    <div>
                      <strong>{employee.firstName} {employee.lastName}</strong>
                      <span>{employee.email}</span>
                    </div>
                  </div>

                  <span className="pill-id">
                    {employee._id?.slice(-10) || employee.id || "-"}
                  </span>

                  <span>{employee.assignedLeads || 0}</span>
                  <span>{employee.closedLeads || 0}</span>

                  <StatusBadge status={employee.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <article className="metric-card-plain">
      <div className="metric-icon">
        <Icon name={icon} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function AdminEmployees() {
  const { query } = useOutletContext();
  const { dispatch } = useAppContext();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [modalEmployee, setModalEmployee] = useState(null);
  const [menuId, setMenuId] = useState("");
  const [realEmployees, setRealEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch real employees from backend - trigger on component mount and refreshTrigger
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");
        console.log("ðŸ” AdminEmployees: Fetching employees, token present:", !!authToken);

        if (!authToken) {
          console.log("â³ No token yet, will retry in 500ms");
          setTimeout(() => setRefreshTrigger(t => t + 1), 500);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/employees?limit=10000`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("âœ… Employees API Response:", data.employees);
          setRealEmployees(data.employees || []);
          dispatch({
            type: "hydrate",
            payload: {
              employees: (data.employees || []).map(normalizeEmployeeRecord),
            },
          });
        } else {
          const errorData = await response.json();
          console.error("âŒ Employees API Error:", response.status, errorData);
        }
      } catch (error) {
        console.error("âŒ Failed to fetch employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [dispatch, refreshTrigger]);

  // Use real employees if available, otherwise empty
  const employeesToDisplay = realEmployees.length > 0 ? realEmployees : [];

  const filtered = useMemo(
    () =>
      employeesToDisplay.filter((employee) => {
        const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return name.includes(query.toLowerCase());
      }),
    [query, employeesToDisplay]
  );

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const allChecked =
    visible.length > 0 &&
    visible.every((employee) => selected.includes(employee._id || employee.id));

  const handleDeleteEmployee = async (employeeId) => {
    const shouldDelete = window.confirm("Delete this employee?");
    if (!shouldDelete) {
      return;
    }

    try {
      await requestApi(`/employees/${employeeId}`, { method: "DELETE" });
      setSelected((current) => current.filter((item) => item !== employeeId));
      setRefreshTrigger((current) => current + 1);
    } catch (error) {
      window.alert(error.message || "Unable to delete employee.");
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) {
      return;
    }

    const shouldDelete = window.confirm(`Delete ${selected.length} employee(s)?`);
    if (!shouldDelete) {
      return;
    }

    try {
      await requestApi("/employees/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ ids: selected }),
      });
      setSelected([]);
      setRefreshTrigger((current) => current + 1);
    } catch (error) {
      window.alert(error.message || "Unable to delete selected employees.");
    }
  };

  return (
    <div className="desktop-page">
      <div className="desktop-page-head">
        <div className="desktop-breadcrumb">Home &nbsp;&gt;&nbsp; Employees</div>
        <button
          type="button"
          className="desk-action-button"
          onClick={() => setModalEmployee({ mode: "add" })}
        >
          Add Employees
        </button>
      </div>

      <section className="desk-card table-card">
        <div className="desk-table">
          <div className="desk-table-head desk-table-row">
            <label className="checkbox-shell">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={() =>
                  setSelected(
                    allChecked ? [] : visible.map((employee) => employee._id || employee.id)
                  )
                }
              />
            </label>
            <span>Name</span>
            <span>Employee ID</span>
            <span>Assigned Leads</span>
            <span>Closed Leads</span>
            <span>Status</span>
            <span />
          </div>

          {visible.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", gridColumn: "1/-1" }}>
              <p style={{ color: "#999" }}>
                {loading ? "Loading employees..." : "No employees found"}
              </p>
            </div>
          ) : (
            visible.map((employee) => (
              <div key={employee._id || employee.id} className="desk-table-row">
                <label className="checkbox-shell">
                  <input
                    type="checkbox"
                    checked={selected.includes(employee._id || employee.id)}
                    onChange={() => {
                      const empId = employee._id || employee.id;
                      setSelected((current) =>
                        current.includes(empId)
                          ? current.filter((item) => item !== empId)
                          : [...current, empId]
                      );
                    }}
                  />
                </label>
                <div className="employee-name-cell">
                  <AvatarBadge employee={employee} />
                  <div>
                    <strong>{employee.firstName} {employee.lastName}</strong>
                    <span>{employee.email}</span>
                  </div>
                </div>
                <span className="pill-id">{employee._id?.slice(-10) || employee.id || "-"}</span>
                <span>{employee.assignedLeads || 0}</span>
                <span>{employee.closedLeads || 0}</span>
                <StatusBadge status={employee.status} />
                <div className="menu-cell">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => setMenuId((current) => (current === employee.email ? "" : employee.email))}
                  >
                    <Icon name="dotMenu" />
                  </button>
                  {menuId === employee.email && (
                    <div className="table-menu">
                      <button
                        type="button"
                        onClick={() => {
                          setModalEmployee({ mode: "edit", employee });
                          setMenuId("");
                        }}
                      >
                        <Icon name="pencil" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleDeleteEmployee(employee._id || employee.id);
                          setMenuId("");
                        }}
                      >
                        <Icon name="calendar" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pagination-shell">
          <button type="button" className="pager-button" onClick={() => setPage(Math.max(1, page - 1))}>
            <Icon name="previous" /> Previous
          </button>
          <div className="page-list">
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map((item) => (
              <button
                key={item}
                type="button"
                className={`page-number ${item === page ? "active" : ""}`}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ))}
            {totalPages > 10 && <span>...</span>}
          </div>
          <button type="button" className="pager-button" onClick={() => setPage(Math.min(totalPages, page + 1))}>
            Next <Icon name="next" />
          </button>
        </div>
      </section>

      {selected.length > 0 && (
        <button
          type="button"
          className="floating-bulk-delete"
          onClick={() => {
            handleBulkDelete();
          }}
        >
          Delete Selected ({selected.length})
        </button>
      )}

      {modalEmployee && (
        <EmployeeModal
          employee={modalEmployee.employee}
          mode={modalEmployee.mode}
          onSaved={() => setRefreshTrigger((current) => current + 1)}
          onClose={() => setModalEmployee(null)}
        />
      )}
    </div>
  );
}

function AdminLeads() {
  const { query } = useOutletContext();
  const { dispatch } = useAppContext();
  const [showManual, setShowManual] = useState(false);
  const [showCsv, setShowCsv] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [csvStep, setCsvStep] = useState("select");
  const [csvProgress, setCsvProgress] = useState(60);
  const [parsedRows, setParsedRows] = useState([]);
  const [csvError, setCsvError] = useState("");
  const [realLeads, setRealLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch real leads from backend
  useEffect(() => {
    let cancelled = false;

    const fetchLeads = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
        }
        const authToken = localStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/leads?limit=10000`, {
          headers: {
            "Content-Type": "application/json",
            ...(authToken && { Authorization: `Bearer ${authToken}` }),
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (!cancelled) {
            setRealLeads(data.leads || []);
            dispatch({
              type: "hydrate",
              payload: {
                adminLeads: (data.leads || []).map(normalizeLeadRecord),
              },
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch leads:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchLeads();
    const pollTimer = setInterval(fetchLeads, 10000);

    return () => {
      cancelled = true;
      clearInterval(pollTimer);
    };
  }, [dispatch, refreshTrigger]); // refetch when refresh is triggered

  // Use real leads if available, otherwise fallback to mock data
  const leadsToDisplay = realLeads.length > 0 ? realLeads : [];

  const filtered = useMemo(
    () =>
      leadsToDisplay.filter((lead) =>
        `${lead.name} ${lead.email} ${lead.location}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, leadsToDisplay]
  );

  useEffect(() => {
    if (csvStep !== "verify") {
      return undefined;
    }

    const timer = setTimeout(() => {
      setCsvProgress(100);
    }, 900);

    return () => clearTimeout(timer);
  }, [csvStep]);

  const rows = filtered.slice((page - 1) * 11, page * 11);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 11));

  const resetCsvModal = () => {
    setShowCsv(false);
    setCsvStep("select");
    setSelectedFile(null);
    setParsedRows([]);
    setCsvProgress(60);
    setCsvError("");
  };

  return (
    <div className="desktop-page">
      <div className="desktop-page-head">
        <div className="desktop-breadcrumb">Home &nbsp;&gt;&nbsp; Leads</div>
        <div className="desk-action-group">
          <button type="button" className="desk-action-button" onClick={() => setShowManual(true)}>
            Add Manually
          </button>
          <button type="button" className="desk-action-button" onClick={() => setShowCsv(true)}>
            Add CSV
          </button>
        </div>
      </div>

      <section className="desk-card table-card">
        <div className="desk-table lead-table">
          <div className="desk-table-head desk-table-row lead-head-row">
            <span>No.</span>
            <span>Name</span>
            <span>Email</span>
            <span>Source</span>
            <span>Date</span>
            <span>Location</span>
            <span>Language</span>
            <span>Assigned To</span>
            <span>Status</span>
            <span>Type</span>
            <span>Scheduled Date</span>
          </div>
          {rows.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", gridColumn: "1/-1" }}>
              <p style={{ color: "#999" }}>
                {loading ? "Loading leads..." : "No leads found"}
              </p>
            </div>
          ) : (
            rows.map((lead, index) => (
              <div key={lead._id || lead.id} className="desk-table-row lead-data-row">
                <span>{(page - 1) * 11 + index + 1}</span>
                <span>{lead.name}</span>
                <span>{lead.email}</span>
                <span>{lead.source}</span>
                <span>{lead.date}</span>
                <span>{lead.location}</span>
                <span>{lead.language}</span>
                <span>{lead.assignedTo ? (typeof lead.assignedTo === 'object' ? `${lead.assignedTo.firstName} ${lead.assignedTo.lastName}` : lead.assignedTo) : "Unassigned"}</span>
                <span>{lead.status}</span>
                <span>{lead.type || "Warm"}</span>
                <span>{lead.scheduledDate}</span>
              </div>
            ))
          )}
        </div>

        <div className="pagination-shell">
          <button type="button" className="pager-button" onClick={() => setPage(Math.max(1, page - 1))}>
            <Icon name="previous" /> Previous
          </button>
          <div className="page-list">
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => i + 1).map((item) => (
              <button
                key={item}
                type="button"
                className={`page-number ${item === page ? "active" : ""}`}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            ))}
            {totalPages > 10 && <span>...</span>}
          </div>
          <button type="button" className="pager-button" onClick={() => setPage(Math.min(totalPages, page + 1))}>
            Next <Icon name="next" />
          </button>
        </div>
      </section>

      {showManual && (
        <ManualLeadModal
          onSaved={() => setRefreshTrigger((prev) => prev + 1)}
          onClose={() => setShowManual(false)}
        />
      )}

      {showCsv && (
        <ModalShell onClose={resetCsvModal}>
          <div className="csv-modal">
            <div className="modal-top">
              <div>
                <h3>CSV Upload</h3>
                <p>Add your documents here</p>
              </div>
              <button type="button" className="icon-button" onClick={resetCsvModal}>
                <Icon name="close" />
              </button>
            </div>

            {csvStep === "select" && (
              <>
                <label className="upload-dropzone">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setSelectedFile(file || null);
                      setCsvError("");
                    }}
                  />
                  <Icon name="upload" className="upload-icon" />
                  <strong>Drag your file(s) to start uploading</strong>
                  <span>OR</span>
                  <span className="browse-pill">Browse files</span>
                  <div className="upload-file-name">{selectedFile?.name || "Sample File.csv"}</div>
                </label>

                <div className="modal-actions">
                  <button type="button" className="modal-secondary" onClick={resetCsvModal}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="modal-primary dark"
                    onClick={() => {
                      if (!selectedFile) {
                        setCsvError("Please select a CSV file first.");
                        return;
                      }

                      fetch(`${API_BASE_URL}/parse-csv`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "text/csv",
                          "X-Filename": selectedFile.name,
                        },
                        body: selectedFile,
                      })
                        .then((response) => response.json())
                        .then((payload) => {
                          if (!payload.success) {
                            throw new Error(payload.message || "CSV parsing failed");
                          }

                          setParsedRows(payload.rows || []);
                          setCsvStep("verify");
                          setCsvError("");
                        })
                        .catch((error) => {
                          setCsvError(error.message || "CSV parsing failed");
                        });
                    }}
                  >
                    Next <Icon name="next" />
                  </button>
                </div>
                {csvError ? <p className="csv-error">{csvError}</p> : null}
              </>
            )}

            {csvStep === "verify" && (
              <>
                <div className="upload-dropzone verifying">
                  <div className="progress-ring">
                    <div className="progress-ring-inner">{csvProgress}%</div>
                  </div>
                  <strong>Verifying...</strong>
                  <button type="button" className="cancel-chip">
                    Cancel
                  </button>
                </div>

                <div className="modal-actions">
                  <button type="button" className="modal-secondary" onClick={resetCsvModal}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="modal-primary dark"
                    onClick={async () => {
                      try {
                        const authToken = localStorage.getItem("authToken");

                        if (!authToken) {
                          alert("Error: Not logged in. Please refresh the page.");
                          return;
                        }

                        const response = await fetch(`${API_BASE_URL}/leads/upload-parsed`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authToken}`,
                          },
                          body: JSON.stringify({ leads: parsedRows }),
                        });

                        const result = await response.json();

                        if (!response.ok) {
                          let errorMsg = result.message || "Failed to upload leads";

                          // Show detailed validation errors if available
                          if (result.skippedRows && result.skippedRows.length > 0) {
                            const errors = result.skippedRows
                              .map(row => `${row.name}: ${row.errors.join(", ")}`)
                              .join("\n");
                            errorMsg = `${result.message}\n\nErrors:\n${errors}`;
                          }

                          alert(`Validation Error:\n${errorMsg}`);
                          return;
                        }

                        // Update local state with the successfully created leads
                        setRefreshTrigger(prev => prev + 1);

                        // Show success message
                        alert(`âœ“ ${result.message}`);
                        resetCsvModal();
                      } catch (error) {
                        alert(`Error uploading leads: ${error.message}`);
                      }
                    }}
                  >
                    Upload
                  </button>
                </div>
              </>
            )}
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function AdminSettings() {
  const { state, dispatch } = useAppContext();
  const [form, setForm] = useState(state.adminProfile);

  useEffect(() => {
    setForm(state.adminProfile);
  }, [state.adminProfile]);

  return (
    <div className="desktop-page">
      <div className="desktop-breadcrumb">Home &nbsp;&gt;&nbsp; Settings</div>

      <section className="desk-card settings-card">
        <div className="settings-tab">Edit Profile</div>
        <div className="settings-grid">
          {[
            ["First name", "firstName"],
            ["Last name", "lastName"],
            ["Email", "email"],
            ["Password", "password"],
            ["Confirm Password", "confirmPassword"],
          ].map(([label, field]) => (
            <label key={field} className="field-block">
              <span>{label}</span>
              <input
                value={form[field]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [field]: event.target.value }))
                }
              />
            </label>
          ))}
        </div>

        <div className="settings-save-row">
          <button
            type="button"
            className="desk-action-button muted"
            onClick={() => dispatch({ type: "saveAdminProfile", payload: form })}
          >
            Save
          </button>
        </div>
      </section>
    </div>
  );
}

function ModalShell({ children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function EmployeeModal({ mode, employee, onClose, onSaved }) {
  const [form, setForm] = useState(
    employee || {
      firstName: "Sarthak",
      lastName: "Pal",
      email: "Sarthakpal08@gmail.com",
      location: "Karnataka",
      language: "Marathi",
    }
  );
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      location: form.location.trim(),
      language: form.language,
    };

    if (!payload.firstName || !payload.lastName || !payload.email) {
      setError("First name, last name, and email are required.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      if (mode === "edit") {
        await requestApi(`/employees/${employee._id || employee.id}`, {
          method: "PUT",
          body: JSON.stringify({
            firstName: payload.firstName,
            lastName: payload.lastName,
            location: payload.location,
            language: payload.language,
          }),
        });
      } else {
        await requestApi("/employees", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      onSaved?.();
      onClose();
    } catch (saveError) {
      setError(saveError.message || "Unable to save employee.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="form-modal">
        <div className="modal-top">
          <h3>{mode === "edit" ? "Edit Employee" : "Add New Employee"}</h3>
          <button type="button" className="icon-button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="modal-form-grid">
          {[
            ["First name", "firstName"],
            ["Last name", "lastName"],
            ["Email", "email"],
            ["Location", "location"],
          ].map(([label, field]) => (
            <label key={field} className="field-block">
              <span>{label}</span>
              <input
                value={form[field]}
                disabled={mode === "edit" && field === "email"}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [field]: event.target.value }))
                }
              />
            </label>
          ))}
          <label className="field-block">
            <span>Preferred Language</span>
            <select
              value={form.language}
              onChange={(event) =>
                setForm((current) => ({ ...current, language: event.target.value }))
              }
            >
              {["Marathi", "Kannada", "Hindi", "English", "Bengali"].map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? <p className="csv-error">{error}</p> : null}

        <div className="modal-actions end">
          <button
            type="button"
            className="desk-action-button muted"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ManualLeadModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "Sarthak Pal",
    email: "Sarthakpal08@gmail.com",
    source: "Referral",
    date: "12/10/25",
    location: "Mumbai",
    language: "Marathi",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      source: form.source.trim(),
      date: form.date.trim(),
      location: form.location.trim(),
      language: form.language,
    };

    if (!payload.name || !payload.email || !payload.source || !payload.date || !payload.location) {
      setError("All lead fields are required.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      await requestApi("/leads", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      onSaved?.();
      onClose();
    } catch (saveError) {
      setError(saveError.message || "Unable to save lead.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="form-modal narrow">
        <div className="modal-top">
          <h3>Add New Lead</h3>
          <button type="button" className="icon-button" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>

        <div className="modal-form-grid">
          {[
            ["Name", "name"],
            ["Email", "email"],
            ["Source", "source"],
            ["Date", "date"],
            ["Location", "location"],
          ].map(([label, field]) => (
            <label key={field} className="field-block">
              <span>{label}</span>
              <input
                value={form[field]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [field]: event.target.value }))
                }
              />
            </label>
          ))}
          <label className="field-block">
            <span>Preferred Language</span>
            <select
              value={form.language}
              onChange={(event) =>
                setForm((current) => ({ ...current, language: event.target.value }))
              }
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? <p className="csv-error">{error}</p> : null}

        <div className="modal-actions start">
          <button
            type="button"
            className="desk-action-button muted"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function UserLayout() {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return <Navigate to="/user/login" replace />;
  }

  return (
    <div className="mobile-backdrop">
      <div className="mobile-shell">
        <div className="mobile-stage">
          <Outlet />
        </div>
        <nav className="mobile-nav">
          {userNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="phone-home-indicator" />
      </div>
    </div>
  );
}

function UserLogin() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="mobile-backdrop">
      <div className="mobile-shell login-shell">
        <div className="login-panel">
          <div className="login-brand">
            <span>Canova</span>
            <span className="brand-accent">CRM</span>
          </div>

          <div className="login-fields">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email"
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              type="password"
            />
            <button
              type="button"
              onClick={() => {
                const employee = state.employees.find(
                  (item) =>
                    item.email.toLowerCase() === email.toLowerCase() &&
                    password.toLowerCase() === item.email.toLowerCase()
                );

                if (!employee) {
                  setError("Login uses the email created by admin, and the password is the same as email.");
                  return;
                }

                dispatch({ type: "loginUser", payload: employee.email });
                navigate("/user/home");
              }}
            >
              Submit
            </button>
            {error ? <p className="login-error">{error}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function UserHome() {
  const { state, dispatch } = useAppContext();
  const currentUser = useCurrentUser();
  const activities = getVisibleActivities(state, currentUser).map(
    (activity) => activity.message
  );

  return (
    <>
      <MobileHero title={`${currentUser.firstName} ${currentUser.lastName}`} subtitle="Good Morning" />

      <div className="mobile-section">
        <h3>Timings</h3>
        <div className="timing-card" onClick={() => dispatch({ type: "toggleCheckin" })}>
          <div>
            <span>Checked-In</span>
            <strong>{state.userTiming.checkIn}</strong>
          </div>
          <div>
            <span>Check Out</span>
            <strong>{state.userTiming.checkOut}</strong>
          </div>
          <button type="button" className={`status-toggle ${state.userTiming.checkedIn ? "green" : "grey"}`} />
        </div>

        <div className="timing-card" onClick={() => dispatch({ type: "toggleBreak" })}>
          <div>
            <span>Break</span>
            <strong>{state.userTiming.breakStart}</strong>
          </div>
          <div>
            <span>Ended</span>
            <strong>{state.userTiming.breakEnd}</strong>
          </div>
          <button
            type="button"
            className={`status-toggle ${state.userTiming.breakRunning
                ? "green"
                : state.userTiming.breakEnded
                  ? "red"
                  : "grey"
              }`}
          />
        </div>

        <div
          className="break-log-card"
          style={{
            maxHeight: "190px",   // adjust based on your row height (~4 rows)
            overflowY: "auto",
          }}
        >
          {state.userTiming.breakLogs.map((log) => (
            <div key={`${log.date}-${log.start}`} className="break-row">
              <div>
                <span>Break</span>
                <strong style={{ fontSize: "14px" }}>{log.start}</strong>
              </div>
              <div>
                <span>Ended</span>
                <strong style={{ fontSize: "14px" }}>{log.end}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong style={{ fontSize: "14px" }}>{log.date}</strong>
              </div>
            </div>
          ))}
        </div>

        <h3>Recent Activity</h3>
        <div className="mobile-activity-box" style={{
          maxHeight: "110px",
          fontSize: "14px"
        }}>
          {activities.map((activity) => (
            <p key={activity}>â€¢ {activity}</p>
          ))}
        </div>
      </div>
    </>
  );
}

function UserLeads() {
  const { state, dispatch } = useAppContext();
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState("");
  const [popover, setPopover] = useState(null);
  const [scheduleDraft, setScheduleDraft] = useState({ date: "", time: "" });
  const [toast, setToast] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      return undefined;
    }

    let cancelled = false;

    const fetchLeads = async () => {
      try {
        const payload = await requestApi("/leads?limit=10000");
        if (cancelled) {
          return;
        }

        dispatch({
          type: "hydrate",
          payload: {
            adminLeads: (payload.leads || []).map(normalizeLeadRecord),
          },
        });
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to sync user leads:", error);
        }
      }
    };

    fetchLeads();

    return () => {
      cancelled = true;
    };
  }, [currentUser, dispatch, refreshTrigger]);

  const updateLead = async (leadId, changes, fallbackError) => {
    try {
      await requestApi(`/leads/${leadId}`, {
        method: "PUT",
        body: JSON.stringify(changes),
      });
      setRefreshTrigger((current) => current + 1);
      return true;
    } catch (error) {
      setToast(error.message || fallbackError || "Unable to update lead.");
      return false;
    }
  };

  const visibleLeads = useMemo(
    () =>
      getUserLeadRecords(state, currentUser).filter((lead) =>
        `${lead.name} ${lead.email}`.toLowerCase().includes(query.toLowerCase())
      ),
    [currentUser, query, state]
  );

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      <MobileHero title="Leads" back />

      <div className="mobile-section">
        <label className="mobile-search">
          <Icon name="search" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
        </label>

        <div
          className="mobile-card-list"
          style={{
            maxHeight: "455px",   // or set specific height like "400px"
            overflowY: "auto",
            marginRight: "-1rem", // to account for padding and avoid horizontal scrollbar
          }}
        >
          {visibleLeads.map((lead) => (
            <article key={lead.id} className={`lead-mobile-card ${lead.stripe}`}>
              <div className="lead-card-top">
                <div>
                  <strong>{lead.name}</strong>
                  <span>{lead.email}</span>
                </div>
                <div className={`lead-status-ring ${lead.status.toLowerCase()} ${lead.stripe}`}>{lead.status}</div>
              </div>

              <div className="lead-date-row">
                <span>{lead.assignedDateLabel}</span>
                <div className="lead-actions">
                  <button type="button" className="icon-link" onClick={() => setPopover({ leadId: lead.id, type: "type" })}>
                    <Icon name="pencil" />
                  </button>
                  <button
                    type="button"
                    className="icon-link"
                    onClick={() => {
                      setScheduleDraft({ date: "", time: "" });
                      setPopover({ leadId: lead.id, type: "schedule" });
                    }}
                  >
                    <Icon name="clock" />
                  </button>
                  <button type="button" className="icon-link" onClick={() => setPopover({ leadId: lead.id, type: "status" })}>
                    <Icon name="chevron" />
                  </button>
                </div>
              </div>

              {popover?.leadId === lead.id && popover.type === "type" && (
                <div className="mini-popover type-popover">
                  <span>Type</span>
                  {["Hot", "Warm", "Cold"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`type-chip ${type.toLowerCase()}`}
                      onClick={async () => {
                        const updated = await updateLead(
                          lead.id,
                          { type },
                          "Unable to update lead type."
                        );
                        if (updated) {
                          setPopover(null);
                        }
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}

              {popover?.leadId === lead.id && popover.type === "schedule" && (
                <div className="mini-popover schedule-popover">
                  <span>Date</span>
                  <input type="text" placeholder="dd/mm/yy" value={scheduleDraft.date} onChange={(event) => setScheduleDraft((current) => ({ ...current, date: event.target.value }))} />
                  <span>Time</span>
                  <input type="text" placeholder="02:30 PM" value={scheduleDraft.time} onChange={(event) => setScheduleDraft((current) => ({ ...current, time: event.target.value }))} />
                  <button
                    type="button"
                    className="popover-save"
                    onClick={async () => {
                      const scheduledAt =
                        `${scheduleDraft.date} ${scheduleDraft.time}`.trim() || "-";
                      const updated = await updateLead(
                        lead.id,
                        { scheduledDate: scheduledAt },
                        "Unable to schedule lead."
                      );
                      if (updated) {
                        setPopover(null);
                      }
                    }}
                  >
                    Save
                  </button>
                </div>
              )}

              {popover?.leadId === lead.id && popover.type === "status" && (
                <div className="mini-popover status-popover">
                  <span>Lead Status</span>
                  {["Ongoing", "Closed"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={`status-option ${status.toLowerCase()}`}
                      onClick={async () => {
                        if (status === "Closed" && isScheduledInFuture(lead.scheduledDate)) {
                          setToast("Lead can not be closed if scheduled");
                          return;
                        }

                        const updated = await updateLead(
                          lead.id,
                          { status },
                          "Unable to update lead status."
                        );
                        if (updated) {
                          setPopover(null);
                        }
                      }}
                    >
                      {status}
                    </button>
                  ))}
                  <button type="button" className="popover-save" onClick={() => setPopover(null)}>
                    Save
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>

        {toast ? <div className="mobile-toast">{toast}</div> : null}
      </div>
    </>
  );
}

function UserSchedule() {
  const { state } = useAppContext();
  const currentUser = useCurrentUser();
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    const searched = getScheduleRows(state, currentUser).filter((item) =>
      `${item.from} ${item.number} ${item.name}`.toLowerCase().includes(query.toLowerCase())
    );

    if (filter === "All") {
      return searched;
    }

    const today = new Date().toLocaleDateString("en-GB").slice(0, 8);
    return searched.filter((item) => item.date === today);
  }, [currentUser, filter, query, state]);

  return (
    <>
      <MobileHero title="Schedule" back />

      <div className="mobile-section">
        <div className="schedule-toolbar">
          <label className="mobile-search">
            <Icon name="search" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
          </label>
          <button type="button" className="filter-button" onClick={() => setFilterOpen((current) => !current)}>
            <Icon name="filter" />
          </button>
          {filterOpen && (
            <div className="mini-popover filter-popover">
              <span>Filter</span>
              <button type="button" className="filter-select">{filter}</button>
              <div className="filter-list">
                {["Today", "All"].map((item) => (
                  <button key={item} type="button" onClick={() => setFilter(item)}>
                    {item}
                  </button>
                ))}
              </div>
              <button type="button" className="popover-save" onClick={() => setFilterOpen(false)}>
                Save
              </button>
            </div>
          )}
        </div>

        <div className="schedule-list">
          {filtered.map((item) => (
            <article key={item.id} className={`schedule-card ${item.highlighted ? "highlighted" : ""}`}>
              <div className="schedule-head">
                <strong>{item.from}</strong>
                <div>
                  <span>Date</span>
                  <strong>{item.date}</strong>
                </div>
              </div>
              <p>{item.number}</p>
              <div className="schedule-meta">
                <Icon name="pin" />
                <span>{item.action}</span>
              </div>
              <p>{item.name}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function UserProfile() {
  const { dispatch } = useAppContext();
  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    password: currentUser.email,
    confirmPassword: currentUser.email,
  });

  return (
    <>
      <MobileHero title="Profile" back />

      <div className="mobile-section">
        <div className="mobile-form">
          {[
            ["First name", "firstName"],
            ["Last name", "lastName"],
            ["Email", "email"],
            ["Password", "password"],
            ["Confirm Password", "confirmPassword"],
          ].map(([label, field]) => (
            <label key={field} className="field-block mobile-field">
              <span>{label}</span>
              <input
                type={field.toLowerCase().includes("password") ? "password" : "text"}
                value={form[field]}
                onChange={(event) =>
                  setForm((current) => ({ ...current, [field]: event.target.value }))
                }
              />
            </label>
          ))}
        </div>

        <div className="profile-actions">
          <button type="button" className="profile-save" onClick={() => dispatch({ type: "updateUserProfile", payload: form })}>
            Save
          </button>
          <button
            type="button"
            className="profile-logout"
            onClick={() => {
              dispatch({ type: "logoutUser" });
              navigate("/user/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

function MobileHero({ title, subtitle, back = false }) {
  return (
    <header className="mobile-hero">
      <div className="mobile-brand">
        <span>Canova</span>
        <span className="brand-accent">CRM</span>
      </div>
      {back ? <div className="mobile-title-row">â€¹ <span>{title}</span></div> : null}
      {!back ? (
        <>
          <p>{subtitle}</p>
          <h2>{title}</h2>
        </>
      ) : null}
    </header>
  );
}

function AvatarBadge({ employee }) {
  if (employee.tone === "photo") {
    return <img src="/assets/avatar-1.png" alt={employee.name} className="employee-photo" />;
  }

  return (
    <div className={`avatar-badge ${employee.tone}`}>
      {employee.firstName[0]}
      {employee.lastName[0]}
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
}

export default App;
