# 🚀 Getting Started - Build Your Own Portfolio

Welcome! This guide will help you create your own professional portfolio website with AI chatbot, complete with admin dashboard and hosting.

**⭐ What You'll Get:**
- Beautiful, modern portfolio website
- Admin dashboard to manage everything (no coding needed!)
- AI-powered chatbot (optional)
- Contact form with email notifications
- Project gallery with image uploads
- Fully responsive design
- Production-ready deployment

---

## 📋 Table of Contents

1. [Quick Overview](#quick-overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Fork & Clone](#step-1-fork--clone)
4. [Step 2: Database Setup](#step-2-database-setup)
5. [Step 3: AWS S3 Setup](#step-3-aws-s3-setup)
6. [Step 4: Local Development](#step-4-local-development)
7. [Step 5: Hosting Options](#step-5-hosting-options)
8. [Step 6: N8N Chatbot Setup (Optional)](#step-6-n8n-chatbot-setup-optional)
9. [Step 7: Domain & SSL](#step-7-domain--ssl)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Overview

### What is this?

A complete portfolio system built with Next.js that includes:
- **Public Portfolio** - Showcase your work, skills, and experience
- **Admin Panel** - Manage content without touching code
- **AI Chatbot** - GPT-4 powered assistant (optional)
- **Contact Form** - Receive messages via email
- **Database** - PostgreSQL for data storage
- **File Storage** - AWS S3 for images and PDFs

### How long does setup take?

- **Minimum Setup (No Chatbot)**: 30-45 minutes
- **Full Setup (With Chatbot)**: 1-2 hours
- **First-time users**: Add 30 minutes for account creation

---

## ✅ Prerequisites

### Required Accounts (All have free tiers):

1. **GitHub Account** - To fork the repository
   - [Sign up free](https://github.com/join)

2. **AWS Account** - For database (RDS) and file storage (S3)
   - [Sign up free](https://aws.amazon.com/free/)
   - Free tier: 12 months free
   - What you'll use: RDS PostgreSQL, S3 storage

3. **Gmail Account** - For contact form emails
   - [Create Gmail](https://accounts.google.com/signup)
   - You'll need to generate an "App Password"

4. **Hosting Account** - Choose one:
   - **Vercel** (Easiest, free tier) - [Sign up](https://vercel.com/signup)
   - **AWS EC2** (More control) - Same AWS account
   - **DigitalOcean** (Simple) - [Sign up](https://www.digitalocean.com/)
   - **Railway** (Simple) - [Sign up](https://railway.app/)

### Optional (for AI chatbot):

5. **N8N Account** - Workflow automation for chatbot
   - [N8N Cloud](https://n8n.io/cloud/) - Free tier available
   - OR self-host N8N (advanced)

6. **OpenAI Account** - For GPT-4 chatbot
   - [Sign up](https://platform.openai.com/signup)
   - ~$5-10/month for moderate usage

### On Your Computer:

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/downloads)
- **Code editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

---

## 🍴 Step 1: Fork & Clone

### 1.1 Fork the Repository

1. Go to: `https://github.com/YOUR_REPO/Portfolio`
2. Click the **Fork** button (top right)
3. This creates your own copy

### 1.2 Clone to Your Computer

```bash
# Replace YOUR_USERNAME with your GitHub username
git clone https://github.com/YOUR_USERNAME/Portfolio.git

# Navigate to the project
cd Portfolio

# Install dependencies
npm install
```

**Expected output:** Dependencies installed successfully

---

## 🗄️ Step 2: Database Setup

You need a PostgreSQL database. Choose one option:

### Option A: AWS RDS (Recommended - Free Tier)

#### Create Database:

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Search for "RDS" → Click "Create database"
3. **Settings:**
   ```
   Engine: PostgreSQL 15.x
   Templates: Free tier
   DB Instance: portfolio-db
   Master username: postgres
   Master password: [Create strong password]

   DB Instance Class: db.t3.micro (free tier)
   Storage: 20 GB

   ⚠️ IMPORTANT:
   Public Access: YES
   VPC Security Group: Create new → "portfolio-sg"
   Database name: portfolio
   ```

4. Click **Create database** (takes 5-10 minutes)

#### Configure Access:

1. Go to RDS → Databases → portfolio-db
2. Click the **VPC security group**
3. Click **Edit inbound rules** → **Add rule**
4. **Settings:**
   ```
   Type: PostgreSQL
   Port: 5432
   Source: Anywhere-IPv4 (0.0.0.0/0)
   Description: Portfolio access
   ```
5. Click **Save rules**

#### Get Connection String:

1. Go back to RDS → portfolio-db
2. Copy the **Endpoint** (looks like: `portfolio-db.xxxxx.us-east-1.rds.amazonaws.com`)
3. Your connection string:
   ```
   postgresql://postgres:YOUR_PASSWORD@portfolio-db.xxxxx.us-east-1.rds.amazonaws.com:5432/portfolio
   ```

### Option B: Other Providers

**Neon (Easiest):**
1. Go to [Neon](https://neon.tech/)
2. Sign up → Create project
3. Copy connection string

**Supabase:**
1. Go to [Supabase](https://supabase.com/)
2. Create project
3. Go to Settings → Database → Copy connection string

**Railway:**
1. Go to [Railway](https://railway.app/)
2. New project → Add PostgreSQL
3. Copy connection string

---

## 📦 Step 3: AWS S3 Setup

S3 stores your uploaded images and PDF files.

### 3.1 Create IAM User

1. Go to AWS Console → **IAM**
2. Click **Users** → **Add user**
3. **Settings:**
   ```
   Username: portfolio-s3-user
   Access type: ✅ Programmatic access
   ```
4. Click **Next**
5. **Permissions:** Attach existing policy → Select `AmazonS3FullAccess`
6. Click through → **Create user**
7. **⚠️ IMPORTANT:** Download the CSV file with:
   - Access Key ID
   - Secret Access Key
   - Save this securely!

### 3.2 Create S3 Bucket

1. Go to AWS Console → **S3**
2. Click **Create bucket**
3. **Settings:**
   ```
   Bucket name: portfolio-[your-name]-[random-number]
   Example: portfolio-john-doe-8472

   Region: us-east-1 (or your preferred region)

   ⚠️ Block Public Access: UNCHECK ALL BOXES
   ✅ Acknowledge: "I understand this bucket will be public"
   ```
4. Click **Create bucket**

### 3.3 Configure Bucket Policy

1. Go to your bucket → **Permissions** tab
2. Scroll to **Bucket policy** → Click **Edit**
3. Paste this (replace `YOUR-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

4. Click **Save changes**

### 3.4 Configure CORS

1. Still in **Permissions** → **Cross-origin resource sharing (CORS)**
2. Click **Edit** → Paste this:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. Click **Save changes**

---

## 💻 Step 4: Local Development

### 4.1 Create Environment File

Create a file called `.env.local` in the project root:

```bash
# In the Portfolio directory
nano .env.local
```

Paste this template (fill in your values):

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@your-rds-endpoint:5432/portfolio

# ============================================
# AWS S3 (For Image Uploads)
# ============================================
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_FROM_IAM
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY_FROM_IAM
S3_BUCKET=portfolio-yourname-8472
S3_PUBLIC_BASE_URL=https://portfolio-yourname-8472.s3.us-east-1.amazonaws.com

# ============================================
# GMAIL (For Contact Form) - Configure later in admin panel
# ============================================
# Leave blank for now, configure in /admin/settings after setup
GMAIL_USER=
GMAIL_APP_PASSWORD=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=

# ============================================
# ENCRYPTION KEY (Generate random 32-character string)
# ============================================
ENCRYPTION_KEY=your-random-32-character-key-here

# ============================================
# ADMIN PASSWORD (Optional - set via setup wizard)
# ============================================
# ADMIN_PASSWORD=your_secure_password
```

**To generate a random encryption key:**
```bash
# On Mac/Linux
openssl rand -base64 24

# On Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 4.2 Run Database Migrations

```bash
# Run these in order
node migrate-contact-page.js
node migrate-add-footer-fields.js
node migrate-setup-wizard.js
node migrate-email-settings.js
node migrate-add-pdf-order.js
```

**Expected output:** "✅ Migration completed successfully" for each

### 4.3 Start Development Server

```bash
# Build the project
npm run build

# Start the server
npm run dev
```

**Expected output:**
```
✓ Ready in 2.3s
○ Local:        http://localhost:3000
```

### 4.4 Complete Setup Wizard

1. Open browser: `http://localhost:3000/admin/login`
2. You'll be redirected to Setup Wizard
3. Complete 5 steps:
   - 🔐 Create admin password
   - 👤 Enter your personal info
   - 📞 Add contact details
   - 🎨 Set brand colors
   - 🎉 Done!

### 4.5 Test Your Portfolio

1. Visit `http://localhost:3000` - See your portfolio
2. Visit `http://localhost:3000/admin` - Access admin panel
3. Try uploading a project with an image

**✅ If everything works locally, you're ready to deploy!**

---

## 🌐 Step 5: Hosting Options

Choose one hosting method:

### Option A: Vercel (Recommended for Beginners) ⭐

**Pros:** Free, automatic deployments, easy SSL
**Cons:** Limited backend features

#### Deploy Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click your project → **Settings** → **Environment Variables**
   - Add each variable from your `.env.local`
   - Click **Redeploy**

5. **Done!** Your site is live at: `https://your-project.vercel.app`

---

### Option B: AWS EC2 (Full Control)

**Pros:** Full control, can run PM2, better for chatbot
**Cons:** More complex, need to manage server

#### Launch EC2 Instance:

1. Go to AWS Console → **EC2** → **Launch Instance**
2. **Settings:**
   ```
   Name: portfolio-server
   AMI: Ubuntu Server 22.04 LTS
   Instance type: t2.micro (free tier)

   Key pair: Create new → Download .pem file

   Security group: Create new:
   - SSH (22) - My IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (3000) - Anywhere
   ```

3. Click **Launch instance**

#### Connect & Setup:

```bash
# Make key file private
chmod 400 your-key.pem

# Connect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Clone your repository
git clone https://github.com/YOUR_USERNAME/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Create .env.local (copy from your local file)
nano .env.local
# Paste your environment variables

# Run migrations
node migrate-contact-page.js
node migrate-add-footer-fields.js
node migrate-setup-wizard.js
node migrate-email-settings.js

# Build
npm run build

# Start with PM2
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
# Run the command it outputs

# Configure Nginx
sudo nano /etc/nginx/sites-available/portfolio
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name YOUR_EC2_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Done! Visit: http://YOUR_EC2_IP
```

---

### Option C: Railway (Easiest Deployment)

**Pros:** Very simple, good free tier, automatic SSL
**Cons:** Limited free tier

1. Go to [Railway](https://railway.app/)
2. **New Project** → **Deploy from GitHub repo**
3. Connect your GitHub → Select Portfolio repo
4. **Add PostgreSQL database** (optional if using external)
5. **Add environment variables**:
   - Click project → **Variables**
   - Add all from `.env.local`
6. **Deploy** - Railway auto-deploys!
7. **Get domain**: Settings → Generate domain

---

### Option D: DigitalOcean App Platform

1. Go to [DigitalOcean](https://cloud.digitalocean.com/apps)
2. **Create** → **Apps** → **GitHub**
3. Select Portfolio repository
4. **Settings:**
   ```
   Name: portfolio
   Branch: main
   Build Command: npm run build
   Run Command: npm start
   ```
5. Add environment variables
6. **Deploy**

---

## 🤖 Step 6: N8N Chatbot Setup (Optional)

This adds an AI-powered chatbot to your portfolio.

**See detailed guide:** [N8N_CHATBOT_SETUP.md](./N8N_CHATBOT_SETUP.md)

### Quick Overview:

1. **Sign up for N8N Cloud:** [https://n8n.io/cloud/](https://n8n.io/cloud/)
2. **Get OpenAI API key:** [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. **Import workflow** (coming in detailed guide)
4. **Configure** database and API keys
5. **Activate** workflow
6. **Test** chatbot on your site

---

## 🌍 Step 7: Domain & SSL

### Get a Domain (Optional but Recommended)

**Domain Registrars:**
- [Namecheap](https://www.namecheap.com/) - ~$10/year
- [Google Domains](https://domains.google/) - ~$12/year
- [Cloudflare](https://www.cloudflare.com/products/registrar/) - At cost pricing
- [Porkbun](https://porkbun.com/) - Cheap

### Point Domain to Your Site

#### For Vercel:
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Follow DNS instructions

#### For EC2:
1. Your domain registrar → DNS settings
2. Add A record:
   ```
   Type: A
   Name: @
   Value: YOUR_EC2_IP
   TTL: 300
   ```
3. Add www record:
   ```
   Type: A
   Name: www
   Value: YOUR_EC2_IP
   TTL: 300
   ```

### Install SSL Certificate (EC2 only)

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts - choose redirect HTTP to HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

**Done!** Your site now has HTTPS: `https://yourdomain.com`

---

## 🎨 Customize Your Portfolio

### Admin Panel: `/admin`

Everything can be customized through the admin panel (no coding!):

1. **Homepage** (`/admin/homepage`)
   - Hero section: Name, tagline, stats
   - Work experience timeline
   - Skills categories

2. **Projects** (`/admin/projects`)
   - Add portfolio projects
   - Upload images & PDFs
   - Reorder with drag-and-drop

3. **Contact** (`/admin/contact`)
   - Update email, phone, location
   - Social links (LinkedIn, GitHub, Twitter)
   - Footer content

4. **Profile** (`/admin/profile`)
   - Personal information
   - Bio and about section
   - Profile image & resume

5. **Settings** (`/admin/settings`)
   - **Account:** Change password, session timeout
   - **Email:** Configure Gmail SMTP for contact form
   - **Site:** Title, description, analytics
   - **Appearance:** Brand colors, logo, favicon
   - **SEO:** Meta tags, Open Graph images
   - **Backup:** Export/import your data

### Recommended Customization Order:

1. ✅ Change admin password (Settings → Account)
2. ✅ Update profile information (Profile)
3. ✅ Customize hero section (Homepage → Hero)
4. ✅ Add work experience (Homepage → Experience)
5. ✅ Add skills (Homepage → Skills)
6. ✅ Upload 3-5 projects (Projects)
7. ✅ Update contact info (Contact)
8. ✅ Set brand colors (Settings → Appearance)
9. ✅ Configure email settings (Settings → Email)
10. ✅ Test contact form

---

## 📧 Email Configuration

### Setup Gmail SMTP:

1. **Generate App Password:**
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select: Mail → Other → "Portfolio"
   - Copy 16-character password

2. **Configure in Admin Panel:**
   - Go to `/admin/settings` → **Email** tab
   - **Email Provider:** Gmail
   - **SMTP Host:** smtp.gmail.com
   - **SMTP Port:** 587
   - **SMTP User:** your-email@gmail.com
   - **SMTP Password:** [Paste app password]
   - **From Email:** your-email@gmail.com
   - **To Email:** where-to-receive@email.com
   - ✅ Enable Email Notifications
   - Click **Save Settings**

3. **Test:**
   - Go to your portfolio contact form
   - Send a test message
   - Check your email inbox

---

## 🐛 Troubleshooting

### Database Connection Failed

**Error:** `connect ETIMEDOUT` or `Connection refused`

**Solutions:**
1. Check DATABASE_URL is correct
2. Verify RDS security group allows port 5432
3. Ensure database is running (AWS Console → RDS)
4. Test connection:
   ```bash
   psql "postgresql://user:pass@host:5432/portfolio"
   ```

### S3 Images Not Loading

**Error:** `Access Denied` or `403 Forbidden`

**Solutions:**
1. Check bucket policy allows public read
2. Verify S3_PUBLIC_BASE_URL matches bucket name
3. Test URL in browser: `https://your-bucket.s3.amazonaws.com/test.jpg`
4. Check CORS configuration

### Build Errors

**Error:** `Module not found` or `Cannot find module`

**Solutions:**
```bash
# Clear everything and reinstall
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Email Not Sending

**Error:** `Failed to send email notification`

**Solutions:**
1. Verify Gmail App Password (not regular password)
2. Check Settings → Email → "Enable Email Notifications"
3. Test SMTP settings: Port 587, Host smtp.gmail.com
4. Check Gmail "Allow less secure apps" if needed

### Setup Wizard Not Showing

**Solutions:**
1. Clear browser cache and cookies
2. Check database has `setup_status` table
3. Test API: Visit `/api/setup` - should show JSON
4. Re-run migration: `node migrate-setup-wizard.js`

### PM2 App Crashed (EC2)

**Solutions:**
```bash
# View logs
pm2 logs portfolio

# Restart
pm2 restart portfolio

# Check status
pm2 status

# If still failing, rebuild
cd Portfolio
git pull
npm install
npm run build
pm2 restart portfolio
```

---

## 📊 Monitoring & Maintenance

### Regular Tasks:

**Weekly:**
- Export database backup: `/admin/settings` → Backup tab
- Check for messages: `/admin/messages`
- Review chatbot conversations (if enabled)

**Monthly:**
- Update dependencies: `npm update`
- Redeploy with updates
- Check AWS billing (should be $0-5/month)
- Review analytics

**When Needed:**
- Update content via admin panel
- Add new projects
- Respond to contact form messages

### View Logs:

**Vercel:**
- Dashboard → Project → Deployments → Click deployment → Logs

**EC2:**
```bash
# Application logs
pm2 logs portfolio

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Update Application:

```bash
# On EC2
cd Portfolio
git pull
npm install
npm run build
pm2 restart portfolio

# On Vercel
# Just push to GitHub - auto deploys
git push origin main
```

---

## 💰 Cost Estimate

### Minimum Setup (Free Tier):
- **AWS RDS:** $0 (12 months free)
- **AWS S3:** $0.01-0.50/month
- **Vercel Hosting:** $0
- **Domain:** $10-15/year
- **Total:** ~$1/month + domain

### With AI Chatbot:
- **N8N Cloud:** $0-20/month
- **OpenAI API:** $5-10/month
- **Total:** ~$15-30/month + domain

### After Free Tier (12 months):
- **AWS RDS:** $15-25/month
- **AWS S3:** $0.50-2/month
- **Consider:** Neon or Supabase (free tier forever)

---

## 🎯 Next Steps

### Immediate:
1. ✅ Complete local setup
2. ✅ Deploy to hosting
3. ✅ Customize via admin panel
4. ✅ Add your projects and content

### Within a Week:
1. ✅ Set up custom domain
2. ✅ Configure SSL
3. ✅ Test all features thoroughly
4. ✅ Share on LinkedIn/social media

### Optional Enhancements:
1. Set up N8N chatbot
2. Add Google Analytics
3. Configure custom email domain
4. Add more projects regularly
5. Set up regular backups

---

## 🆘 Need Help?

### Check These Resources:
1. **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
2. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide
3. **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** - Customization options
4. **[N8N_CHATBOT_SETUP.md](./N8N_CHATBOT_SETUP.md)** - Chatbot configuration

### Common Issues:
- Review error messages carefully
- Check all environment variables
- Verify database connection
- Test each component individually
- Check AWS service quotas

### Still Stuck?
1. Check GitHub Issues
2. Review documentation again
3. Search error messages online
4. Verify all prerequisites are met
5. Start with local setup first

---

## ⭐ Success Checklist

Before considering your portfolio "done":

- [ ] Local development works perfectly
- [ ] Deployed to hosting successfully
- [ ] Custom domain configured (optional)
- [ ] SSL certificate installed
- [ ] Admin login works
- [ ] Profile fully customized
- [ ] At least 3-5 projects added
- [ ] Contact form tested and working
- [ ] Email notifications working
- [ ] All images loading correctly
- [ ] Mobile responsive checked
- [ ] Browser testing complete (Chrome, Safari, Firefox)
- [ ] SEO metadata set
- [ ] Google Analytics added (optional)
- [ ] Regular backups configured
- [ ] Chatbot working (if setup)

---

## 🎉 Congratulations!

You now have a professional portfolio website with:
- ✅ Beautiful, modern design
- ✅ Admin dashboard for easy updates
- ✅ Contact form with email notifications
- ✅ Project gallery with file uploads
- ✅ Fully responsive on all devices
- ✅ SEO optimized
- ✅ Production-ready hosting
- ✅ Optional AI chatbot

**Share your portfolio:**
- Add to LinkedIn profile
- Include in resume
- Share on social media
- Use in job applications

---

**Made with ❤️ - Now go build something amazing!** 🚀

**Questions?** Check the other guide files or create a GitHub issue.
