const { Pool } = require('pg');
const path = require('path');
const dotenv = require('dotenv');

// Always load backend/.env first using absolute path (independent of current working directory).
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Fallback for setups where .env is placed at repository root.
if (!process.env.DB_NAME || !process.env.DB_USER || typeof process.env.DB_PASSWORD === 'undefined') {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

if (typeof process.env.DB_PASSWORD !== 'string' || process.env.DB_PASSWORD.trim() === '') {
  throw new Error('DB_PASSWORD is missing in backend/.env (or root .env). Please set DB_PASSWORD as a non-empty string.');
}

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'job_portal',
  user: String(process.env.DB_USER || 'postgres'),
  password: process.env.DB_PASSWORD
};

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
