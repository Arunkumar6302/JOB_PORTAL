const pool = require('../config/database');

class OTPVerification {
  static async ensureTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS otp_verification (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        otp VARCHAR(6) NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_otp_verification_user_id ON otp_verification(user_id);
    `;

    await pool.query(query);
  }

  static async create(userId, otp, expiresAt) {
    await this.ensureTable();
    const query = `INSERT INTO otp_verification (user_id, otp, expires_at) 
                   VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [userId, otp, expiresAt]);
    return result.rows[0];
  }

  static async findByUserIdAndOTP(userId, otp) {
    await this.ensureTable();
    const query = `SELECT * FROM otp_verification WHERE user_id = $1 AND otp = $2 AND expires_at > CURRENT_TIMESTAMP`;
    const result = await pool.query(query, [userId, otp]);
    return result.rows[0];
  }

  static async markAsVerified(id) {
    await this.ensureTable();
    const query = 'UPDATE otp_verification SET is_verified = TRUE WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async deleteExpired() {
    await this.ensureTable();
    const query = 'DELETE FROM otp_verification WHERE expires_at < CURRENT_TIMESTAMP';
    await pool.query(query);
  }
}

module.exports = OTPVerification;
