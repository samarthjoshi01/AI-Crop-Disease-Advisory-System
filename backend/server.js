const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables BEFORE importing passport (it reads GITHUB_CLIENT_ID/SECRET)
dotenv.config();

const session = require('express-session');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────

// CORS — allow frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Session (required for Passport OAuth flow)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'cropcare-session-fallback',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ──────────────────────────────────────────────
// Rate Limiting
// ──────────────────────────────────────────────

// Global rate limiter — 100 requests per 15 minutes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many requests, please try again later.' },
  },
});
app.use('/api', globalLimiter);

// Strict auth rate limiter — 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many authentication attempts, please try again after 15 minutes.' },
  },
});

// AI rate limiter — 10 requests per 15 minutes (protects Gemini API quota)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: 'Too many AI requests. Please wait a few minutes before trying again.' },
  },
});

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
const aiRoutes = require('./routes/aiRoutes');

// Apply auth rate limiter to login and register
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Apply AI rate limiter to AI endpoints
app.use('/api/ai', aiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/diagnoses', diagnosisRoutes);
app.use('/api/diseases', diagnosisRoutes);   // alias for /api/diagnoses
app.use('/api/advisories', advisoryRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/ai', aiRoutes);

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
    console.log(`   API Health  : http://localhost:${PORT}/api/health`);
    console.log(`   Rate Limits : Auth=5/15min, Global=100/15min\n`);
  });
};

startServer();
