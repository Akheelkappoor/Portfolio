# 🚀 Complete Deployment Guide

This guide will walk you through deploying your portfolio to production, including AWS setup, database configuration, and domain management.

---

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [AWS Account Setup](#aws-account-setup)
3. [PostgreSQL Database (AWS RDS)](#postgresql-database-aws-rds)
4. [S3 Bucket for Image Storage](#s3-bucket-for-image-storage)
5. [Server Deployment Options](#server-deployment-options)
6. [Environment Variables](#environment-variables)
7. [Domain & SSL Setup](#domain--ssl-setup)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 **Prerequisites**

Before you begin, make sure you have:

- AWS Account (free tier is sufficient to start)
- Domain name (optional, but recommended)
- Gmail account for email notifications
- Basic command line knowledge

---

## 🔧 **AWS Account Setup**

### **Step 1: Create AWS Account**

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow the registration process
4. Verify your email and add payment method (free tier available)

### **Step 2: Create IAM User**

1. Go to AWS Console → IAM
2. Click "Users" → "Add User"
3. Username: `portfolio-admin`
4. Access type: Check both "Programmatic access" and "AWS Management Console access"
5. Attach policies:
   - `AmazonS3FullAccess`
   - `AmazonRDSFullAccess`
6. Download credentials (Access Key ID and Secret Access Key)
7. **IMPORTANT:** Save these credentials securely - you'll need them!

---

## 🗄️ **PostgreSQL Database (AWS RDS)**

### **Step 1: Create RDS Instance**

1. Go to AWS Console → RDS
2. Click "Create database"
3. **Configuration:**
   ```
   Engine: PostgreSQL
   Version: PostgreSQL 15.x or later
   Templates: Free tier
   DB Instance Identifier: portfolio-db
   Master username: postgres
   Master password: [Create a strong password]
   DB Instance Class: db.t3.micro (free tier)
   Storage: 20 GB SSD
   Public Access: YES (important!)
   VPC Security Group: Create new
   Database name: portfolio
   ```

4. Click "Create database"
5. Wait 5-10 minutes for creation

### **Step 2: Configure Security Group**

1. Go to RDS → Databases → portfolio-db
2. Click on the VPC security group
3. Click "Edit inbound rules"
4. Add rule:
   ```
   Type: PostgreSQL
   Port: 5432
   Source: Anywhere-IPv4 (0.0.0.0/0)
   ```
   ⚠️ **Production Note:** For production, restrict to your server's IP only!

5. Save rules

### **Step 3: Get Connection String**

1. Go to RDS → Databases → portfolio-db
2. Copy the "Endpoint" (looks like: `portfolio-db.xxxxx.region.rds.amazonaws.com`)
3. Your connection string will be:
   ```
   postgresql://postgres:YOUR_PASSWORD@portfolio-db.xxxxx.region.rds.amazonaws.com:5432/portfolio
   ```

### **Step 4: Test Connection**

```bash
# Install PostgreSQL client (if not installed)
sudo apt-get install postgresql-client

# Test connection
psql "postgresql://postgres:YOUR_PASSWORD@YOUR_ENDPOINT:5432/portfolio"
```

If connected successfully, you'll see `portfolio=>` prompt. Type `\q` to exit.

---

## 📦 **S3 Bucket for Image Storage**

### **Step 1: Create S3 Bucket**

1. Go to AWS Console → S3
2. Click "Create bucket"
3. **Configuration:**
   ```
   Bucket name: my-portfolio-images-[your-name]
   Region: us-east-1 (or your preferred region)
   Block all public access: UNCHECK this box
   Acknowledge public access warning
   ```

4. Click "Create bucket"

### **Step 2: Configure Bucket Policy**

1. Go to your bucket → Permissions tab
2. Scroll to "Bucket policy"
3. Click "Edit" and paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-portfolio-images-[your-name]/*"
    }
  ]
}
```

4. Replace `my-portfolio-images-[your-name]` with your actual bucket name
5. Click "Save changes"

### **Step 3: Configure CORS**

1. Go to Permissions tab → Cross-origin resource sharing (CORS)
2. Click "Edit" and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. Click "Save changes"

### **Step 4: Get S3 Credentials**

Your S3 configuration will be:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_from_iam_user
AWS_SECRET_ACCESS_KEY=your_secret_key_from_iam_user
S3_BUCKET=my-portfolio-images-[your-name]
S3_PUBLIC_BASE_URL=https://my-portfolio-images-[your-name].s3.amazonaws.com
```

---

## 🌐 **Server Deployment Options**

### **Option 1: AWS EC2 (Recommended for Full Control)**

#### **Step 1: Launch EC2 Instance**

1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. **Configuration:**
   ```
   Name: portfolio-server
   AMI: Ubuntu Server 22.04 LTS
   Instance type: t2.micro (free tier)
   Key pair: Create new key pair (download .pem file)
   Security group: Create with these rules:
     - SSH (22) - Your IP
     - HTTP (80) - Anywhere
     - HTTPS (443) - Anywhere
     - Custom TCP (3000) - Anywhere (for testing)
   Storage: 8 GB
   ```

4. Click "Launch instance"

#### **Step 2: Connect to EC2**

```bash
# Make key file read-only
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

#### **Step 3: Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

#### **Step 4: Clone & Setup Project**

```bash
# Clone your repository
git clone https://github.com/your-username/your-portfolio.git
cd your-portfolio

# Install dependencies
npm install

# Create .env.local file
nano .env.local
```

Paste your environment variables (see [Environment Variables](#environment-variables) section).

```bash
# Run migrations
node migrate-contact-page.js
node migrate-add-footer-fields.js
node migrate-setup-wizard.js
node migrate-email-settings.js

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
```

#### **Step 5: Configure Nginx**

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

### **Option 2: Vercel (Easiest)**

#### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

#### **Step 2: Deploy**

```bash
vercel --prod
```

#### **Step 3: Add Environment Variables**

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add all variables from `.env.local`
4. Redeploy

⚠️ **Note:** Vercel doesn't support long-running processes, so PM2 features won't work.

---

### **Option 3: DigitalOcean App Platform**

1. Go to DigitalOcean → Create → Apps
2. Connect your GitHub repository
3. Configure:
   ```
   Name: portfolio
   Environment: Node.js
   Build Command: npm run build
   Run Command: npm start
   ```

4. Add environment variables in Settings
5. Deploy

---

### **Option 4: Heroku**

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create my-portfolio-app

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set DATABASE_URL="your_postgres_url"
heroku config:set AWS_REGION="us-east-1"
# ... (add all other variables)

# Deploy
git push heroku main
```

---

## 🔑 **Environment Variables**

Create a `.env.local` file with these variables:

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL=postgresql://postgres:password@your-rds-endpoint:5432/portfolio

# ============================================
# AWS S3 (Image Storage)
# ============================================
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=my-portfolio-images-yourname
S3_PUBLIC_BASE_URL=https://my-portfolio-images-yourname.s3.amazonaws.com

# ============================================
# EMAIL (Gmail SMTP) - OPTIONAL
# ============================================
# Method 1: Environment Variables (Legacy)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
CONTACT_TO_EMAIL=where@to-receive.com
CONTACT_FROM_EMAIL=your@gmail.com

# Method 2: Admin Panel (Recommended)
# Configure in /admin/settings → Email tab after deployment

# ============================================
# ADMIN PASSWORD (Optional - for existing setups)
# ============================================
ADMIN_PASSWORD=your_secure_password

# ============================================
# ENCRYPTION (for email passwords in database)
# ============================================
ENCRYPTION_KEY=your-32-character-secret-key-12

# ============================================
# OPTIONAL
# ============================================
NODE_ENV=production
```

### **Getting Gmail App Password**

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Sign in to your Gmail account
3. Select app: "Mail"
4. Select device: "Other" (type "Portfolio")
5. Click "Generate"
6. Copy the 16-character password (no spaces)
7. Use this in `GMAIL_APP_PASSWORD`

---

## 🌍 **Domain & SSL Setup**

### **Step 1: Point Domain to Server**

#### **For EC2:**

1. Go to your domain registrar (Namecheap, GoDaddy, etc.)
2. Add DNS records:
   ```
   Type: A
   Name: @
   Value: YOUR_EC2_PUBLIC_IP
   TTL: 300

   Type: A
   Name: www
   Value: YOUR_EC2_PUBLIC_IP
   TTL: 300
   ```

#### **For Vercel:**

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add"
3. Enter your domain
4. Follow DNS configuration instructions

### **Step 2: Install SSL Certificate (EC2 Only)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (recommended)

# Auto-renewal (already configured by Certbot)
sudo certbot renew --dry-run
```

Your site will now be available at `https://your-domain.com`!

---

## 🔥 **Quick Deployment Checklist**

### **Database:**
- ✅ Created RDS PostgreSQL instance
- ✅ Configured security group (port 5432 open)
- ✅ Got connection string
- ✅ Tested connection

### **S3:**
- ✅ Created S3 bucket
- ✅ Configured bucket policy (public read)
- ✅ Configured CORS
- ✅ Got AWS credentials

### **Server:**
- ✅ Launched EC2 / Deployed to Vercel
- ✅ Installed Node.js & dependencies
- ✅ Created `.env.local` file
- ✅ Ran migrations
- ✅ Built project (`npm run build`)
- ✅ Started application

### **Domain:**
- ✅ Pointed domain to server
- ✅ Configured Nginx (if EC2)
- ✅ Installed SSL certificate

---

## 🛠️ **Troubleshooting**

### **Database Connection Failed**

```
Error: connect ETIMEDOUT
```

**Solutions:**
1. Check RDS security group allows port 5432
2. Verify endpoint URL is correct
3. Check username/password
4. Ensure RDS instance is running (AWS Console)

### **S3 Images Not Loading**

```
Access Denied
```

**Solutions:**
1. Check bucket policy allows public read
2. Verify `S3_PUBLIC_BASE_URL` in `.env.local`
3. Check bucket CORS configuration
4. Ensure files were uploaded successfully

### **Email Not Sending**

```
Failed to send email notification
```

**Solutions:**
1. Configure email in `/admin/settings` → Email tab
2. Verify Gmail App Password (not regular password)
3. Check "Enable Email Notifications" is checked
4. Test with your own email first

### **Build Errors**

```
Module not found
```

**Solutions:**
```bash
# Clear build cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### **PM2 Process Crashed**

```bash
# View logs
pm2 logs portfolio

# Restart
pm2 restart portfolio

# Check status
pm2 status
```

### **Nginx 502 Bad Gateway**

**Solutions:**
```bash
# Check if Next.js is running
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📊 **Monitoring & Maintenance**

### **View Server Logs**

```bash
# PM2 logs
pm2 logs portfolio

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### **Update Application**

```bash
cd /home/ubuntu/Portfolio
git pull
npm install
npm run build
pm2 restart portfolio
```

### **Backup Database**

```bash
# Export data
node export-my-data.js

# Download to local machine
scp -i your-key.pem ubuntu@YOUR_IP:/home/ubuntu/Portfolio/my-portfolio-data.json ./
```

### **Monitor Resources**

```bash
# CPU & Memory usage
htop

# Disk usage
df -h

# PM2 monitoring
pm2 monit
```

---

## 🎉 **You're Live!**

Your portfolio is now deployed and accessible to the world!

### **Next Steps:**

1. **Test Everything:**
   - Contact form
   - Image uploads
   - Admin panel
   - All pages

2. **Set Up Analytics:**
   - Add Google Analytics ID in `/admin/settings`

3. **Share Your Work:**
   - Add URL to LinkedIn
   - Share on social media
   - Update resume

4. **Regular Backups:**
   - Export data weekly: `node export-my-data.js`
   - Keep backups safe

---

## 🆘 **Need Help?**

1. Check this guide again
2. Review error logs
3. Test each component individually
4. Verify environment variables
5. Check AWS service status

---

## 📚 **Useful Commands**

```bash
# Server Management
pm2 status                    # Check running processes
pm2 restart portfolio         # Restart app
pm2 logs portfolio           # View logs
pm2 stop portfolio           # Stop app

# Database
psql $DATABASE_URL           # Connect to database
node check-setup-status.js   # Check setup status

# Build
npm run build                # Build for production
npm start                    # Start production server

# Nginx
sudo nginx -t                # Test config
sudo systemctl restart nginx # Restart Nginx
sudo systemctl status nginx  # Check status
```

---

**Made with ❤️ - Your portfolio is ready to impress!** 🚀
