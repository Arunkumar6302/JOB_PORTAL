const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser
} = require('../controllers/userController');
const { authenticateAdmin } = require('../middleware/authMiddleware');

router.use(authenticateAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/block', blockUser);
router.put('/:id/unblock', unblockUser);

module.exports = router;
