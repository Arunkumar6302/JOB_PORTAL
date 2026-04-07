const pool = require('../config/database');

class ActivityLog {
  static async ensureTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(150) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
    `;

    await pool.query(query);
  }

  static async record(action, entityType, entityId) {
    await this.ensureTable();
    const query = `INSERT INTO activity_logs (action, entity_type, entity_id)
                   VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [action, entityType, entityId]);
    return result.rows[0];
  }

  static async getAll() {
    await this.ensureTable();
    const query = `SELECT id, action, entity_type, entity_id, created_at
                   FROM activity_logs
                   ORDER BY created_at DESC, id DESC`;
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = ActivityLog;
