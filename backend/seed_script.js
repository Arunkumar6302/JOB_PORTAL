const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Read seedData.sql
    const sqlPath = path.join(__dirname, 'config', 'seedData.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Executing seed data...');
    await client.query(sql);
    console.log('Seed data successfully executed');
    
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
