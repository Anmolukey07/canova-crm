# 🚀 Canova CRM

An end-to-end CRM project with a modern admin dashboard, user-side workflow, and deployed backend API.

## ✨ Highlights

- 🧭 Admin/Management dashboard
- 👨‍💼 User (sales employee) mobile-style interface
- ⚙️ Node.js + Express + MongoDB backend
- ⚛️ React + Vite frontend
- ☁️ Live deployment on Netlify + Render

## 🧰 Tech Stack

- **Frontend:** React, Vite, React Router, Recharts, Vanilla CSS
- **Backend:** Node.js, Express, Mongoose, JWT
- **Database:** MongoDB Atlas
- **Deployment:** Netlify (frontend), Render (backend)

## 🔗 Live Links

- 🌐 **User Side:** https://canova-crm-frontend.netlify.app/user/login
- 🧭 **Management Side:** https://canova-crm-frontend.netlify.app/admin/dashboard

## 🎯 Features

- ✅ Admin authentication and dashboard metrics
- ✅ Employee management (create, update, delete, bulk delete)
- ✅ Lead management (manual add, CSV upload, assignment logic)
- ✅ Role-based access (Admin/User)
- ✅ User-side lead updates (status, type, schedule)
- ✅ Activity feed, analytics charts, and pagination

## 🗂️ Project Structure

```text
.
├─ server/              # Express backend
├─ src/                 # React frontend
├─ public/              # Static assets
├─ netlify.toml         # Netlify config
├─ vercel.json          # Vercel SPA rewrite config
└─ package.json
```

## 🛠️ Local Setup

### 1) Clone and install

```bash
git clone <your-repo-url>
cd canova-crm
npm install
```

### 2) Create `.env` in project root

Use `.env.example` as reference:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRE=7d
PORT=5050
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5050/api
```

### 3) Start backend

```bash
npm run server
```

### 4) Start frontend

```bash
npm run dev
```

Frontend usually runs on `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev` - Start Vite frontend
- `npm run server` - Start Express backend
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build


