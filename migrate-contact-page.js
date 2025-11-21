const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Starting contact page migration...');

    // Create contact_page_content table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_page_content (
        id SERIAL PRIMARY KEY,
        heading VARCHAR(255) NOT NULL DEFAULT 'Let''s work together',
        subheading TEXT NOT NULL DEFAULT 'Have a project in mind? Let''s discuss how we can work together.',
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        linkedin_url VARCHAR(500),
        github_url VARCHAR(500),
        twitter_url VARCHAR(500),
        location VARCHAR(255),
        show_email BOOLEAN DEFAULT true,
        show_phone BOOLEAN DEFAULT true,
        show_linkedin BOOLEAN DEFAULT true,
        show_github BOOLEAN DEFAULT true,
        show_twitter BOOLEAN DEFAULT true,
        show_location BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created contact_page_content table');

    // Check if data already exists
    const checkData = await client.query('SELECT COUNT(*) FROM contact_page_content');

    if (parseInt(checkData.rows[0].count) === 0) {
      // Insert default data from current hardcoded values
      await client.query(`
        INSERT INTO contact_page_content (
          heading,
          subheading,
          email,
          phone,
          linkedin_url,
          github_url,
          location
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7
        )
      `, [
        'Let\'s work together',
        'Have a project in mind? Let\'s discuss how we can work together.',
        'akheelkappoor@outlook.com',
        '+971504978045',
        'https://linkedin.com/in/akheelkappoor',
        'https://github.com/akheelkappoor',
        'Dubai, UAE'
      ]);
      console.log('✓ Inserted default contact page content');
    } else {
      console.log('✓ Contact page content already exists, skipping insert');
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
