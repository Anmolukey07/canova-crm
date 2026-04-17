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
- ⚙️ **Backend Health:** https://canova-crm-ohns.onrender.com/api/health

## 📌 Assignment Submission Links

- 🌐 User Side Deployed Link: https://canova-crm-frontend.netlify.app/user/login
- 🧭 Management Side Deployed Link: https://canova-crm-frontend.netlify.app/admin/dashboard
- ⚙️ Backend Deployed Link: https://canova-crm-ohns.onrender.com/api/health
- 💾 GitHub Repository Link: `<add-your-repo-link-here>`

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

## ☁️ Deployment Notes

### Netlify (Frontend)

- Build command: `npm run build`
- Publish directory: `dist`
- Env var:
  - `VITE_API_BASE_URL=https://canova-crm-ohns.onrender.com/api`

### Render (Backend)

- Build command: `npm install`
- Start command: `npm run server`
- Required env vars:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRE=7d`
  - `NODE_ENV=production`
  - `CORS_ORIGINS=https://canova-crm-frontend.netlify.app`

## 🧪 Troubleshooting

- ❗ If CORS errors appear, verify `CORS_ORIGINS` in Render and redeploy.
- ❗ If CSV upload shows HTML/JSON parse error, verify `VITE_API_BASE_URL` points to backend `/api`.
- ❗ If Render fails to connect to MongoDB Atlas, check Atlas IP whitelist (`0.0.0.0/0` for testing).

---

💡 Built for evaluation + real deployment flow with a production-ready structure.
