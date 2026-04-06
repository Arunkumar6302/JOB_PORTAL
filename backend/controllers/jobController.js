const Job = require('../models/Job');
const ActivityLog = require('../models/ActivityLog');

// Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.getAll();
    res.status(200).json({
      message: 'Jobs fetched successfully',
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// Get Job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.getById(id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      message: 'Job fetched successfully',
      data: job
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};

// Update Job Status
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedJob = await Job.updateStatus(id, status);
    res.status(200).json({
      message: 'Job status updated successfully',
      data: updatedJob
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job status', error: error.message });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.delete(id);
    
    if (!deletedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await ActivityLog.record('Deleted Job', 'job', id);

    res.status(200).json({
      message: 'Job deleted successfully',
      data: deletedJob
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  updateJobStatus,
  deleteJob
};
