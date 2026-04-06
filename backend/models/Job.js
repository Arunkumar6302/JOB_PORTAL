const pool = require('../config/database');

class Job {
  static async create(companyId, title, description, salaryMin, salaryMax, location) {
    const query = `INSERT INTO jobs (company_id, title, description, salary_min, salary_max, location, status) 
                   VALUES ($1, $2, $3, $4, $5, $6, 'open') RETURNING *`;
    const result = await pool.query(query, [companyId, title, description, salaryMin, salaryMax, location]);
    return result.rows[0];
  }

  static async getAll() {
    const query = `SELECT j.*, c.name as company_name FROM jobs j 
                   LEFT JOIN companies c ON j.company_id = c.id`;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = `SELECT j.*, c.name as company_name FROM jobs j 
                   LEFT JOIN companies c ON j.company_id = c.id WHERE j.id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE jobs SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM jobs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Job;
