const Application = require('../models/Application');

// Get All Applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.getAll();
    res.status(200).json({
      message: 'Applications fetched successfully',
      data: applications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Update Application Status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['applied', 'rejected', 'selected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedApplication = await Application.updateStatus(id, status);
    res.status(200).json({
      message: 'Application status updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
};

module.exports = {
  getAllApplications,
  updateApplicationStatus
};
