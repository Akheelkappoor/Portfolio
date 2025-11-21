const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Starting footer fields migration...');

    // Add footer fields to contact_page_content table
    await client.query(`
      ALTER TABLE contact_page_content
      ADD COLUMN IF NOT EXISTS logo_text VARCHAR(50) DEFAULT 'AK',
      ADD COLUMN IF NOT EXISTS footer_tagline TEXT DEFAULT 'Business Analyst transforming data into actionable insights',
      ADD COLUMN IF NOT EXISTS copyright_text VARCHAR(255) DEFAULT 'All rights reserved.',
      ADD COLUMN IF NOT EXISTS footer_note VARCHAR(255) DEFAULT 'Built with ❤ using Next.js'
    `);
    console.log('✓ Added footer fields to contact_page_content table');

    // Update existing row with default values if they don't exist
    await client.query(`
      UPDATE contact_page_content
      SET
        logo_text = COALESCE(logo_text, 'AK'),
        footer_tagline = COALESCE(footer_tagline, 'Business Analyst transforming data into actionable insights'),
        copyright_text = COALESCE(copyright_text, 'All rights reserved.'),
        footer_note = COALESCE(footer_note, 'Built with ❤ using Next.js')
      WHERE id = (SELECT id FROM contact_page_content ORDER BY id LIMIT 1)
    `);
    console.log('✓ Updated existing data with footer defaults');

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
