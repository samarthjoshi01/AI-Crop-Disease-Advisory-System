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

// Protected routes (requires JWT)
router.get('/search', protect, searchDiagnoses);
router.get('/', protect, getAllDiagnoses);
router.get('/:id', protect, getDiagnosisById);

// Protected — write access (requires JWT)
router.post('/', protect, createDiagnosis);
router.put('/:id', protect, updateDiagnosis);
router.delete('/:id', protect, deleteDiagnosis);

module.exports = router;
