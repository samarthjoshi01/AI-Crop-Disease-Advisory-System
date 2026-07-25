const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { aiAdvisory, aiDiagnose, aiDetectFromImage } = require('../controllers/aiController');

// All AI routes require authentication
router.post('/advisory', protect, aiAdvisory);
router.post('/diagnose', protect, aiDiagnose);
router.post('/detect-image', protect, aiDetectFromImage);

module.exports = router;
