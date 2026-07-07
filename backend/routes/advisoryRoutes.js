const express = require('express');
const router = express.Router();
const {
  getAllAdvisories,
  createAdvisory,
  updateAdvisory,
  deleteAdvisory,
} = require('../controllers/advisoryController');

router.get('/', getAllAdvisories);
router.post('/', createAdvisory);
router.put('/:id', updateAdvisory);
router.delete('/:id', deleteAdvisory);

module.exports = router;
