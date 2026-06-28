# AI-Powered Crop Disease Detection and Farmer Advisory System

A full-stack AI-powered web platform that helps farmers identify crop diseases and receive agricultural guidance.

## Project Overview

CropCare AI combines a React frontend with an Express.js backend API to provide crop disease detection, farmer advisory chatbot, and diagnosis history tracking.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Routing:** React Router v6
- **API Testing:** Postman / Thunder Client
- **Node:** v18+

## Project Structure

```
├── backend/
│   ├── server.js              # Express app entry point (port 5000)
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables (gitignored)
│   ├── .env.example           # Template for env vars
│   ├── routes/
│   │   ├── diagnosisRoutes.js # Diagnosis CRUD + search routes
│   │   └── advisoryRoutes.js  # Advisory routes
│   ├── controllers/
│   │   ├── diagnosisController.js  # Diagnosis handler logic
│   │   └── advisoryController.js   # Advisory handler logic
│   ├── data/
│   │   └── seedData.js        # In-memory seed data
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
✓ 8 API endpoints with proper HTTP methods and status codes  
✓ CORS configured for frontend origin  
✓ Global error handling middleware  
✓ In-memory seed data (6 diagnoses, 5 advisories)  
✓ Request logging in development mode  

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

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

Default values in `.env`:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Start the Backend Server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The backend API will be available at `http://localhost:5000`

### 5. Verify Backend is Running

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

| # | Method | Endpoint | Description | Status Codes |
|---|--------|----------|-------------|-------------|
| 1 | `GET` | `/api/diagnoses` | List all diagnosis records | 200 |
| 2 | `GET` | `/api/diagnoses/search?q=…` | Search by crop/disease/status | 200 |
| 3 | `GET` | `/api/diagnoses/:id` | Get a single diagnosis | 200, 404 |
| 4 | `POST` | `/api/diagnoses` | Create a new diagnosis | 201, 400 |
| 5 | `PUT` | `/api/diagnoses/:id` | Update a diagnosis | 200, 400, 404 |
| 6 | `DELETE` | `/api/diagnoses/:id` | Delete a diagnosis | 204, 404 |
| 7 | `GET` | `/api/advisories` | List all advisories | 200 |
| 8 | `POST` | `/api/advisories` | Submit a farming question | 201, 400 |

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
