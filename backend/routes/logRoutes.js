const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/logsController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

router.use(authenticateAdmin);

router.get('/', getAllLogs);

module.exports = router;