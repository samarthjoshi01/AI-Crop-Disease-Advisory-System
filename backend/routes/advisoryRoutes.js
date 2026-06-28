const express = require('express');
const router = express.Router();
const {
  getAllAdvisories,
  createAdvisory
} = require('../controllers/advisoryController');

router.get('/', getAllAdvisories);
router.post('/', createAdvisory);

module.exports = router;
