const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

router.use(authenticateAdmin);

router.get('/', getAllApplications);
router.put('/:id/status', updateApplicationStatus);

module.exports = router;
