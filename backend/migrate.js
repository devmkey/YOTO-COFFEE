require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS contact VARCHAR(255)');
    console.log('Successfully added contact column');
  } catch (e) {
    console.error('Error adding column:', e);
  } finally {
    await pool.end();
  }
}

run();
