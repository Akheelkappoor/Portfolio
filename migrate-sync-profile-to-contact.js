const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('Syncing profile data to contact_page_content...');

    // Get current profile data
    const profileResult = await client.query('SELECT * FROM profile ORDER BY id LIMIT 1');

    if (profileResult.rows.length === 0) {
      console.log('⚠️  No profile data found, skipping sync');
      return;
    }

    const profile = profileResult.rows[0];

    // Get current contact data
    const contactResult = await client.query('SELECT * FROM contact_page_content ORDER BY id LIMIT 1');

    if (contactResult.rows.length === 0) {
      console.log('⚠️  No contact data found, skipping sync');
      return;
    }

    // Sync profile social links to contact_page_content (only if contact fields are empty)
    await client.query(`
      UPDATE contact_page_content
      SET
        email = COALESCE(NULLIF(email, ''), $1),
        phone = COALESCE(NULLIF(phone, ''), $2),
        linkedin_url = COALESCE(NULLIF(linkedin_url, ''), $3),
        github_url = COALESCE(NULLIF(github_url, ''), $4),
        twitter_url = COALESCE(NULLIF(twitter_url, ''), $5),
        location = COALESCE(NULLIF(location, ''), $6)
      WHERE id = (SELECT id FROM contact_page_content ORDER BY id LIMIT 1)
    `, [
      profile.email,
      profile.phone,
      profile.linkedin_url,
      profile.github_url,
      profile.twitter_url,
      profile.location
    ]);

    console.log('✓ Synced profile data to contact_page_content');
    console.log(`  Email: ${profile.email}`);
    console.log(`  Phone: ${profile.phone}`);
    console.log(`  LinkedIn: ${profile.linkedin_url}`);
    console.log(`  GitHub: ${profile.github_url}`);
    console.log(`  Twitter: ${profile.twitter_url}`);
    console.log(`  Location: ${profile.location}`);

    console.log('\n✅ Sync completed successfully!');
    console.log('\nℹ️  Now you can manage all contact info from /admin/contact');

  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
