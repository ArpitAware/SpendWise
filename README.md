# 💰 SpendWise — Full-Stack Expense Tracker

A production-ready expense tracking web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). Features JWT authentication, interactive charts, budget alerts, CSV export, dark mode, and a fully responsive UI.

![SpendWise Dashboard](https://placehold.co/1200x630/6366f1/ffffff?text=SpendWise+Dashboard)

---

## ✨ Features

### Core
- 🔐 **JWT Authentication** — Secure login/signup with access + refresh token rotation
- 💸 **Expense Management** — Add, edit, delete expenses with categories and payment methods
- 🔍 **Search & Filter** — Filter by category, date range, payment method; full-text search
- 📄 **Pagination** — Efficient pagination for large datasets

### Advanced
- 📊 **Interactive Charts** — Monthly area charts, category pie charts, bar charts via Recharts
- 🎯 **Budget Tracking** — Set monthly limits per category with customizable alert thresholds
- 📁 **CSV Export** — Download all expenses as a spreadsheet
- 🌙 **Dark / Light Mode** — Persisted theme preference with system detection
- 📱 **Fully Responsive** — Mobile-first design with slide-out sidebar

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  React.js Frontend                   │
│  Context API · Axios (interceptors) · Recharts       │
│  React Hook Form · React Router v6 · Tailwind CSS   │
└──────────────────────┬──────────────────────────────┘
                       │ REST API (HTTPS)
┌──────────────────────▼──────────────────────────────┐
│              Node.js + Express.js API                │
│  JWT Auth · Rate Limiting · Helmet · CORS            │
│  MVC: Routes → Controllers → Models                  │
│  express-validator · winston logger                  │
└──────────────────────┬──────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────┐
│                  MongoDB Atlas                        │
│  Users · Expenses · Budgets                          │
│  Indexes on (user, date) · (user, category)          │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
expense-tracker/
├── backend/
│   ├── config/             # DB connection, env helpers
│   ├── controllers/        # Business logic handlers
│   │   ├── auth.controller.js
│   │   ├── expense.controller.js
│   │   └── budget.controller.js
│   ├── middleware/         # Auth guard, error handler
│   ├── models/             # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Expense.model.js
│   │   └── Budget.model.js
│   ├── routes/             # Express route definitions
│   ├── utils/              # Logger (winston)
│   ├── validators/         # express-validator rules
│   ├── .env.example
│   ├── package.json
│   └── server.js           # Entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── auth/       # Login/Register form pieces
    │   │   ├── budget/     # BudgetCard, BudgetForm
    │   │   ├── expenses/   # ExpenseForm, ExpenseTable, FilterBar
    │   │   ├── layout/     # Layout, Sidebar, Navbar
    │   │   └── ui/         # Modal, Pagination, LoadingSpinner
    │   ├── context/        # AuthContext, ThemeContext
    │   ├── hooks/          # useExpenses (custom hook)
    │   ├── pages/          # DashboardPage, ExpensesPage, BudgetPage, etc.
    │   ├── services/       # api.js (Axios instance + API calls)
    │   ├── utils/          # formatters, constants
    │   ├── App.jsx         # Root with routing
    │   └── main.jsx        # Entry point
    ├── .env.example
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier) or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
```

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/expense-tracker
JWT_SECRET=your_min_32_char_secret_here
JWT_REFRESH_SECRET=another_min_32_char_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev   # Starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

cp .env.example .env
# .env already points to localhost:5000 — no changes needed for local dev
```

```bash
npm run dev   # Starts on http://localhost:3000
```

> The Vite dev server proxies `/api/*` requests to `localhost:5000` automatically.

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

All protected routes require:
```
Authorization: Bearer <accessToken>
```

---

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Create new account |
| POST | `/auth/login` | ❌ | Login and get tokens |
| POST | `/auth/refresh` | ❌ | Refresh access token |
| POST | `/auth/logout` | ✅ | Invalidate refresh token |
| GET | `/auth/me` | ✅ | Get current user profile |
| PATCH | `/auth/profile` | ✅ | Update name/currency/theme |

#### Register — `POST /auth/register`
```json
// Request
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret1" }

// Response 201
{
  "success": true,
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com" }
}
```

#### Login — `POST /auth/login`
```json
// Request
{ "email": "jane@example.com", "password": "secret1" }

// Response 200 — same shape as register
```

---

### Expense Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expenses` | List expenses (paginated, filterable) |
| POST | `/expenses` | Create an expense |
| GET | `/expenses/:id` | Get single expense |
| PATCH | `/expenses/:id` | Update an expense |
| DELETE | `/expenses/:id` | Delete an expense |
| GET | `/expenses/stats` | Aggregated dashboard stats |
| GET | `/expenses/export` | Download CSV |

#### Query Parameters for `GET /expenses`

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `search` | string | `coffee` | Full-text search on title/notes |
| `category` | string | `Food & Dining` | Filter by category |
| `startDate` | ISO date | `2025-01-01` | Start of date range |
| `endDate` | ISO date | `2025-12-31` | End of date range |
| `sortBy` | string | `amount` | Field to sort by |
| `order` | `asc`/`desc` | `desc` | Sort direction |
| `page` | number | `1` | Page number |
| `limit` | number | `10` | Items per page |

#### Create Expense — `POST /expenses`
```json
// Request
{
  "title": "Lunch at Chipotle",
  "amount": 12.50,
  "category": "Food & Dining",
  "date": "2025-06-01",
  "paymentMethod": "credit_card",
  "notes": "Team lunch"
}

// Response 201
{ "success": true, "data": { "_id": "...", "title": "Lunch at Chipotle", ... } }
```

#### Stats Response — `GET /expenses/stats?year=2025`
```json
{
  "success": true,
  "data": {
    "monthly": [{ "month": 1, "total": 450.25, "count": 12 }, ...],
    "byCategory": [{ "category": "Food & Dining", "total": 890.50, "count": 45, "avgAmount": 19.79 }, ...],
    "totals": { "totalSpent": 4250.75, "totalExpenses": 134, "avgExpense": 31.72, "maxExpense": 350.00 }
  }
}
```

---

### Budget Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budgets?month=6&year=2025` | Get budgets with real spending |
| POST | `/budgets` | Create a budget |
| PATCH | `/budgets/:id` | Update a budget |
| DELETE | `/budgets/:id` | Delete a budget |

#### Create Budget — `POST /budgets`
```json
// Request
{ "category": "Food & Dining", "limit": 500, "month": 6, "year": 2025, "alertThreshold": 80 }

// Response 201
{ "success": true, "data": { "_id": "...", "category": "Food & Dining", "limit": 500, ... } }
```

#### Budget List Response (enriched with spending)
```json
{
  "success": true,
  "data": [
    {
      "category": "Food & Dining",
      "limit": 500,
      "spent": 380.25,
      "remaining": 119.75,
      "usagePercent": 76,
      "alertThreshold": 80,
      "isAlertSent": false
    }
  ]
}
```

#### Error Response Format
All errors follow a consistent shape:
```json
{ "success": false, "message": "Email already registered. Please login." }
```

---

## 🖼️ Screenshots

| Page | Description |
|------|-------------|
| **Login** | Clean card UI with email/password, show/hide toggle, validation |
| **Dashboard** | 4 stat cards + monthly area chart + category pie + top-5 bar chart |
| **Expenses** | Filterable table with search, date range, category; add/edit modal |
| **Budget** | Grid of budget cards with animated progress bars and alert badges |
| **Profile** | Name/currency settings + 3-way theme selector (light/dark/system) |
| **Mobile** | Slide-out drawer navigation, card-based expense list |

---

## ☁️ Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your repo, set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables from `.env.example` in the Render dashboard
7. Set `NODE_ENV=production`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import repo, set **Root Directory** to `frontend`
3. Framework: **Vite**
4. Add env var: `VITE_API_URL=https://your-render-backend.onrender.com/api`
5. Deploy — Vercel handles the build automatically

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user with read/write access
3. Whitelist `0.0.0.0/0` in Network Access (or Render's IP)
4. Copy connection string to your Render `MONGO_URI` env variable

---

## 🔧 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| State | Context API + Custom Hooks |
| Forms | React Hook Form |
| Charts | Recharts |
| HTTP | Axios with interceptors |
| Backend | Node.js, Express.js |
| Auth | JWT (access + refresh token rotation) |
| Database | MongoDB + Mongoose |
| Validation | express-validator |
| Security | Helmet, CORS, rate-limit, mongo-sanitize |
| Logging | Winston |
| Export | json2csv |

---

## 📄 License

MIT — free to use for personal projects and portfolios.
