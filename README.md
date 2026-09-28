# CareerLog - Internship & Job Application Tracker

CareerLog is a comprehensive web application designed to help students track and manage their internship and job applications, recruitment stages, interview dates, and placement statuses.

---

## 🚀 Live Demo & Repository Links

- **Frontend Repository:** [https://github.com/Sowmiyanathan/Carrer-Log/tree/main/client](https://github.com/Sowmiyanathan/Carrer-Log/tree/main/client)
- **Backend Repository:** [https://github.com/Sowmiyanathan/Carrer-Log/tree/main/server](https://github.com/Sowmiyanathan/Carrer-Log/tree/main/server)
- **Deployed Application (Live Demo):** *(Provided upon hosting deployment - e.g., Vercel / Render)*

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React.js** (v18) with **Vite**
- **React Router DOM** (v6) for Client-side Navigation
- **Axios** with JWT Request Interceptor
- **Bootstrap 5** for Responsive UI styling

### Backend (`/server`)
- **Node.js** & **Express.js**
- **MongoDB** with **Mongoose ODM**
- **JSON Web Token (JWT)** for Secure Authentication
- **Bcrypt.js** for Password Hashing
- **CORS** & **Dotenv**

---

## 📂 Project Structure

```
careerlog/
├── client/                     # Frontend React Application
│   ├── src/
│   │   ├── api/                # Axios API instance & interceptors
│   │   ├── components/         # Reusable UI components (Navbar, Modals, Badges)
│   │   ├── context/            # AuthContext for global session state
│   │   ├── pages/              # Pages: Login, Register, Dashboard, AdminDashboard
│   │   ├── App.jsx             # Main App router
│   │   └── main.jsx            # Entry point
│   ├── vercel.json             # SPA routing rewrite for Vercel deployment
│   ├── vite.config.js          # Vite configuration & dev proxy
│   └── package.json
│
├── server/                     # Backend Express REST API
│   ├── config/                 # Database configuration (MongoDB)
│   ├── controllers/            # Route handlers (Auth, Applications, Admin)
│   ├── middleware/             # Auth verification & Admin role guard
│   ├── models/                 # Mongoose schemas (User, Application)
│   ├── routes/                 # Express API route endpoints
│   ├── seed.js                 # Database seeder script
│   ├── server.js               # Express server entry point
│   └── package.json
│
├── .gitignore                  # Git ignore rules for node_modules and .env
└── package.json                # Root helper scripts
```

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community Server or MongoDB Atlas cloud connection)

### 2. Setup Server (Backend)
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/careerlog
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend:
```bash
npm start
```
*(Optional: Run `npm run seed` to load sample users and application records)*

### 3. Setup Client (Frontend)
```bash
cd ../client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `POST` | `/api/auth/register` | Register new student account | No |
| `POST` | `/api/auth/login` | Login user & receive JWT | No |
| `GET` | `/api/auth/profile` | Get current user profile | Yes (User/Admin) |
| `GET` | `/api/applications` | Get user's applications | Yes (User) |
| `POST` | `/api/applications` | Add new application | Yes (User) |
| `PUT` | `/api/applications/:id` | Update application details/status | Yes (User) |
| `DELETE` | `/api/applications/:id` | Delete application | Yes (User) |
| `GET` | `/api/admin/stats` | Placement & application statistics | Yes (Admin) |
| `GET` | `/api/admin/applications` | View all student applications | Yes (Admin) |

---

## 👨‍🎓 Author
- **Student Name:** Sowmiyanathan
- **Project:** CareerLog - Capstone Project
