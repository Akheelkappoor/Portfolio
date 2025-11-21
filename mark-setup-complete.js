const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function markSetupComplete() {
  const client = await pool.connect();

  try {
    console.log('Marking setup as completed...');

    // Mark setup as complete
    await client.query(`
      UPDATE setup_status
      SET is_completed = true,
          completed_at = NOW(),
          updated_at = NOW()
      WHERE id = (SELECT id FROM setup_status ORDER BY id LIMIT 1)
    `);

    console.log('✅ Setup marked as complete!');
    console.log('\nℹ️  You can now access /admin without being redirected to setup');

  } catch (error) {
    console.error('❌ Failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

markSetupComplete().catch(console.error);
