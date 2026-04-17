// API configuration and utility functions for frontend-backend communication

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

let authToken = localStorage.getItem("authToken");

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  }
}

function getAuthHeaders() {
  return {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
}

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API Error: ${response.status}`);
  }
  return response.json();
}

// Auth APIs
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) setAuthToken(data.token);
    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  logout: async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    setAuthToken(null);
  },
};

// Employees APIs
export const employeesAPI = {
  getAll: async (page = 1, limit = 8) => {
    const response = await fetch(`${API_BASE}/employees?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (userData) => {
    const response = await fetch(`${API_BASE}/employees`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  update: async (userId, userData) => {
    const response = await fetch(`${API_BASE}/employees/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  delete: async (userId) => {
    const response = await fetch(`${API_BASE}/employees/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Leads APIs
export const leadsAPI = {
  getAll: async (page = 1, limit = 11) => {
    const response = await fetch(`${API_BASE}/leads?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (leadData) => {
    const response = await fetch(`${API_BASE}/leads`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData),
    });
    return handleResponse(response);
  },

  update: async (leadId, leadData) => {
    const response = await fetch(`${API_BASE}/leads/${leadId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData),
    });
    return handleResponse(response);
  },

  delete: async (leadId) => {
    const response = await fetch(`${API_BASE}/leads/${leadId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  bulkUpload: async (csvFile) => {
    const formData = new FormData();
    formData.append("file", csvFile);

    const response = await fetch(`${API_BASE}/leads/bulk-csv-upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });
    return handleResponse(response);
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getMetrics: async () => {
    const response = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getChartData: async () => {
    const response = await fetch(`${API_BASE}/dashboard/chart-data`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getActivities: async (limit = 7) => {
    const response = await fetch(`${API_BASE}/dashboard/activities?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getEmployeeList: async () => {
    const response = await fetch(`${API_BASE}/dashboard/employees`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Breaks APIs
export const breaksAPI = {
  startBreak: async (userId) => {
    const response = await fetch(`${API_BASE}/breaks/${userId}/start`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  endBreak: async (userId) => {
    const response = await fetch(`${API_BASE}/breaks/${userId}/end`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
