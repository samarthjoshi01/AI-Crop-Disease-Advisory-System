const express = require('express');
const router = express.Router();
const {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');

router.get('/', getAllCrops);
router.get('/:id', getCropById);
router.post('/', createCrop);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);

module.exports = router;
