const pool = require('../config/database');

class ActivityLog {
  static async ensureTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(150) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE activity_logs
      ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

      CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
    `;

    await pool.query(query);
  }

  static async record(action, entityType, entityId, metadata = {}) {
    await this.ensureTable();
    const query = `INSERT INTO activity_logs (action, entity_type, entity_id, metadata)
                   VALUES ($1, $2, $3, $4::jsonb) RETURNING *`;
    const result = await pool.query(query, [action, entityType, entityId, JSON.stringify(metadata || {})]);
    return result.rows[0];
  }

  static async getAll(entityFilter = 'all') {
    await this.ensureTable();
    const filters = {
      all: { where: '', values: [] },
      user: { where: 'WHERE entity_type = $1', values: ['user'] },
      company: { where: 'WHERE entity_type = $1', values: ['company'] },
      company_manager: {
        where: `WHERE entity_type = 'user' 
                AND EXISTS (
                  SELECT 1 FROM users u 
                  WHERE u.id = activity_logs.entity_id 
                  AND (u.role = 'company_manager' OR u.role = 'manager')
                )`,
        values: []
      }
    };

    const selected = filters[entityFilter] || filters.all;
    const query = `SELECT id, action, entity_type, entity_id, metadata, created_at 
                   FROM activity_logs 
                   ${selected.where} 
                   ORDER BY created_at DESC, id DESC`;
    const result = await pool.query(query, selected.values);
    return result.rows;
  }
}

module.exports = ActivityLog;
