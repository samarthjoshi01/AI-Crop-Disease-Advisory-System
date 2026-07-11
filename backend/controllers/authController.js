const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate a signed JWT for the given user ID.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide name, email, and password' },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'An account with this email already exists' },
      });
    }

    // Create user (password is hashed by the pre-save hook)
    const user = await User.create({ name, email, password });

    // Generate JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        error: { message: messages.join(', ') },
      });
    }

    console.error('[AUTH ERROR] Registration:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Server error during registration' },
    });
  }
};

/**
 * @desc    Login user & return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide email and password' },
      });
    }

    // Find user and include password field for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' },
      });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' },
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Server error during login' },
    });
  }
};

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private (requires JWT)
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || '',
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Server error' },
    });
  }
};

/**
 * @desc    GitHub OAuth callback — generates JWT and redirects to frontend
 * @route   GET /api/auth/github/callback
 * @access  Public (called by GitHub after OAuth)
 */
const githubCallback = (req, res) => {
  try {
    // Passport attaches the authenticated user to req.user
    const token = generateToken(req.user._id);

    // Redirect to the frontend OAuth callback page with the token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('[AUTH ERROR] GitHub callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?error=oauth_failed`);
  }
};

module.exports = { register, login, getMe, githubCallback };
