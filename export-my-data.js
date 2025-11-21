const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function exportData() {
  const client = await pool.connect();

  try {
    console.log('Exporting your portfolio data...\n');

    const data = {
      exported_at: new Date().toISOString(),
      profile: null,
      hero_section: null,
      contact_page_content: null,
      site_settings: null,
      work_experience: [],
      skills_categories: [],
      skills_items: [],
      projects: []
    };

    // Export Profile
    const profile = await client.query('SELECT * FROM profile ORDER BY id LIMIT 1');
    if (profile.rows.length > 0) {
      const p = profile.rows[0];
      data.profile = {
        name: p.name,
        title: p.title,
        bio: p.bio,
        profile_image_url: p.profile_image_url,
        resume_url: p.resume_url
      };
      console.log('✓ Exported profile');
    }

    // Export Hero Section
    const hero = await client.query('SELECT * FROM hero_section ORDER BY id LIMIT 1');
    if (hero.rows.length > 0) {
      const h = hero.rows[0];
      data.hero_section = {
        badge_text: h.badge_text,
        name: h.name,
        tagline: h.tagline,
        description: h.description,
        profile_image_url: h.profile_image_url,
        resume_url: h.resume_url,
        availability_status: h.availability_status,
        availability_location: h.availability_location,
        stat_1_value: h.stat_1_value,
        stat_1_label: h.stat_1_label,
        stat_2_value: h.stat_2_value,
        stat_2_label: h.stat_2_label,
        stat_3_value: h.stat_3_value,
        stat_3_label: h.stat_3_label,
        stat_4_value: h.stat_4_value,
        stat_4_label: h.stat_4_label,
        cta_primary_text: h.cta_primary_text,
        cta_primary_link: h.cta_primary_link,
        cta_secondary_text: h.cta_secondary_text,
        cta_secondary_link: h.cta_secondary_link
      };
      console.log('✓ Exported hero section');
    }

    // Export Contact Page Content
    const contact = await client.query('SELECT * FROM contact_page_content ORDER BY id LIMIT 1');
    if (contact.rows.length > 0) {
      const c = contact.rows[0];
      data.contact_page_content = {
        heading: c.heading,
        subheading: c.subheading,
        email: c.email,
        phone: c.phone,
        linkedin_url: c.linkedin_url,
        github_url: c.github_url,
        twitter_url: c.twitter_url,
        location: c.location,
        logo_text: c.logo_text,
        footer_tagline: c.footer_tagline,
        copyright_text: c.copyright_text,
        footer_note: c.footer_note,
        show_email: c.show_email,
        show_phone: c.show_phone,
        show_linkedin: c.show_linkedin,
        show_github: c.show_github,
        show_twitter: c.show_twitter,
        show_location: c.show_location
      };
      console.log('✓ Exported contact page content');
    }

    // Export Site Settings
    const settings = await client.query('SELECT * FROM site_settings ORDER BY id LIMIT 1');
    if (settings.rows.length > 0) {
      const s = settings.rows[0];
      data.site_settings = {
        site_title: s.site_title,
        admin_email: s.admin_email,
        primary_color: s.primary_color,
        secondary_color: s.secondary_color,
        google_analytics_id: s.google_analytics_id,
        logo_url: s.logo_url,
        favicon_url: s.favicon_url,
        meta_keywords: s.meta_keywords
      };
      console.log('✓ Exported site settings');
    }

    // Export Work Experience
    const experience = await client.query('SELECT * FROM work_experience ORDER BY display_order');
    data.work_experience = experience.rows.map(e => ({
      title: e.title,
      company: e.company,
      location: e.location,
      period: e.period,
      achievements: e.achievements,
      display_order: e.display_order,
      is_visible: e.is_visible
    }));
    console.log(`✓ Exported ${data.work_experience.length} work experience entries`);

    // Export Skills Categories
    const skillsCat = await client.query('SELECT * FROM skills_categories ORDER BY display_order');
    data.skills_categories = skillsCat.rows.map(sc => ({
      title: sc.title,
      icon: sc.icon,
      display_order: sc.display_order,
      is_visible: sc.is_visible
    }));
    console.log(`✓ Exported ${data.skills_categories.length} skill categories`);

    // Export Skills Items
    const skillsItems = await client.query('SELECT * FROM skills_items ORDER BY category_id, display_order');
    data.skills_items = skillsItems.rows.map(si => ({
      skill_name: si.skill_name,
      category_id: si.category_id,
      display_order: si.display_order
    }));
    console.log(`✓ Exported ${data.skills_items.length} skills`);

    // Export Projects (without images - just metadata)
    const projects = await client.query('SELECT * FROM projects ORDER BY display_order');
    data.projects = projects.rows.map(p => ({
      title: p.title,
      meta: p.meta,
      badge: p.badge,
      stack: p.stack,
      category: p.category,
      challenge: p.challenge,
      solution: p.solution,
      impact: p.impact,
      github_url: p.github_url,
      live_url: p.live_url,
      display_order: p.display_order,
      // Note: image_url and pdf_url not exported (user needs to upload their own)
    }));
    console.log(`✓ Exported ${data.projects.length} projects`);

    // Write to file
    const filename = 'my-portfolio-data.json';
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    console.log('\n✅ Export complete!');
    console.log(`📄 File created: ${filename}`);
    console.log('\n💡 You can now:');
    console.log('   1. Share this file with your portfolio');
    console.log('   2. Use it as example data for others');
    console.log('   3. Import it with: node import-portfolio-data.js');

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

exportData().catch(console.error);
