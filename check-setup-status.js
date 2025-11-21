const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkStatus() {
  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM setup_status ORDER BY id LIMIT 1');

    if (result.rows.length > 0) {
      const status = result.rows[0];
      console.log('Setup Status:');
      console.log('  is_completed:', status.is_completed);
      console.log('  current_step:', status.current_step);
      console.log('  completed_at:', status.completed_at);
    } else {
      console.log('No setup status found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkStatus();
