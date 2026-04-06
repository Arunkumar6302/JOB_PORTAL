const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  getCurrentUser
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
