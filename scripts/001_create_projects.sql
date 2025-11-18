CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  meta TEXT,
  badge TEXT,
  stack JSONB DEFAULT '[]'::jsonb,
  category JSONB DEFAULT '[]'::jsonb,
  challenge JSONB DEFAULT '[]'::jsonb,
  solution JSONB DEFAULT '[]'::jsonb,
  impact JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  github_url TEXT,
  live_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects (created_at DESC);
