# 🚀 AWS EC2 Deployment Guide - Portfolio Website

## 📋 Pre-Deployment Checklist

### ✅ Before You Push to GitHub:

1. **Security Check:**
   - [ ] .env file is NOT in the repository (it's gitignored)
   - [ ] No hardcoded passwords in code
   - [ ] .pem files are gitignored
   - [ ] AWS keys are in environment variables only

2. **Code Quality:**
   - [ ] All errors fixed (Settings page, Experience section)
   - [ ] Run `npm run build` locally successfully
   - [ ] Test all features work
   - [ ] Database connection tested

3. **Environment Variables:**
   - [ ] .env.example created with template
   - [ ] Production DATABASE_URL ready
   - [ ] All AWS credentials documented

---

## 🖥️ EC2 Instance Details

```
Public IP: 3.28.158.167
Instance Type: t2.micro / t2.small (recommended)
OS: Ubuntu 22.04 LTS
Region: me-central-1 (Middle East - UAE)
```

---

## 📦 Step 1: Prepare for Deployment

### On Your Local Machine:

1. **Build the Project:**
   ```bash
   cd /Users/akheelkappoor/Downloads/portfolio
   npm run build
   ```

2. **Test Production Build Locally:**
   ```bash
   npm start
   # Visit http://localhost:3000
   # Test all features
   ```

3. **Push to GitHub:**
   ```bash
   git status
   git add .
   git commit -m "Production ready - Portfolio website with AI chatbot"
   git push origin main
   ```

---

## 🔐 Step 2: Connect to EC2

### SSH into EC2:

```bash
# Make sure you have the PEM file
chmod 400 /Users/akheelkappoor/Downloads/AP.pem

# Connect to EC2
ssh -i /Users/akheelkappoor/Downloads/AP.pem ubuntu@3.28.158.167
```

---

## ⚙️ Step 3: Setup EC2 Environment

### Install Node.js 20.x:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Install PM2 (Process Manager):

```bash
sudo npm install -g pm2
pm2 --version
```

### Install Git:

```bash
sudo apt install -y git
git --version
```

---

## 📥 Step 4: Clone Your Repository

```bash
# Create projects directory
cd ~
mkdir -p projects
cd projects

# Clone from GitHub (replace with your repo URL)
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio

# Verify files
ls -la
```

---

## 🔑 Step 5: Configure Environment Variables

### Create .env file on EC2:

```bash
nano .env
```

**Paste this content (with your actual values):**

```env
# Admin Password
ADMIN_PASSWORD=Monkey@7798

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_1QEl1MUdarYEatAM_OWLfutxGNLeNrVKk5jOHtXPMdHiUH4

# Gmail SMTP
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password_here
CONTACT_FROM_EMAIL=your_gmail@gmail.com
CONTACT_TO_EMAIL=your_email@example.com

# AWS Configuration
AWS_REGION=me-central-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
S3_BUCKET=your_s3_bucket_name
S3_PUBLIC_BASE_URL=https://your_s3_bucket_name.s3.me-central-1.amazonaws.com/Portfolio/

# Database - PRODUCTION (Direct RDS Connection)
DATABASE_URL=postgres://username:password@your-rds-endpoint.region.rds.amazonaws.com:5432/dbname?sslmode=require

# Database Credentials
Master_username=your_db_username
password_forsql=your_db_password
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

**Secure the file:**
```bash
chmod 600 .env
```

---

## 📦 Step 6: Install Dependencies & Build

```bash
# Install all dependencies
npm install

# Build for production
npm run build
```

**Expected output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                    ...      ...
├ ○ /admin                               ...      ...
├ ○ /admin/login                         ...      ...
...
○  (Static)  prerendered as static content
```

---

## 🚀 Step 7: Start with PM2

### Start the Application:

```bash
# Start with PM2
pm2 start npm --name "portfolio" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it outputs (starts with 'sudo env...')

# Verify it's running
pm2 status
pm2 logs portfolio
```

**Expected output:**
```
┌─────┬─────────────┬─────────────┬──────┬────────┬──────────┬──────────┬──────────┐
│ id  │ name        │ mode        │ ↺    │ status │ cpu      │ memory   │
├─────┼─────────────┼─────────────┼──────┼────────┼──────────┼──────────┼──────────┤
│ 0   │ portfolio   │ fork        │ 0    │ online │ 0%       │ 120.0mb  │
└─────┴─────────────┴─────────────┴──────┴────────┴──────────┴──────────┴──────────┘
```

---

## 🌐 Step 8: Configure Nginx (Reverse Proxy)

### Install Nginx:

```bash
sudo apt install -y nginx
```

### Create Nginx Configuration:

```bash
sudo nano /etc/nginx/sites-available/portfolio
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    server_name 3.28.158.167;  # Use your domain or IP

    # Increase upload size for file uploads
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

### Enable the Site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx
```

---

## 🔒 Step 9: Configure Firewall

```bash
# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS (for future SSL)
sudo ufw allow 443/tcp

# Allow SSH (important!)
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## ✅ Step 10: Verify Deployment

### Test the Website:

1. **Open browser:** `http://3.28.158.167`
2. **Test pages:**
   - [ ] Homepage loads
   - [ ] Hero section displays
   - [ ] Projects section works
   - [ ] Skills section works
   - [ ] Experience section works
   - [ ] Contact form works
   - [ ] Chatbot widget appears
   - [ ] Admin login works (`/admin/login`)
   - [ ] Admin dashboard accessible
   - [ ] Settings page loads
   - [ ] All CRUD operations work

### Test Database Connection:

```bash
# SSH into EC2
ssh -i /Users/akheelkappoor/Downloads/AP.pem ubuntu@3.28.158.167

# Check PM2 logs
pm2 logs portfolio

# Should NOT see database connection errors
```

---

## 🔧 PM2 Management Commands

```bash
# View logs
pm2 logs portfolio

# Restart application
pm2 restart portfolio

# Reload (zero-downtime restart)
pm2 reload portfolio

# Stop application
pm2 stop portfolio

# Delete from PM2
pm2 delete portfolio

# Monitor in real-time
pm2 monit
```

---

## 🔄 Updating Your Deployment

### When you make changes:

```bash
# On EC2:
cd ~/projects/portfolio

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart portfolio

# OR reload for zero-downtime:
pm2 reload portfolio
```

---

## 🐛 Troubleshooting

### Issue: Website not loading

**Check PM2 status:**
```bash
pm2 status
pm2 logs portfolio --lines 50
```

**Check Nginx:**
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**Check if port 3000 is running:**
```bash
sudo lsof -i :3000
```

### Issue: Database connection failed

**Test RDS connectivity:**
```bash
nc -zv myporject.ct0cwgyai5d2.me-central-1.rds.amazonaws.com 5432
```

**Check security groups:**
- EC2 security group must allow outbound to port 5432
- RDS security group must allow inbound from EC2

### Issue: 502 Bad Gateway

**Restart both services:**
```bash
pm2 restart portfolio
sudo systemctl restart nginx
```

### Issue: Out of memory

**Check memory usage:**
```bash
free -h
pm2 monit
```

**Solution:** Upgrade EC2 instance to t2.small

---

## 📊 Monitoring

### Setup PM2 Monitoring (Optional):

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### View Application Metrics:

```bash
pm2 monit
```

---

## 🔐 Security Best Practices

1. **Enable SSL/HTTPS** (Let's Encrypt):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

2. **Regular Updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Database Security:**
   - RDS encryption enabled
   - SSL mode required in connection string
   - Restrict RDS security group to EC2 only

4. **Environment Variables:**
   - Never commit .env
   - Rotate credentials regularly
   - Use IAM roles instead of access keys (advanced)

---

## 📞 Support

**If deployment fails:**
1. Check PM2 logs: `pm2 logs portfolio`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables: `cat .env` (make sure DATABASE_URL is correct)
4. Test build locally first

**Database Issues:**
- Verify RDS endpoint is correct
- Check security groups allow EC2 → RDS on port 5432
- Test connection: `nc -zv <rds-endpoint> 5432`

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub
- [ ] EC2 instance running
- [ ] Node.js 20.x installed
- [ ] Repository cloned
- [ ] .env configured
- [ ] Dependencies installed
- [ ] Build successful
- [ ] PM2 running application
- [ ] Nginx configured and running
- [ ] Firewall configured
- [ ] Website accessible via IP
- [ ] Database connection working
- [ ] All features tested
- [ ] PM2 startup configured
- [ ] Logs monitored

**🎉 Deployment Complete!**

Your portfolio is now live at: `http://3.28.158.167`

Next steps:
1. Get a domain name
2. Point DNS to EC2 IP
3. Setup SSL certificate
4. Configure custom domain in Next.js
