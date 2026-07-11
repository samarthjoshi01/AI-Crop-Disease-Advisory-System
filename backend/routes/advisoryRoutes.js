const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllAdvisories,
  createAdvisory,
  updateAdvisory,
  deleteAdvisory,
} = require('../controllers/advisoryController');

// Public — read access
router.get('/', getAllAdvisories);

// Protected — write access (requires JWT)
router.post('/', protect, createAdvisory);
router.put('/:id', protect, updateAdvisory);
router.delete('/:id', protect, deleteAdvisory);

module.exports = router;
