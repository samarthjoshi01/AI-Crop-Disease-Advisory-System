const express = require('express');
const router = express.Router();
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

router.get('/', getAllDiagnoses);
router.get('/:id', getDiagnosisById);
router.post('/', createDiagnosis);
router.put('/:id', updateDiagnosis);
router.delete('/:id', deleteDiagnosis);

module.exports = router;
