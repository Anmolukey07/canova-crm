# Backend Setup Instructions

## Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. MongoDB Setup:
   
   **Option A: Local MongoDB**
   - Install MongoDB Community Edition
   - Start MongoDB service
   - Default .env is configured for: `mongodb://localhost:27017/crm-system`

   **Option B: MongoDB Atlas (Cloud)**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get connection string
   - Update .env: `MONGODB_URI=your_atlas_connection_string`

3. Update .env (optional):
```
MONGODB_URI=mongodb://localhost:27017/crm-system
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
PORT=5050
NODE_ENV=development
```

## Running the Server

Start backend only:
```bash
npm run server
```

Start frontend only (from root):
```bash
npm run dev
```

Server runs at: http://127.0.0.1:5050
Frontend proxy configured to: http://127.0.0.1:5050

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout

### Employees (Admin only)
- `GET /api/employees` - List employees
- `GET /api/employees/:id` - Get employee
- `POST /api/employees` - Create employee (default password = email)
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `POST /api/employees/bulk-delete` - Bulk delete employees

### Leads (Admin only for create/CSV, Users can view/update own)
- `GET /api/leads` - List leads
- `GET /api/leads/:id` - Get lead
- `POST /api/leads` - Create lead manually
- `PUT /api/leads/:id` - Update lead (type, scheduledDate, status)
- `POST /api/leads/bulk-csv-upload` - Bulk upload from CSV

### Dashboard (Admin only)
- `GET /api/dashboard/metrics` - Get KPI metrics
- `GET /api/dashboard/chart-data` - Get 2-week conversion data
- `GET /api/dashboard/activities` - Get last 7 activities
- `GET /api/dashboard/active-salespeople` - Get active salespeople

### Admin Settings
- `GET /api/admin/profile` - Get admin profile
- `PUT /api/admin/profile` - Update admin profile

## Default Admin Account
- Email: `admin@crm.com`
- Password: `admin123`

## Features Implemented

✅ MongoDB with Mongoose models
✅ User authentication with JWT tokens
✅ Password hashing with bcryptjs
✅ Role-based access control (Admin/User)
✅ Lead assignment with round-robin + language matching
✅ Threshold-based distribution (3 leads per user)
✅ CSV parsing and bulk lead upload
✅ Activity tracking
✅ MongoDB indexes on:
   - Lead.language
   - Lead.assignedTo
   - Lead.status
✅ Error handling middleware
✅ CORS enabled for frontend
✅ Promise.all() for bulk operations

## Database Schemas

### User
- firstName, lastName, email, password (hashed)
- role (Admin/User), language, location, status
- assignedLeads, closedLeads counters

### Lead
- name, email, phone, source, date, location, language
- assignedTo (User ID), status, type, scheduledDate
- createdAt, assignedAt, closedAt, updatedAt

### Activity
- message, type, userEmail, actorEmail
- Tracks: lead assignments, lead updates, employee creation, settings changes

## Notes
- All admin operations require JWT authentication
- Users can only view/update their own leads
- Lead assignment happens automatically based on language and threshold
- Activity feed logs all major system events
- Passwords are hashed using bcryptjs (10 salt rounds)
