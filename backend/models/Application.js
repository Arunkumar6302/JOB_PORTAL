const pool = require('../config/database');

class Application {
  static async create(jobId, userId) {
    const query = `INSERT INTO applications (job_id, user_id, status) 
                   VALUES ($1, $2, 'applied') RETURNING *`;
    const result = await pool.query(query, [jobId, userId]);
    return result.rows[0];
  }

  static async findByJobAndUser(jobId, userId) {
    const query = 'SELECT * FROM applications WHERE job_id = $1 AND user_id = $2';
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

  static async getById(id) {
    const query = `
      SELECT
        a.*,
        j.title AS job_title,
        c.name AS company_name,
        u.name AS user_name,
        u.email AS user_email
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE applications SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const query = `
      SELECT
        a.*,
        j.title AS job_title,
        j.location,
        j.status AS job_status,
        c.name AS company_name
      FROM applications a
      LEFT JOIN jobs j ON a.job_id = j.id
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

module.exports = Application;
