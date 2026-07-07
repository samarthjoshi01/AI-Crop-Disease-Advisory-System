# AI-Powered Crop Disease Detection and Farmer Advisory System

A full-stack AI-powered web platform that helps farmers identify crop diseases and receive agricultural guidance.

## Project Overview

CropCare AI combines a React frontend with an Express.js backend API to provide crop disease detection, farmer advisory chatbot, and diagnosis history tracking. All data is persisted in a MongoDB Atlas cloud database.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas (M0 free tier) + Mongoose ODM
- **Routing:** React Router v6
- **API Testing:** Postman / Thunder Client
- **Node:** v18+

## Database

### Why MongoDB?

We chose **MongoDB** (NoSQL document database) over PostgreSQL for this project because:

1. **Flexible Schema** — Diagnosis records contain variable-length text fields (treatment descriptions, preventive measures) and optional fields (imageUrl, crop reference). MongoDB's document model handles this naturally without rigid column constraints.
2. **Independent Entities** — Our three main entities (Crop, Diagnosis, Advisory) are largely independent with only one lightweight reference (Diagnosis → Crop). There are no complex multi-table JOINs that would benefit from a relational database.
3. **Rapid Prototyping** — Mongoose schemas allow us to iterate quickly on the data model without running migration commands every time a field changes.
4. **Native JSON** — Since our Express API communicates in JSON, MongoDB's BSON documents map 1:1 to API responses with no serialization overhead.

### Schema Diagram

![CropCare AI Database Schema](W5_SchemaDiagram_YOUR_INTERN_ID_HERE.png)

**Entities:**

| Entity | Description | Key Fields |
|--------|-------------|------------|
| **Crop** | Crop metadata (name, growing season, region) | `name` (unique), `season`, `region` |
| **Diagnosis** | Disease detection records with treatment info | `cropName`, `diseaseName`, `confidence`, `status`, `treatment` |
| **Advisory** | Farmer Q&A with AI-generated answers | `question`, `answer`, `category` |

**Relationships:**
- `Diagnosis.crop` → `Crop._id` (many-to-one): Each diagnosis optionally references a crop document.
- `Advisory` is standalone with no foreign key references.

## Project Structure

```
├── backend/
│   ├── server.js              # Express app entry point (port 5000)
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (gitignored)
│   ├── .env.example           # Template for env vars
│   ├── config/
│   │   └── db.js              # MongoDB connection via Mongoose
│   ├── models/
│   │   ├── Crop.js            # Crop schema & model
│   │   ├── Diagnosis.js       # Diagnosis schema & model
│   │   └── Advisory.js        # Advisory schema & model
│   ├── routes/
│   │   ├── diagnosisRoutes.js # Diagnosis CRUD + search routes
│   │   ├── advisoryRoutes.js  # Advisory CRUD routes
│   │   └── cropRoutes.js      # Crop CRUD routes
│   ├── controllers/
│   │   ├── diagnosisController.js  # Diagnosis handler logic
│   │   ├── advisoryController.js   # Advisory handler logic
│   │   └── cropController.js       # Crop handler logic
│   ├── scripts/
│   │   └── seed.js            # Database seed script
│   ├── data/
│   │   └── seedData.js        # Legacy in-memory seed data (archived)
│   └── middleware/
│       └── errorHandler.js    # Global error handling
├── src/
│   ├── api/
│   │   └── apiClient.js       # Centralized API fetch wrapper
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Card.jsx
│   │   ├── Footer.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Loader.jsx
│   │       ├── Modal.jsx
│   │       ├── Toast.jsx
│   │       └── index.js
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── DiseaseDetection.jsx
│   │   ├── Advisory.jsx
│   │   ├── History.jsx
│   │   ├── About.jsx
│   │   └── ComponentShowcase.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── schema_diagram.png          # Database schema diagram
├── package.json               # Frontend dependencies
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features

### Frontend
✓ Responsive navbar with navigation links  
✓ Hero section with call-to-action button  
✓ Reusable UI components (Button, Input, Loader, Toast, Modal)  
✓ Disease Detection page with submission form  
✓ Farmer Advisory chatbot with live responses  
✓ Diagnosis History with search and delete  
✓ Dark/Light theme toggle  
✓ Loading states and error notifications  
✓ Tailwind CSS responsive design  

### Backend
✓ Express.js REST API on port 5000  
✓ 13 API endpoints with proper HTTP methods and status codes  
✓ MongoDB Atlas cloud database with Mongoose ODM  
✓ 3 Mongoose models: Crop, Diagnosis, Advisory  
✓ Full CRUD operations with persistent data storage  
✓ CORS configured for frontend origin  
✓ Global error handling middleware  
✓ Database seed script for initial data  
✓ Request logging in development mode  

## Set Up the Database

### 1. Create a MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account (or sign in)
3. Create a **free cluster** (M0 Sandbox tier)
4. Under **Database Access**, create a database user with a username and password
5. Under **Network Access**, click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
6. Under **Database → Connect → Drivers**, copy your connection string

### 2. Configure Environment Variables

In the `backend/` directory, copy the example env file:

```bash
cp .env.example .env
```

Then replace the `MONGO_URI` placeholder with your actual connection string:

```
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cropcare-ai?retryWrites=true&w=majority
```

> ⚠️ The `.env` file is gitignored and will never be committed. Your credentials stay local.

### 3. Seed the Database

Populate the database with initial crop, diagnosis, and advisory data:

```bash
cd backend
npm run seed
```

You should see:
```
🌱 Seeding CropCare AI Database...
   ✓ Connected to MongoDB
   ✓ Cleared existing data
   ✓ Inserted 6 crops
   ✓ Inserted 6 diagnoses
   ✓ Inserted 5 advisories
✅ Database seeded successfully!
```

## How to Run Frontend Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Or on Windows (if npm.ps1 is blocked):

```bash
npm.cmd run dev
```

The frontend will be available at `http://localhost:5173`

## How to Run Backend Locally

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example env file and fill in your MongoDB connection string:

```bash
cp .env.example .env
```

Required variables in `.env`:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cropcare-ai?retryWrites=true&w=majority
```

### 4. Seed the Database (First Run Only)

```bash
npm run seed
```

### 5. Start the Backend Server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The backend API will be available at `http://localhost:5000`

### 6. Verify Backend is Running

Visit `http://localhost:5000/api/health` — you should see:
```json
{
  "success": true,
  "message": "CropCare AI Backend is running",
  "timestamp": "..."
}
```

## Running Both Frontend and Backend

1. **Terminal 1 — Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2 — Frontend:**
   ```bash
   npm run dev
   ```

The Vite dev server proxies `/api` requests to the backend automatically.

## API Endpoints

### Diagnosis Endpoints

| # | Method | Endpoint | Description | Status Codes |
|---|--------|----------|-------------|-------------|
| 1 | `GET` | `/api/diagnoses` | List all diagnosis records | 200 |
| 2 | `GET` | `/api/diagnoses/search?q=…` | Search by crop/disease/status | 200 |
| 3 | `GET` | `/api/diagnoses/:id` | Get a single diagnosis | 200, 400, 404 |
| 4 | `POST` | `/api/diagnoses` | Create a new diagnosis | 201, 400 |
| 5 | `PUT` | `/api/diagnoses/:id` | Update a diagnosis | 200, 400, 404 |
| 6 | `DELETE` | `/api/diagnoses/:id` | Delete a diagnosis | 204, 400, 404 |

### Advisory Endpoints

| # | Method | Endpoint | Description | Status Codes |
|---|--------|----------|-------------|-------------|
| 7 | `GET` | `/api/advisories` | List all advisories | 200 |
| 8 | `POST` | `/api/advisories` | Submit a farming question | 201, 400 |
| 9 | `PUT` | `/api/advisories/:id` | Update an advisory | 200, 400, 404 |
| 10 | `DELETE` | `/api/advisories/:id` | Delete an advisory | 204, 400, 404 |

### Crop Endpoints

| # | Method | Endpoint | Description | Status Codes |
|---|--------|----------|-------------|-------------|
| 11 | `GET` | `/api/crops` | List all crops | 200 |
| 12 | `GET` | `/api/crops/:id` | Get a single crop | 200, 400, 404 |
| 13 | `POST` | `/api/crops` | Add a new crop | 201, 400, 409 |
| 14 | `PUT` | `/api/crops/:id` | Update a crop | 200, 400, 404, 409 |
| 15 | `DELETE` | `/api/crops/:id` | Delete a crop | 204, 400, 404 |

### Example API Requests

**Create a Diagnosis:**
```bash
curl -X POST http://localhost:5000/api/diagnoses \
  -H "Content-Type: application/json" \
  -d '{"cropName": "Tomato", "diseaseName": "Early Blight", "confidence": 92.5}'
```

**Search Diagnoses:**
```bash
curl http://localhost:5000/api/diagnoses/search?q=tomato
```

**Submit Advisory Question:**
```bash
curl -X POST http://localhost:5000/api/advisories \
  -H "Content-Type: application/json" \
  -d '{"question": "How to prevent tomato leaf blight?"}'
```

**Add a Crop:**
```bash
curl -X POST http://localhost:5000/api/crops \
  -H "Content-Type: application/json" \
  -d '{"name": "Sugarcane", "season": "Kharif", "region": "Western India"}'
```

## Routes (Frontend)

- `/` — Home page with hero and feature cards
- `/disease-detection` — Disease detection with diagnosis form
- `/advisory` — Farmer advisory chatbot
- `/history` — Diagnosis history with search and delete
- `/about` — About the project

## Styling

- Tailwind CSS utility classes
- Responsive grid layouts
- Green color scheme (green-600, green-700)
- Dark/Light mode support
- Hover and transition effects
- Mobile-first approach
