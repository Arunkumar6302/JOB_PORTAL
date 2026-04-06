const pool = require('../config/database');

class OTPVerification {
  static async create(userId, otp, expiresAt) {
    const query = `INSERT INTO otp_verification (user_id, otp, expires_at) 
                   VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(query, [userId, otp, expiresAt]);
    return result.rows[0];
  }

  static async findByUserIdAndOTP(userId, otp) {
    const query = `SELECT * FROM otp_verification WHERE user_id = $1 AND otp = $2 AND expires_at > CURRENT_TIMESTAMP`;
    const result = await pool.query(query, [userId, otp]);
    return result.rows[0];
  }

  static async markAsVerified(id) {
    const query = 'UPDATE otp_verification SET is_verified = TRUE WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async deleteExpired() {
    const query = 'DELETE FROM otp_verification WHERE expires_at < CURRENT_TIMESTAMP';
    await pool.query(query);
  }
}

module.exports = OTPVerification;
