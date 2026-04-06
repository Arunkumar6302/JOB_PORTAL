const pool = require('../config/database');

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalCompanies = await pool.query('SELECT COUNT(*) as count FROM companies');
    const totalUsers = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalJobs = await pool.query('SELECT COUNT(*) as count FROM jobs');
    const totalApplications = await pool.query('SELECT COUNT(*) as count FROM applications');
    const totalRevenue = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM subscriptions');

    const stats = {
      totalCompanies: parseInt(totalCompanies.rows[0].count),
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalJobs: parseInt(totalJobs.rows[0].count),
      totalApplications: parseInt(totalApplications.rows[0].count),
      totalRevenue: parseFloat(totalRevenue.rows[0].total)
    };

    res.status(200).json({
      message: 'Dashboard stats fetched successfully',
      data: stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

const getDashboardCharts = async (req, res) => {
  try {
    const jobsPerCompany = await pool.query(`
      SELECT c.name AS company_name, COUNT(j.id)::int AS total_jobs
      FROM companies c
      LEFT JOIN jobs j ON c.id = j.company_id
      GROUP BY c.id, c.name
      ORDER BY total_jobs DESC, c.name ASC
      LIMIT 10
    `);

    const applicationsOverTime = await pool.query(`
      SELECT TO_CHAR(date_trunc('month', applied_at), 'Mon YYYY') AS period,
             COUNT(*)::int AS total_applications
      FROM applications
      GROUP BY date_trunc('month', applied_at)
      ORDER BY date_trunc('month', applied_at)
    `);

    const usersGrowth = await pool.query(`
      SELECT TO_CHAR(date_trunc('month', created_at), 'Mon YYYY') AS period,
             COUNT(*)::int AS total_users
      FROM users
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at)
    `);

    res.status(200).json({
      message: 'Dashboard charts fetched successfully',
      data: {
        jobsPerCompany: jobsPerCompany.rows,
        applicationsOverTime: applicationsOverTime.rows,
        usersGrowth: usersGrowth.rows
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard charts', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getDashboardCharts
};
