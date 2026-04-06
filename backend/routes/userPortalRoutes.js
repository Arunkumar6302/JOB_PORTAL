const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const {
  getMyProfile,
  upsertMyProfile,
  getUserJobs,
  applyToJob,
  getMyApplications,
  getMyHomeData,
  getMyNotifications,
  getMyInterviews,
  getMyAssessments
} = require('../controllers/userPortalController');

router.use(authenticate);

router.get('/home', getMyHomeData);
router.get('/profile', getMyProfile);
router.put('/profile', upsertMyProfile);
router.get('/jobs', getUserJobs);
router.post('/jobs/:jobId/apply', applyToJob);
router.get('/applications', getMyApplications);
router.get('/notifications', getMyNotifications);
router.get('/interviews', getMyInterviews);
router.get('/assessments', getMyAssessments);

module.exports = router;
