const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function importData() {
  const client = await pool.connect();

  try {
    // Read data file
    const filename = 'my-portfolio-data.json';

    if (!fs.existsSync(filename)) {
      console.error(`❌ File not found: ${filename}`);
      console.log('💡 Run "node export-my-data.js" first to create this file');
      return;
    }

    const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    console.log('Importing portfolio data...\n');

    await client.query('BEGIN');

    // Import Profile
    if (data.profile) {
      await client.query(`
        UPDATE profile SET
          name = $1,
          title = $2,
          bio = $3,
          profile_image_url = $4,
          resume_url = $5,
          updated_at = NOW()
        WHERE id = (SELECT id FROM profile ORDER BY id LIMIT 1)
      `, [
        data.profile.name,
        data.profile.title,
        data.profile.bio,
        data.profile.profile_image_url,
        data.profile.resume_url
      ]);
      console.log('✓ Imported profile');
    }

    // Import Hero Section
    if (data.hero_section) {
      const h = data.hero_section;
      await client.query(`
        UPDATE hero_section SET
          badge_text = $1,
          name = $2,
          tagline = $3,
          description = $4,
          profile_image_url = $5,
          resume_url = $6,
          availability_status = $7,
          availability_location = $8,
          stat_1_value = $9, stat_1_label = $10,
          stat_2_value = $11, stat_2_label = $12,
          stat_3_value = $13, stat_3_label = $14,
          stat_4_value = $15, stat_4_label = $16,
          cta_primary_text = $17, cta_primary_link = $18,
          cta_secondary_text = $19, cta_secondary_link = $20,
          updated_at = NOW()
        WHERE id = (SELECT id FROM hero_section ORDER BY id LIMIT 1)
      `, [
        h.badge_text, h.name, h.tagline, h.description,
        h.profile_image_url, h.resume_url,
        h.availability_status, h.availability_location,
        h.stat_1_value, h.stat_1_label,
        h.stat_2_value, h.stat_2_label,
        h.stat_3_value, h.stat_3_label,
        h.stat_4_value, h.stat_4_label,
        h.cta_primary_text, h.cta_primary_link,
        h.cta_secondary_text, h.cta_secondary_link
      ]);
      console.log('✓ Imported hero section');
    }

    // Import Contact Page Content
    if (data.contact_page_content) {
      const c = data.contact_page_content;
      await client.query(`
        UPDATE contact_page_content SET
          heading = $1,
          subheading = $2,
          email = $3,
          phone = $4,
          linkedin_url = $5,
          github_url = $6,
          twitter_url = $7,
          location = $8,
          logo_text = $9,
          footer_tagline = $10,
          copyright_text = $11,
          footer_note = $12,
          show_email = $13,
          show_phone = $14,
          show_linkedin = $15,
          show_github = $16,
          show_twitter = $17,
          show_location = $18,
          updated_at = NOW()
        WHERE id = (SELECT id FROM contact_page_content ORDER BY id LIMIT 1)
      `, [
        c.heading, c.subheading, c.email, c.phone,
        c.linkedin_url, c.github_url, c.twitter_url, c.location,
        c.logo_text, c.footer_tagline, c.copyright_text, c.footer_note,
        c.show_email, c.show_phone, c.show_linkedin,
        c.show_github, c.show_twitter, c.show_location
      ]);
      console.log('✓ Imported contact page content');
    }

    // Import Site Settings
    if (data.site_settings) {
      const s = data.site_settings;
      await client.query(`
        UPDATE site_settings SET
          site_title = $1,
          admin_email = $2,
          primary_color = $3,
          secondary_color = $4,
          google_analytics_id = $5,
          logo_url = $6,
          favicon_url = $7,
          meta_keywords = $8,
          updated_at = NOW()
        WHERE id = (SELECT id FROM site_settings ORDER BY id LIMIT 1)
      `, [
        s.site_title, s.admin_email,
        s.primary_color, s.secondary_color,
        s.google_analytics_id, s.logo_url, s.favicon_url, s.meta_keywords
      ]);
      console.log('✓ Imported site settings');
    }

    // Import Work Experience
    if (data.work_experience && data.work_experience.length > 0) {
      await client.query('DELETE FROM work_experience');
      for (const exp of data.work_experience) {
        await client.query(`
          INSERT INTO work_experience (title, company, location, period, achievements, display_order, is_visible, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        `, [
          exp.title, exp.company, exp.location, exp.period,
          exp.achievements, exp.display_order, exp.is_visible
        ]);
      }
      console.log(`✓ Imported ${data.work_experience.length} work experience entries`);
    }

    // Import Skills Categories & Items
    if (data.skills_categories && data.skills_categories.length > 0) {
      await client.query('DELETE FROM skills_items');
      await client.query('DELETE FROM skills_categories');

      const categoryIdMap = {};

      for (let i = 0; i < data.skills_categories.length; i++) {
        const cat = data.skills_categories[i];
        const result = await client.query(`
          INSERT INTO skills_categories (title, icon, display_order, is_visible, created_at, updated_at)
          VALUES ($1, $2, $3, $4, NOW(), NOW())
          RETURNING id
        `, [cat.title, cat.icon, cat.display_order, cat.is_visible]);

        categoryIdMap[i + 1] = result.rows[0].id;
      }
      console.log(`✓ Imported ${data.skills_categories.length} skill categories`);

      // Import Skills Items
      if (data.skills_items && data.skills_items.length > 0) {
        for (const skill of data.skills_items) {
          const newCategoryId = categoryIdMap[skill.category_id];
          if (newCategoryId) {
            await client.query(`
              INSERT INTO skills_items (skill_name, category_id, display_order, created_at, updated_at)
              VALUES ($1, $2, $3, NOW(), NOW())
            `, [skill.skill_name, newCategoryId, skill.display_order]);
          }
        }
        console.log(`✓ Imported ${data.skills_items.length} skills`);
      }
    }

    // Import Projects
    if (data.projects && data.projects.length > 0) {
      await client.query('DELETE FROM projects');
      for (const proj of data.projects) {
        await client.query(`
          INSERT INTO projects (
            title, meta, badge, stack, category,
            challenge, solution, impact,
            github_url, live_url, display_order,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        `, [
          proj.title, proj.meta, proj.badge,
          proj.stack, proj.category,
          proj.challenge, proj.solution, proj.impact,
          proj.github_url, proj.live_url, proj.display_order
        ]);
      }
      console.log(`✓ Imported ${data.projects.length} projects`);
    }

    await client.query('COMMIT');

    console.log('\n✅ Import complete!');
    console.log('\n💡 Next steps:');
    console.log('   1. Upload project images via /admin/projects');
    console.log('   2. Upload profile image via /admin/homepage');
    console.log('   3. Customize colors via /admin/settings');
    console.log('\nData imported from: ' + data.exported_at);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Import failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importData().catch(console.error);
