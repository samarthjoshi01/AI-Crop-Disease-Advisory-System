const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');

// Public — read access
router.get('/', getAllCrops);
router.get('/:id', getCropById);

// Protected — write access (requires JWT)
router.post('/', protect, createCrop);
router.put('/:id', protect, updateCrop);
router.delete('/:id', protect, deleteCrop);

module.exports = router;
