const pool = require('../config/database');

class Subscription {
  static async create(companyId, planName, amount, expiryDate) {
    const query = `INSERT INTO subscriptions (company_id, plan_name, amount, expiry_date, status) 
                   VALUES ($1, $2, $3, $4, 'active') RETURNING *`;
    const result = await pool.query(query, [companyId, planName, amount, expiryDate]);
    return result.rows[0];
  }

  static async getAll() {
    const query = `SELECT s.*, c.name as company_name FROM subscriptions s 
                   LEFT JOIN companies c ON s.company_id = c.id`;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = `SELECT s.*, c.name as company_name FROM subscriptions s 
                   LEFT JOIN companies c ON s.company_id = c.id WHERE s.id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *';
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }
}

module.exports = Subscription;
