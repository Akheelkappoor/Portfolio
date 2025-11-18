# N8N AI Chatbot Setup Guide

## 📋 Overview
This guide will help you set up a complete AI-powered chatbot for your portfolio that:
- Answers questions about your experience, skills, and projects
- Connects to your PostgreSQL database for real-time data
- Uses OpenAI GPT-4 for intelligent responses
- Logs all conversations for analytics

---

## 🗄️ Step 1: Create Database Table

Run this SQL in your PostgreSQL database:

```sql
-- Create table for storing chatbot conversations
CREATE TABLE IF NOT EXISTS chat_conversations (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_session_id ON chat_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_created_at ON chat_conversations(created_at DESC);
```

**Execute:**
```bash
PGPASSWORD='XrebTfymkYVSh2zniGKy' psql -h localhost -U postgres -d portfolio -f sql/create_chat_conversations_table.sql
```

---

## 🔧 Step 2: Import N8N Workflow

### Prerequisites:
1. **N8N Instance**: Make sure N8N is running at `https://n8n.lms-i2global.com`
2. **OpenAI API Key**: Get one from https://platform.openai.com/api-keys
3. **Database Credentials**: Your PostgreSQL connection details

### Import Steps:

1. **Login to N8N**
   - Go to: https://n8n.lms-i2global.com
   - Login with your credentials

2. **Create New Workflow**
   - Click "+ New Workflow" in the top-right
   - Click the "⋮" menu → "Import from File"
   - Select `n8n-chatbot-workflow.json`

3. **Configure Credentials**

   **A. OpenAI Credential:**
   - Click on "OpenAI ChatGPT" node
   - Click "Select Credential" → "Create New"
   - Name: "OpenAI Account"
   - API Key: Paste your OpenAI API key
   - Save

   **B. PostgreSQL Credential:**
   - Click on "Query Portfolio Database" node
   - Click "Select Credential" → "Create New"
   - Name: "Portfolio Database"
   - Fill in:
     ```
     Host: localhost (or your RDS endpoint)
     Database: portfolio
     User: postgres
     Password: XrebTfymkYVSh2zniGKy
     Port: 5432
     SSL: Enable if using RDS
     ```
   - Test Connection → Save

   **C. Apply Same Credential:**
   - Click "Log Conversation (Optional)" node
   - Select the same "Portfolio Database" credential

4. **Activate Webhook**
   - Click on "Webhook - Chat Message" node
   - Copy the webhook URL (should be: `https://n8n.lms-i2global.com/webhook/chat-assistant`)
   - Make sure "Wait for Webhook Call" is enabled

5. **Save & Activate**
   - Click "Save" (top-right)
   - Toggle "Active" to ON
   - Workflow is now live! 🎉

---

## 🧪 Step 3: Test the Workflow

### Test in N8N:

1. Click "Execute Workflow" in N8N
2. The webhook will wait for a POST request
3. Open a new terminal and test:

```bash
curl -X POST https://n8n.lms-i2global.com/webhook/chat-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are your key skills?",
    "timestamp": "2025-11-18T12:00:00.000Z",
    "sessionId": "test-session-123"
  }'
```

**Expected Response:**
```json
{
  "response": "I specialize in SQL, Python, Excel, Power BI, and Tableau. I have 1+ year of experience as a Business Analyst, having delivered 80+ projects. Would you like to know more about any specific skill or project?",
  "sessionId": "test-session-123",
  "timestamp": "2025-11-18T12:00:15.000Z",
  "metadata": {
    "userMessage": "What are your key skills?",
    "receivedAt": "2025-11-18T12:00:00.000Z",
    "respondedAt": "2025-11-18T12:00:15.000Z"
  }
}
```

### Test on Website:

1. Open: http://localhost:3000
2. Click the floating chat button (bottom-right)
3. Type: "Tell me about your experience"
4. Press Enter or click Send
5. You should get an AI response in 2-3 seconds!

---

## 🎯 Step 4: Workflow Explanation

### Node Flow:

```
1. Webhook Trigger
   ↓
2. Extract Message Data (parse incoming JSON)
   ↓
3. Query Portfolio Database (fetch all relevant data)
   ↓
4. Build AI Context (format database results for AI)
   ↓
5. OpenAI ChatGPT (generate intelligent response)
   ↓
6. Format Response (structure output)
   ↓
7. Log Conversation (save to database)
   ↓
8. Respond to Webhook (send back to chatbot)
```

### What Each Node Does:

| Node | Purpose |
|------|---------|
| **Webhook - Chat Message** | Receives POST requests from your chatbot |
| **Extract Message Data** | Parses user message, session ID, timestamp |
| **Query Portfolio Database** | Fetches profile, hero, experience, skills, projects data |
| **Build AI Context** | Formats database results into a comprehensive context string |
| **OpenAI ChatGPT** | Uses GPT-4 to generate human-like responses |
| **Format Response** | Structures the AI response for the chatbot |
| **Log Conversation** | Saves conversation to `chat_conversations` table |
| **Respond to Webhook** | Returns JSON response to chatbot widget |

---

## 🤖 Step 5: Customize AI Behavior

Edit the **OpenAI ChatGPT** node's system prompt to change the AI's personality:

```javascript
You are Akheel Kappoor's AI assistant on his portfolio website...

KEY INSTRUCTIONS:
1. Always respond in first person (use "I" and "my")
2. Be friendly, professional, and helpful
3. Keep responses concise (2-4 sentences max)
4. Use emojis sparingly (1-2 max per response)
5. End with a call-to-action when appropriate

Examples:
- User: "What's your experience?"
  Bot: "I'm a Business Analyst with 1+ year of experience, having delivered 80+ successful projects across various industries. I specialize in data analysis, process optimization, and stakeholder management. Would you like to know about any specific project?"

- User: "Do you know Python?"
  Bot: "Yes! Python is one of my core skills. I use it for data analysis, automation, and building analytics dashboards. I'm also proficient in SQL, Excel, Power BI, and Tableau. What kind of project are you working on?"
```

---

## 📊 Step 6: View Conversation Analytics

Check stored conversations:

```sql
-- View all conversations
SELECT
  session_id,
  user_message,
  bot_response,
  created_at
FROM chat_conversations
ORDER BY created_at DESC
LIMIT 20;

-- Count conversations by date
SELECT
  DATE(created_at) as date,
  COUNT(*) as conversation_count
FROM chat_conversations
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Most common questions
SELECT
  user_message,
  COUNT(*) as frequency
FROM chat_conversations
GROUP BY user_message
ORDER BY frequency DESC
LIMIT 10;
```

---

## 🚀 Advanced Features

### A. Add Sentiment Analysis

Insert node after "Extract Message Data":
- **Node**: "Sentiment Analysis"
- **Type**: Code Node
- **Purpose**: Detect user sentiment (positive/negative/neutral)

### B. Add FAQ Matching

Insert node before "OpenAI ChatGPT":
- **Node**: "Check FAQ Database"
- **Type**: PostgreSQL Query
- **Purpose**: Check if question matches pre-defined FAQs (faster & cheaper)

### C. Add Email Notifications

Insert node after "Log Conversation":
- **Node**: "Send Email Alert"
- **Type**: Email Send
- **Trigger**: When user asks about availability or wants to connect

### D. Add Session Management

Store conversation context per session:
```sql
ALTER TABLE chat_conversations ADD COLUMN conversation_context JSONB;
```

Update workflow to maintain conversation history within a session.

---

## 🔒 Security Best Practices

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Input Validation**: Sanitize user inputs before sending to AI
3. **API Key Rotation**: Rotate OpenAI API keys regularly
4. **CORS Policy**: Configure proper CORS headers
5. **Monitor Costs**: Track OpenAI API usage and set limits

---

## 💰 Cost Estimation

**OpenAI GPT-4 Pricing:**
- Input: $0.03 per 1K tokens
- Output: $0.06 per 1K tokens

**Average Conversation:**
- Context: ~1,500 tokens (your portfolio data)
- User message: ~50 tokens
- Bot response: ~150 tokens
- **Total**: ~1,700 tokens ≈ $0.06 per conversation

**Monthly Estimate (100 conversations):**
- 100 conversations × $0.06 = **$6/month**

**Tip**: Use GPT-3.5-turbo for lower costs (~90% cheaper)

---

## 🐛 Troubleshooting

### Issue: Webhook not receiving requests
**Solution:**
- Check if workflow is "Active"
- Verify webhook URL matches in chatbot-widget.tsx
- Check N8N logs for errors

### Issue: Database connection failed
**Solution:**
- Test PostgreSQL credentials
- Check if database is accessible from N8N server
- Verify SSH tunnel is running (if using)

### Issue: AI responses are too long
**Solution:**
- Adjust "maxTokens" in OpenAI node (reduce from 500 to 200)
- Update system prompt to be more concise

### Issue: Slow response times
**Solution:**
- Use GPT-3.5-turbo instead of GPT-4
- Cache common questions/answers
- Reduce database query complexity

---

## 📞 Support

**Questions?** Contact:
- Email: admin@example.com
- GitHub Issues: [Your Repo]

**Resources:**
- N8N Docs: https://docs.n8n.io
- OpenAI API: https://platform.openai.com/docs
- PostgreSQL: https://www.postgresql.org/docs/

---

## ✅ Checklist

- [ ] Database table created (`chat_conversations`)
- [ ] N8N workflow imported
- [ ] OpenAI credentials configured
- [ ] PostgreSQL credentials configured
- [ ] Workflow activated
- [ ] Test conversation successful
- [ ] Chatbot widget appears on website
- [ ] Conversations being logged to database
- [ ] AI responses are accurate and helpful

---

**Congratulations! Your AI chatbot is now live! 🎉**
