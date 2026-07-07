const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────

// CORS — allow frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CropCare AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
const authRoutes = require('./routes/authRoutes');
const diagnosisRoutes = require('./routes/diagnosisRoutes');
const advisoryRoutes = require('./routes/advisoryRoutes');
const cropRoutes = require('./routes/cropRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/diagnoses', diagnosisRoutes);
app.use('/api/diseases', diagnosisRoutes);   // alias for /api/diagnoses
app.use('/api/advisories', advisoryRoutes);
app.use('/api/crops', cropRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.originalUrl} not found` }
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// ──────────────────────────────────────────────
// Connect to Database & Start Server
// ──────────────────────────────────────────────
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🌱 CropCare AI Backend Server`);
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Port        : ${PORT}`);
    console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`   API Health  : http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
