const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'c:/Users/rarun/Documents/LINKED/Shnoor_Job_Portal/backend/.env' });

async function runSetup() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    
    console.log('Reading setup.sql...');
    const setupSql = fs.readFileSync('c:/Users/rarun/Documents/LINKED/Shnoor_Job_Portal/setup.sql', 'utf8');
    
    console.log('Applying schema...');
    await client.query(setupSql);
    
    console.log('✅ Success! Tables and data created successfully.');
    await client.end();
  } catch (err) {
    console.error(`❌ Setup Failed: ${err.message}`);
    process.exit(1);
  }
}

runSetup();
