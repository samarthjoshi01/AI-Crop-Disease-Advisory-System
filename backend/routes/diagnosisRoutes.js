const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllDiagnoses,
  searchDiagnoses,
  getDiagnosisById,
  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis
} = require('../controllers/diagnosisController');

// Search must come BEFORE :id to prevent "search" from matching as an ID
router.get('/search', searchDiagnoses);

// Public — read access
router.get('/', getAllDiagnoses);
router.get('/:id', getDiagnosisById);

// Protected — write access (requires JWT)
router.post('/', protect, createDiagnosis);
router.put('/:id', protect, updateDiagnosis);
router.delete('/:id', protect, deleteDiagnosis);

module.exports = router;
