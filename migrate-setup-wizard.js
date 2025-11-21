const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Creating setup wizard tables...');

    // Create setup_status table
    await client.query(`
      CREATE TABLE IF NOT EXISTS setup_status (
        id SERIAL PRIMARY KEY,
        is_completed BOOLEAN DEFAULT false,
        current_step INTEGER DEFAULT 1,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created setup_status table');

    // Create admin_credentials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) DEFAULT 'admin',
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created admin_credentials table');

    // Check if setup status already exists
    const setupCheck = await client.query('SELECT COUNT(*) FROM setup_status');

    if (parseInt(setupCheck.rows[0].count) === 0) {
      // Insert initial setup status
      await client.query(`
        INSERT INTO setup_status (is_completed, current_step)
        VALUES (false, 1)
      `);
      console.log('✓ Inserted initial setup status');
    } else {
      console.log('✓ Setup status already exists');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nℹ️  Setup wizard will run on first admin login');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
