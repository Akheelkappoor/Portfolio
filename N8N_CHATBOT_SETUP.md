# 🤖 N8N AI Chatbot Setup Guide

This guide will help you set up an AI-powered chatbot for your portfolio using N8N and OpenAI GPT-4.

**What you'll build:**
- AI chatbot widget on your portfolio
- GPT-4 powered responses
- Connected to your portfolio data (database)
- Conversation history tracking
- Real-time chat interface

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: N8N Setup](#step-1-n8n-setup)
4. [Step 2: OpenAI API Key](#step-2-openai-api-key)
5. [Step 3: Create Workflow](#step-3-create-workflow)
6. [Step 4: Configure Nodes](#step-4-configure-nodes)
7. [Step 5: Test the Chatbot](#step-5-test-the-chatbot)
8. [Step 6: Advanced Configuration](#step-6-advanced-configuration)
9. [Troubleshooting](#troubleshooting)
10. [Cost Estimate](#cost-estimate)

---

## 🎯 Overview

### What is N8N?

N8N is a workflow automation tool (like Zapier) that connects different services. We'll use it to:
1. Receive messages from your chatbot widget
2. Query your PostgreSQL database for portfolio data
3. Send data to OpenAI GPT-4 for intelligent responses
4. Return responses to your website
5. Log conversations in your database

### Architecture:

```
Your Portfolio Website
    ↓ (User sends message)
N8N Webhook
    ↓ (Fetch portfolio data)
PostgreSQL Database
    ↓ (Send to AI)
OpenAI GPT-4
    ↓ (Get response)
N8N Workflow
    ↓ (Return to website)
Chatbot Widget
    ↓ (Save conversation)
Database (chat_conversations table)
```

---

## ✅ Prerequisites

### Required:

1. **N8N Account**
   - **Option A:** N8N Cloud (Easiest) - [Sign up](https://n8n.io/cloud/)
     - Free tier: 5,000 workflow executions/month
     - $20/month for 25,000 executions
   - **Option B:** Self-hosted N8N (Advanced) - [Guide](https://docs.n8n.io/hosting/)

2. **OpenAI Account & API Key**
   - [Sign up](https://platform.openai.com/signup)
   - [Get API key](https://platform.openai.com/api-keys)
   - Requires: $5 minimum credit deposit

3. **Portfolio Database**
   - Your PostgreSQL database (from main setup)
   - Connection string from `.env.local`

4. **Your Portfolio Deployed**
   - Chatbot widget already exists in the code
   - Just needs webhook URL from N8N

### Cost Estimate:

- **N8N Cloud Free Tier:** $0 (5,000 executions/month)
- **OpenAI API:** ~$5-10/month for moderate usage
- **Total:** ~$5-10/month (or $25-30 with N8N paid)

---

## 🚀 Step 1: N8N Setup

### Option A: N8N Cloud (Recommended)

1. **Sign Up:**
   - Go to [https://n8n.io/cloud/](https://n8n.io/cloud/)
   - Click **Start Free**
   - Enter email and password
   - Verify email

2. **Create Workflow:**
   - After login, click **+ New Workflow**
   - Name it: "Portfolio Chatbot"
   - You'll see the workflow canvas

### Option B: Self-Hosted N8N

If you prefer to self-host on your EC2 instance:

```bash
# Connect to your EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Install N8N with PM2
sudo npm install -g n8n

# Start N8N
pm2 start n8n --name "n8n" -- start

# Save PM2 configuration
pm2 save

# Access N8N at: http://YOUR_EC2_IP:5678
```

**Configure Nginx for N8N:**

```bash
sudo nano /etc/nginx/sites-available/n8n
```

```nginx
server {
    listen 80;
    server_name n8n.yourdomain.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL
sudo certbot --nginx -d n8n.yourdomain.com
```

---

## 🔑 Step 2: OpenAI API Key

### Get Your API Key:

1. **Sign Up / Login:**
   - Go to [https://platform.openai.com/](https://platform.openai.com/)
   - Create account or login

2. **Add Credit:**
   - Go to [Billing](https://platform.openai.com/account/billing/overview)
   - Click **Add payment method**
   - Add $5-10 credit

3. **Create API Key:**
   - Go to [API Keys](https://platform.openai.com/api-keys)
   - Click **+ Create new secret key**
   - Name it: "Portfolio Chatbot"
   - Copy the key (starts with `sk-...`)
   - **⚠️ IMPORTANT:** Save this securely - you can't see it again!

### API Key Costs:

**GPT-4o (Recommended):**
- Input: $2.50 per 1M tokens (~$0.0025 per conversation)
- Output: $10 per 1M tokens (~$0.01 per conversation)
- **Average:** ~$0.01 per conversation

**GPT-3.5-turbo (Budget option):**
- Input: $0.50 per 1M tokens (~$0.0005 per conversation)
- Output: $1.50 per 1M tokens (~$0.0015 per conversation)
- **Average:** ~$0.002 per conversation

**For 100 conversations/month:** ~$1-2/month

---

## 🔧 Step 3: Create Workflow

### Workflow Overview:

We'll create a workflow with these nodes:

1. **Webhook** - Receives messages from your website
2. **PostgreSQL** - Fetches your portfolio data
3. **Code** - Formats data for AI
4. **OpenAI** - Generates intelligent responses
5. **PostgreSQL** - Logs conversation
6. **Respond to Webhook** - Returns response

### Create the Workflow:

#### Node 1: Webhook (Trigger)

1. Click **+** → Search "Webhook"
2. Select **Webhook** node
3. **Settings:**
   ```
   HTTP Method: POST
   Path: chatbot
   Response Mode: Using 'Respond to Webhook' Node
   ```
4. Click **Execute Node**
5. **Copy the webhook URL** - it looks like:
   ```
   https://your-instance.app.n8n.cloud/webhook/chatbot
   ```
6. Save this URL - you'll need it later!

#### Node 2: PostgreSQL - Get Profile Data

1. Click **+** → Search "PostgreSQL"
2. Select **PostgreSQL** node
3. Click **Add new credential**
4. **Database Connection:**
   ```
   Host: your-rds-endpoint.region.rds.amazonaws.com
   Database: portfolio
   User: postgres
   Password: [Your database password]
   Port: 5432
   SSL: Enabled
   ```
5. **Query Settings:**
   ```
   Operation: Execute Query
   Query:
   SELECT
     p.full_name,
     p.title,
     p.bio,
     h.tagline,
     h.description
   FROM profile p
   LEFT JOIN hero_section h ON true
   LIMIT 1;
   ```
6. Click **Test & Execute** - Should return your data

#### Node 3: PostgreSQL - Get Experience

1. Add another **PostgreSQL** node
2. Use same credentials
3. **Query:**
   ```sql
   SELECT
     company,
     position,
     start_date,
     end_date,
     location,
     achievements
   FROM work_experience
   WHERE visible = true
   ORDER BY start_date DESC;
   ```

#### Node 4: PostgreSQL - Get Skills

1. Add another **PostgreSQL** node
2. **Query:**
   ```sql
   SELECT
     sc.name as category,
     json_agg(si.name) as skills
   FROM skills_categories sc
   LEFT JOIN skills_items si ON sc.id = si.category_id
   WHERE sc.visible = true AND si.visible = true
   GROUP BY sc.id, sc.name
   ORDER BY sc.display_order;
   ```

#### Node 5: PostgreSQL - Get Projects

1. Add another **PostgreSQL** node
2. **Query:**
   ```sql
   SELECT
     title,
     description,
     technologies,
     project_link,
     github_link
   FROM projects
   WHERE visible = true
   ORDER BY display_order
   LIMIT 5;
   ```

#### Node 6: Code Node - Format Context

1. Add a **Code** node
2. **JavaScript code:**

```javascript
// Get all data from previous nodes
const webhookData = $input.first().json;
const profileData = $node["PostgreSQL"].json[0];
const experienceData = $node["PostgreSQL1"].json;
const skillsData = $node["PostgreSQL2"].json;
const projectsData = $node["PostgreSQL3"].json;

// Format experience
const experienceText = experienceData.map(exp =>
  `${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date || 'Present'})`
).join('\n');

// Format skills
const skillsText = skillsData.map(cat =>
  `${cat.category}: ${cat.skills.join(', ')}`
).join('\n');

// Format projects
const projectsText = projectsData.map(proj =>
  `${proj.title}: ${proj.description}`
).join('\n');

// Create system prompt
const systemPrompt = `You are an AI assistant for ${profileData.full_name}'s portfolio website.

Profile:
- Name: ${profileData.full_name}
- Title: ${profileData.title}
- Tagline: ${profileData.tagline}
- Bio: ${profileData.bio}

Work Experience:
${experienceText}

Skills:
${skillsText}

Projects:
${projectsText}

Your role:
- Answer questions about ${profileData.full_name}'s background, skills, experience, and projects
- Be professional, friendly, and helpful
- Keep responses concise (2-3 sentences)
- If asked something you don't know, politely say so
- Don't make up information not provided above

User question: ${webhookData.message}`;

return {
  json: {
    message: webhookData.message,
    systemPrompt: systemPrompt,
    conversationId: webhookData.conversationId || null
  }
};
```

3. Click **Execute Node** - Should show formatted prompt

#### Node 7: OpenAI Chat

1. Add **OpenAI** node
2. Click **Add new credential**
3. **API Key:** Paste your OpenAI key
4. **Settings:**
   ```
   Resource: Message a Model
   Model: gpt-4o

   Messages:
   - Role: System
     Content: {{ $json.systemPrompt }}

   - Role: User
     Content: {{ $json.message }}

   Options:
   - Max Tokens: 300
   - Temperature: 0.7
   ```

5. Click **Execute Node** - Should get AI response

#### Node 8: PostgreSQL - Log Conversation

1. Add **PostgreSQL** node
2. **Query:**
   ```sql
   INSERT INTO chat_conversations (
     conversation_id,
     message,
     response,
     created_at
   ) VALUES (
     '{{ $json.conversationId }}',
     '{{ $json.message }}',
     '{{ $node["OpenAI"].json.text }}',
     NOW()
   ) RETURNING id;
   ```

#### Node 9: Respond to Webhook

1. Add **Respond to Webhook** node
2. **Settings:**
   ```
   Response Body:
   {
     "success": true,
     "response": "{{ $node["OpenAI"].json.text }}",
     "timestamp": "{{ $now }}"
   }
   ```

### Connect All Nodes:

1. **Webhook** → **PostgreSQL** (Profile)
2. **Webhook** → **PostgreSQL** (Experience)
3. **Webhook** → **PostgreSQL** (Skills)
4. **Webhook** → **PostgreSQL** (Projects)
5. **All PostgreSQL nodes** → **Code** node
6. **Code** → **OpenAI**
7. **OpenAI** → **PostgreSQL** (Log)
8. **PostgreSQL** (Log) → **Respond to Webhook**

### Activate Workflow:

1. Click **Save** (top right)
2. Toggle **Active** switch (top right)
3. Workflow is now live!

---

## 🔗 Step 4: Configure Your Portfolio

### Add Webhook URL to Environment:

1. **Copy your webhook URL** from N8N
2. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_CHATBOT_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/chatbot
   ```

3. **Rebuild your portfolio:**
   ```bash
   # Local
   npm run build
   npm run dev

   # Or redeploy to Vercel/EC2
   ```

### For Vercel:
1. Dashboard → Project → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_CHATBOT_WEBHOOK_URL`
3. Value: Your webhook URL
4. Redeploy

### For EC2:
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Edit .env.local
cd Portfolio
nano .env.local

# Add the webhook URL
# Save (Ctrl+X, Y, Enter)

# Rebuild and restart
npm run build
pm2 restart portfolio
```

---

## 🧪 Step 5: Test the Chatbot

### Test in N8N:

1. Go to your workflow
2. Click **Webhook** node
3. Click **Execute Node** → **Test step**
4. Use curl to test:

```bash
curl -X POST https://your-instance.app.n8n.cloud/webhook/chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me about your experience",
    "conversationId": "test-123"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "response": "I have experience in...",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Test on Your Website:

1. Visit your portfolio: `https://yourdomain.com`
2. Look for chatbot widget (bottom-right corner)
3. Click to open chat
4. Send a message: "What do you do?"
5. Should receive AI-powered response!

### Test Questions:

Try these to verify it's working:
- "What is your background?"
- "Tell me about your experience"
- "What skills do you have?"
- "What projects have you worked on?"
- "How can I contact you?"

---

## 🎛️ Step 6: Advanced Configuration

### Customize AI Personality:

Edit the Code node's system prompt:

```javascript
const systemPrompt = `You are an AI assistant for ${profileData.full_name}'s portfolio.

Personality traits:
- Professional but approachable
- Enthusiastic about technology
- Direct and concise
- Helpful and informative

[Rest of prompt...]
`;
```

### Add Conversation Memory:

Modify OpenAI node to include conversation history:

```javascript
// In Code node, fetch last 5 messages
const conversationHistory = await fetch(`${process.env.DATABASE_URL}`, {
  method: 'POST',
  body: `
    SELECT message, response
    FROM chat_conversations
    WHERE conversation_id = '${webhookData.conversationId}'
    ORDER BY created_at DESC
    LIMIT 5
  `
});

// Add to OpenAI messages
const messages = [
  { role: 'system', content: systemPrompt },
  ...conversationHistory.map(h => [
    { role: 'user', content: h.message },
    { role: 'assistant', content: h.response }
  ]).flat(),
  { role: 'user', content: webhookData.message }
];
```

### Rate Limiting:

Add a Code node before OpenAI:

```javascript
// Check request frequency
const recentRequests = await fetch(`${process.env.DATABASE_URL}`, {
  body: `
    SELECT COUNT(*) as count
    FROM chat_conversations
    WHERE created_at > NOW() - INTERVAL '1 minute'
  `
});

if (recentRequests[0].count > 10) {
  throw new Error('Rate limit exceeded. Please wait a moment.');
}

return $input.all();
```

### Add Sentiment Analysis:

Before OpenAI node, add another OpenAI node:

```javascript
// Analyze user message sentiment
const sentimentAnalysis = await openai.chat({
  model: 'gpt-3.5-turbo',
  messages: [{
    role: 'system',
    content: 'Analyze sentiment: positive, negative, or neutral. One word only.'
  }, {
    role: 'user',
    content: webhookData.message
  }]
});

// Log sentiment
console.log(`Sentiment: ${sentimentAnalysis}`);
```

### Error Handling:

Wrap OpenAI node in error handler:

1. Add **IF** node after OpenAI
2. **Condition:** `{{ $node["OpenAI"].json.error }}`
3. **True:** Return error message
4. **False:** Continue to Respond node

---

## 🐛 Troubleshooting

### Chatbot Not Responding

**Check these:**

1. **Workflow is active** (toggle should be green)
2. **Webhook URL is correct** in `.env.local`
3. **Test webhook directly:**
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{"message": "test"}'
   ```
4. **Check N8N logs:**
   - N8N Cloud: Executions tab
   - Self-hosted: `pm2 logs n8n`

### OpenAI Errors

**Error: "Insufficient credits"**
- Add credits: [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)

**Error: "Invalid API key"**
- Verify key in N8N credentials
- Regenerate key if needed

**Error: "Rate limit exceeded"**
- Wait a minute and try again
- Upgrade OpenAI tier if needed

### Database Connection Failed

**Error: "Connection refused"**
- Check database credentials in N8N
- Verify RDS security group allows N8N IP
- For N8N Cloud: Allow all IPs (0.0.0.0/0) in RDS

### Empty Responses

**Problem:** AI returns no data

1. **Test each PostgreSQL node individually**
2. **Verify data exists in database:**
   ```sql
   SELECT * FROM profile;
   SELECT * FROM work_experience WHERE visible = true;
   ```
3. **Check Code node output**

### CORS Errors

**Error:** "CORS policy blocked"

Add to your Next.js API:

```javascript
// app/api/chatbot/route.ts
export async function POST(req: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Your chatbot logic
}
```

---

## 📊 Monitoring & Analytics

### View Conversations:

In your database:

```sql
-- Recent conversations
SELECT
  conversation_id,
  message,
  response,
  created_at
FROM chat_conversations
ORDER BY created_at DESC
LIMIT 50;

-- Popular questions
SELECT
  message,
  COUNT(*) as frequency
FROM chat_conversations
GROUP BY message
ORDER BY frequency DESC
LIMIT 10;

-- Daily usage
SELECT
  DATE(created_at) as date,
  COUNT(*) as conversations
FROM chat_conversations
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### N8N Monitoring:

1. **Executions:** Track workflow runs
2. **Errors:** Monitor failed executions
3. **Performance:** Check execution times

### OpenAI Usage:

Check usage at: [https://platform.openai.com/usage](https://platform.openai.com/usage)

---

## 💰 Cost Estimate

### Monthly Costs:

**N8N Cloud:**
- Free: 5,000 executions (usually enough)
- Paid: $20/month for 25,000 executions

**OpenAI API:**
- 100 conversations: ~$1-2/month
- 500 conversations: ~$5-10/month
- 1,000 conversations: ~$10-20/month

**Total (Moderate Usage):**
- Free tier: $5-10/month (OpenAI only)
- With N8N paid: $25-30/month

### Cost Optimization:

1. **Use GPT-3.5-turbo** instead of GPT-4 (5x cheaper)
2. **Limit response length** (max_tokens: 150)
3. **Cache frequent questions**
4. **Self-host N8N** (free)

---

## 🎉 You're Done!

Your portfolio now has:
- ✅ AI-powered chatbot
- ✅ Intelligent responses about your background
- ✅ Conversation history tracking
- ✅ Real-time chat interface
- ✅ Professional appearance

### Next Steps:

1. **Test thoroughly** with various questions
2. **Monitor conversations** in database
3. **Adjust AI personality** if needed
4. **Track costs** in OpenAI dashboard
5. **Share your portfolio!**

---

## 📚 Additional Resources

- **N8N Documentation:** [https://docs.n8n.io/](https://docs.n8n.io/)
- **OpenAI API Docs:** [https://platform.openai.com/docs](https://platform.openai.com/docs)
- **OpenAI Pricing:** [https://openai.com/pricing](https://openai.com/pricing)
- **N8N Community:** [https://community.n8n.io/](https://community.n8n.io/)

---

**Made with ❤️ - Your portfolio just got smarter!** 🤖✨

**Questions?** Check the main documentation or create a GitHub issue.
