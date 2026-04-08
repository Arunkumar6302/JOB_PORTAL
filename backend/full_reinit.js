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

async function runSQL(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(`Executing ${path.basename(filePath)}...`);
  await client.query(sql);
  console.log(`Executed ${path.basename(filePath)} Successfully.`);
}

async function setupAndSeed() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Run setup.sql
    const setupPath = path.join(__dirname, '..', 'setup.sql');
    await runSQL(setupPath);
    
    // Run seedData.sql
    const seedPath = path.join(__dirname, 'config', 'seedData.sql');
    await runSQL(seedPath);
    
    console.log('Database re-initialization and seeding complete.');
    
  } catch (err) {
    console.error('Error during setup/seed:', err);
  } finally {
    await client.end();
  }
}

setupAndSeed();
