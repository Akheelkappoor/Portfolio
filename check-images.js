const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkImages() {
  try {
    const result = await pool.query(`
      SELECT id, title, image_url, created_at
      FROM projects
      ORDER BY created_at DESC
      LIMIT 5
    `);

    console.log('\n📊 Recent Projects:\n');
    result.rows.forEach(row => {
      console.log(`Title: ${row.title}`);
      console.log(`Image URL: ${row.image_url || 'No image'}`);
      console.log(`Created: ${row.created_at}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkImages();
