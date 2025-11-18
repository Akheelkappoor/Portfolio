-- Create settings table for site-wide configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  -- Account Settings
  admin_email VARCHAR(255),
  email_notifications BOOLEAN DEFAULT true,
  session_timeout INTEGER DEFAULT 3600, -- in seconds

  -- Site Settings
  site_title VARCHAR(255) DEFAULT 'Portfolio',
  site_description TEXT,
  google_analytics_id VARCHAR(100),
  contact_form_email VARCHAR(255),

  -- Appearance Settings
  primary_color VARCHAR(7) DEFAULT '#f59e0b', -- amber-500
  secondary_color VARCHAR(7) DEFAULT '#ea580c', -- orange-600
  logo_url VARCHAR(500),
  favicon_url VARCHAR(500),

  -- SEO Settings
  default_og_image VARCHAR(500),
  twitter_handle VARCHAR(100),
  meta_keywords TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (
  admin_email,
  site_title,
  site_description,
  contact_form_email,
  primary_color,
  secondary_color
) VALUES (
  'admin@example.com',
  'Akheel Kappoor - Business Analyst Portfolio',
  'Business Analyst with 1+ year of experience delivering 80+ projects. Expert in requirements gathering, process optimization, and data-driven solutions.',
  'admin@example.com',
  '#f59e0b',
  '#ea580c'
) ON CONFLICT DO NOTHING;

-- Create admin_users table for password management
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (password: admin123 - should be changed!)
-- Note: In production, this should use proper bcrypt hashing
INSERT INTO admin_users (username, password_hash, email)
VALUES ('admin', '$2b$10$rQZ9vK5h5YqGxYxYxYxYxOuXK3qH7F7F7F7F7F7F7F7F7F7F7F7F7', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;
