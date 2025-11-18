-- Create table for storing chatbot conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Create index for faster session queries
CREATE INDEX IF NOT EXISTS idx_chat_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_conversations(created_at DESC);

-- Add comment
COMMENT ON TABLE chat_conversations IS 'Stores all chatbot conversations for analytics and improvement';
