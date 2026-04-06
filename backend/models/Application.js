const pool = require('../config/database');

class Application {
  static async create(jobId, userId) {
    const query = `INSERT INTO applications (job_id, user_id, status) 
                   VALUES ($1, $2, 'applied') RETURNING *`;
    const result = await pool.query(query, [jobId, userId]);
    return result.rows[0];
  }

  static async getAll() {
    const query = `SELECT a.*, j.title as job_title, c.name as company_name, u.name as user_name, u.email as user_email 
                   FROM applications a 
                   LEFT JOIN jobs j ON a.job_id = j.id
                   LEFT JOIN companies c ON j.company_id = c.id
                   LEFT JOIN users u ON a.user_id = u.id`;
    const result = await pool.query(query);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }
}

module.exports = Application;
