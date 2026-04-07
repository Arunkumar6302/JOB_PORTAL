const pool = require('../config/database');

class ManagerTestLink {
  static async ensureTables() {
    const query = `
      CREATE TABLE IF NOT EXISTS manager_test_links (
        id SERIAL PRIMARY KEY,
        application_id INT REFERENCES applications(id) ON DELETE SET NULL,
        job_id INT REFERENCES jobs(id) ON DELETE SET NULL,
        candidate_email VARCHAR(100),
        link_url TEXT NOT NULL,
        notes TEXT,
        link_status VARCHAR(50) DEFAULT 'pending',
        created_by INT REFERENCES users(id) ON DELETE SET NULL,
        updated_by INT REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS manager_test_link_updates (
        id SERIAL PRIMARY KEY,
        test_link_id INT NOT NULL REFERENCES manager_test_links(id) ON DELETE CASCADE,
        changed_by INT REFERENCES users(id) ON DELETE SET NULL,
        previous_status VARCHAR(50),
        new_status VARCHAR(50),
        previous_link TEXT,
        new_link TEXT,
        previous_notes TEXT,
        new_notes TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_manager_test_links_job_id ON manager_test_links(job_id);
      CREATE INDEX IF NOT EXISTS idx_manager_test_links_application_id ON manager_test_links(application_id);
      CREATE INDEX IF NOT EXISTS idx_manager_test_link_updates_test_link_id ON manager_test_link_updates(test_link_id);
    `;

    await pool.query(query);
  }

  static async getAll() {
    await this.ensureTables();
    const query = `
      SELECT
        tl.id,
        tl.application_id,
        tl.job_id,
        tl.candidate_email,
        tl.link_url,
        tl.notes,
        tl.link_status,
        tl.created_at,
        tl.updated_at,
        j.title AS job_title,
        a.status AS application_status
      FROM manager_test_links tl
      LEFT JOIN jobs j ON j.id = tl.job_id
      LEFT JOIN applications a ON a.id = tl.application_id
      ORDER BY tl.updated_at DESC, tl.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async create(data, userId) {
    await this.ensureTables();
    const query = `
      INSERT INTO manager_test_links
      (application_id, job_id, candidate_email, link_url, notes, link_status, created_by, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
      RETURNING *
    `;
    const values = [
      data.applicationId || null,
      data.jobId || null,
      data.candidateEmail || null,
      data.linkUrl,
      data.notes || null,
      data.linkStatus || 'pending',
      userId
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getLatestByApplicationId(applicationId) {
    await this.ensureTables();
    const query = `
      SELECT *
      FROM manager_test_links
      WHERE application_id = $1
      ORDER BY updated_at DESC, id DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [applicationId]);
    return result.rows[0];
  }

  static async getById(id) {
    await this.ensureTables();
    const query = 'SELECT * FROM manager_test_links WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data, userId) {
    await this.ensureTables();
    const query = `
      UPDATE manager_test_links
      SET
        application_id = COALESCE($1, application_id),
        job_id = COALESCE($2, job_id),
        candidate_email = COALESCE($3, candidate_email),
        link_url = COALESCE($4, link_url),
        notes = COALESCE($5, notes),
        link_status = COALESCE($6, link_status),
        updated_by = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    const values = [
      data.applicationId || null,
      data.jobId || null,
      data.candidateEmail || null,
      data.linkUrl || null,
      data.notes || null,
      data.linkStatus || null,
      userId,
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async createUpdateLog(testLinkId, previous, updated, userId) {
    await this.ensureTables();
    const query = `
      INSERT INTO manager_test_link_updates
      (test_link_id, changed_by, previous_status, new_status, previous_link, new_link, previous_notes, new_notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      testLinkId,
      userId,
      previous.link_status,
      updated.link_status,
      previous.link_url,
      updated.link_url,
      previous.notes,
      updated.notes
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getUpdates() {
    await this.ensureTables();
    const query = `
      SELECT
        u.id,
        u.test_link_id,
        tl.candidate_email,
        u.previous_status,
        u.new_status,
        u.previous_link,
        u.new_link,
        u.previous_notes,
        u.new_notes,
        u.updated_at,
        usr.name AS changed_by_name,
        usr.email AS changed_by_email
      FROM manager_test_link_updates u
      LEFT JOIN manager_test_links tl ON tl.id = u.test_link_id
      LEFT JOIN users usr ON usr.id = u.changed_by
      ORDER BY u.updated_at DESC, u.id DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getForUser(userId, email) {
    await this.ensureTables();
    const query = `
      SELECT
        tl.id,
        tl.application_id,
        tl.job_id,
        tl.candidate_email,
        tl.link_url,
        tl.notes,
        tl.link_status,
        tl.created_at,
        tl.updated_at,
        j.title AS job_title,
        c.name AS company_name,
        a.status AS application_status
      FROM manager_test_links tl
      LEFT JOIN applications a ON a.id = tl.application_id
      LEFT JOIN jobs j ON j.id = COALESCE(tl.job_id, a.job_id)
      LEFT JOIN companies c ON c.id = j.company_id
      WHERE a.user_id = $1
        OR (LOWER(COALESCE(tl.candidate_email, '')) = LOWER(COALESCE($2, '')))
      ORDER BY tl.updated_at DESC, tl.id DESC
    `;
    const result = await pool.query(query, [userId, email || null]);
    return result.rows;
  }
}

module.exports = ManagerTestLink;
