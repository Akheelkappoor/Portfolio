const { Pool } = require('pg');

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Adding pdf_url and display_order columns to projects table...');

    // Add pdf_url column
    await pool.query(`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS pdf_url TEXT;
    `);
    console.log('✓ Added pdf_url column');

    // Add display_order column with default value
    await pool.query(`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
    `);
    console.log('✓ Added display_order column');

    // Set initial display_order based on created_at (newest first)
    await pool.query(`
      UPDATE projects
      SET display_order = subquery.row_num
      FROM (
        SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
        FROM projects
      ) AS subquery
      WHERE projects.id = subquery.id
      AND projects.display_order = 0;
    `);
    console.log('✓ Set initial display_order values');

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
