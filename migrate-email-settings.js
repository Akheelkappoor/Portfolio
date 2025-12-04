const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Creating email_settings table...');

    // Create email_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_settings (
        id SERIAL PRIMARY KEY,
        smtp_host VARCHAR(255) DEFAULT 'smtp.gmail.com',
        smtp_port INTEGER DEFAULT 587,
        smtp_user VARCHAR(255),
        smtp_password_encrypted TEXT,
        from_email VARCHAR(255),
        to_email VARCHAR(255),
        email_enabled BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✓ email_settings table created');

    // Insert default row (empty, disabled by default)
    const checkResult = await client.query('SELECT COUNT(*) FROM email_settings');
    if (parseInt(checkResult.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO email_settings (
          smtp_host, smtp_port, email_enabled
        ) VALUES ('smtp.gmail.com', 587, false)
      `);
      console.log('✓ Default email settings row inserted');
    }

    console.log('\n✅ Migration complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Go to /admin/settings');
    console.log('   2. Configure email settings');
    console.log('   3. Enter your Gmail and App Password');
    console.log('   4. Enable email notifications');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
