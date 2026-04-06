const pool = require('../config/database');

class ActivityLog {
  static async record(action, entityType, entityId) {
    const query = `INSERT INTO activity_logs (action, entity_type, entity_id)
                   VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [action, entityType, entityId]);
    return result.rows[0];
  }

  static async getAll() {
    const query = `SELECT id, action, entity_type, entity_id, created_at
                   FROM activity_logs
                   ORDER BY created_at DESC, id DESC`;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = ActivityLog;