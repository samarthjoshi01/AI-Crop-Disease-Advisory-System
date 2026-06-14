# AI-Powered Crop Disease Detection and Farmer Advisory System

Frontend application for an AI-powered crop disease detection and farmer advisory platform.

## Project Overview

A full-stack AI-powered web platform that helps farmers identify crop diseases and receive agricultural guidance.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Routing:** React Router v6
- **Node:** v18+

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Card.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── DiseaseDetection.jsx
│   ├── Advisory.jsx
│   ├── History.jsx
│   └── About.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Features

✓ Responsive navbar with navigation links  
✓ Hero section with call-to-action button  
✓ Reusable card component for features  
✓ Five main pages with placeholder content  
✓ Clean footer with social links  
✓ Tailwind CSS responsive design  
✓ React Router configuration  

## Installation & Setup

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

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Routes

- `/` - Home page with hero and feature cards
- `/disease-detection` - Disease detection module (placeholder)
- `/advisory` - Farmer advisory chatbot (placeholder)
- `/history` - Diagnosis history (placeholder)
- `/about` - About the project

## Components

### Navbar
- Displays "CropCare AI" branding
- Navigation links to all pages
- Responsive design with mobile menu button

### Hero
- Main headline and subheadline
- Call-to-action button
- Placeholder image area

### Card (Reusable)
- Props: `title`, `description`, `image`, `actionText`
- Hover effects
- Action button

### Footer
- Project information
- Quick links
- Social media placeholders
- Copyright text

## Pages

### Home
- Navbar + Hero + Cards + Footer
- Three feature cards showcasing main functionality

### Disease Detection
- Upload interface (placeholder)
- How it works guide
- Status note

### Farmer Advisory
- Chatbot interface (placeholder)
- Sample questions
- Status note

### History
- Diagnosis records table (placeholder)
- Status note

### About
- Project mission and details
- Technology stack
- Development timeline
- Project status

## Styling

- Tailwind CSS utility classes
- Responsive grid layouts
- Green color scheme (green-600, green-700)
- Hover and transition effects
- Mobile-first approach


