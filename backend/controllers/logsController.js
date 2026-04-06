const ActivityLog = require('../models/ActivityLog');

const getAllLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.getAll();
    res.status(200).json({
      message: 'Logs fetched successfully',
      data: logs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};

module.exports = {
  getAllLogs
};