const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDashboardCharts
} = require('../controllers/dashboardController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

router.use(authenticateAdmin);

router.get('/stats', getDashboardStats);
router.get('/charts', getDashboardCharts);

module.exports = router;
