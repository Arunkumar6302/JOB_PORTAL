const { Client } = require('pg');
require('dotenv').config({ path: 'c:/Users/rarun/Documents/LINKED/Shnoor_Job_Portal/backend/.env' });

async function checkDb() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres' // connect to default db first to check other dbs
  });

  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_database WHERE datname = $1', [process.env.DB_NAME]);
    if (res.rows.length > 0) {
      console.log(`✅ Success! Database "${process.env.DB_NAME}" found.`);
    } else {
      console.log(`❌ Error: Database "${process.env.DB_NAME}" NOT FOUND. You need to create it!`);
    }
    await client.end();
  } catch (err) {
    console.error(`❌ Connection Failed: ${err.message}`);
  }
}

checkDb();
