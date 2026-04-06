const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const UserProfile = require('../models/UserProfile');

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await UserProfile.getByUserId(user);
    res.status(200).json({
      message: 'Profile fetched successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

const upsertMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await UserProfile.upsertByUserId(user, req.body || {});
    res.status(200).json({
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

const getUserJobs = async (req, res) => {
  try {
    const jobs = await Job.getAll();
    const openJobs = jobs.filter((job) => job.status === 'open');
    const applications = await Application.getByUserId(req.user.id);
    const appliedJobIds = new Set(applications.map((item) => item.job_id));

    const formattedJobs = openJobs.map((job) => ({
      ...job,
      hasApplied: appliedJobIds.has(job.id)
    }));

    res.status(200).json({
      message: 'Open jobs fetched successfully',
      data: formattedJobs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

const applyToJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId, 10);
    if (Number.isNaN(jobId)) {
      return res.status(400).json({ message: 'Invalid job id' });
    }

    const job = await Job.getById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ message: 'This job is not open for applications' });
    }

    const existingApplication = await Application.findByJobAndUser(jobId, req.user.id);
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create(jobId, req.user.id);
    res.status(201).json({
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({ message: 'Error applying to job', error: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.getByUserId(req.user.id);
    res.status(200).json({
      message: 'Applications fetched successfully',
      data: applications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

const getMyHomeData = async (req, res) => {
  try {
    const jobs = await Job.getAll();
    const openJobs = jobs.filter((job) => job.status === 'open');
    const applications = await Application.getByUserId(req.user.id);

    const shortlisted = applications.filter((item) => item.status === 'selected').length;
    const rejected = applications.filter((item) => item.status === 'rejected').length;

    res.status(200).json({
      message: 'User dashboard data fetched successfully',
      data: {
        stats: {
          openJobs: openJobs.length,
          appliedJobs: applications.length,
          shortlisted,
          rejected
        },
        recentApplications: applications.slice(0, 5)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const applications = await Application.getByUserId(req.user.id);

    const notifications = applications.map((application) => {
      let title = 'Application Submitted';
      let description = `Your application for ${application.job_title} at ${application.company_name} is submitted.`;

      if (application.status === 'selected') {
        title = 'Shortlisted for Next Round';
        description = `You are shortlisted for ${application.job_title}. Interview/test schedule will be shared by manager.`;
      }

      if (application.status === 'rejected') {
        title = 'Application Update';
        description = `Your application for ${application.job_title} has been closed for this role.`;
      }

      return {
        id: application.id,
        title,
        description,
        status: application.status,
        createdAt: application.updated_at || application.applied_at
      };
    });

    res.status(200).json({
      message: 'Notifications fetched successfully',
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

const getMyInterviews = async (req, res) => {
  try {
    const applications = await Application.getByUserId(req.user.id);
    const interviews = applications
      .filter((item) => item.status === 'selected')
      .map((item) => ({
        id: item.id,
        jobTitle: item.job_title,
        companyName: item.company_name,
        status: 'awaiting_schedule',
        scheduledAt: null
      }));

    res.status(200).json({
      message: 'Interview data fetched successfully',
      data: interviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
};

const getMyAssessments = async (req, res) => {
  try {
    const applications = await Application.getByUserId(req.user.id);
    const assessments = applications
      .filter((item) => item.status === 'selected')
      .map((item) => ({
        id: item.id,
        jobTitle: item.job_title,
        companyName: item.company_name,
        status: 'not_scheduled',
        startTime: null,
        endTime: null
      }));

    res.status(200).json({
      message: 'Assessment data fetched successfully',
      data: assessments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
};

module.exports = {
  getMyProfile,
  upsertMyProfile,
  getUserJobs,
  applyToJob,
  getMyApplications,
  getMyHomeData,
  getMyNotifications,
  getMyInterviews,
  getMyAssessments
};
