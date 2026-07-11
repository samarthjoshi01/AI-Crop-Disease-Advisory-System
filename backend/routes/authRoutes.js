const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, getMe, githubCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validators');

// Public routes (with Zod validation)
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected route
router.get('/me', protect, getMe);

// GitHub OAuth routes
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  githubCallback
);

module.exports = router;
