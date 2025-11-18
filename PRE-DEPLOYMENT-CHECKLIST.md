# 🚀 Pre-Deployment Checklist

## ⚠️ CRITICAL - Before Pushing to GitHub

### 🔒 Security Check

- [x] **.env file is gitignored** (verify: `git status` should NOT show .env)
- [x] **No passwords in code** (all in environment variables)
- [x] **.pem files gitignored** (SSH keys never committed)
- [x] **.env.example created** (template for production)
- [x] **AWS credentials in env only** (not hardcoded)
- [ ] **Change default admin password** (currently: `Monkey@7798`)

### 🐛 Code Quality

- [x] **All errors fixed:**
  - [x] Settings page infinite loop → Fixed with useEffect
  - [x] Experience section map error → Fixed with Array.isArray check
  - [x] Deprecated onKeyPress → Changed to onKeyDown

- [ ] **Run local build:**
  ```bash
  npm run build
  ```
  Should complete without errors

- [ ] **Test production build locally:**
  ```bash
  npm start
  # Visit http://localhost:3000
  ```

### 🧪 Feature Testing

#### Public Pages:
- [ ] Homepage loads correctly
- [ ] Hero section displays (name, tagline, image)
- [ ] Experience section shows timeline
- [ ] Skills section renders properly
- [ ] Projects section displays cards
- [ ] Contact form sends emails
- [ ] Footer shows social links
- [ ] Chatbot widget appears and opens

#### Admin Panel:
- [ ] Login works (`/admin/login`)
- [ ] Dashboard shows stats
- [ ] Homepage editor loads data
- [ ] Profile editor saves changes
- [ ] Projects CRUD operations work
- [ ] Messages inbox displays
- [ ] Settings page loads without errors
- [ ] Color theming works (change primary/secondary colors)
- [ ] Export database downloads JSON

#### Chatbot:
- [ ] Widget button appears bottom-right
- [ ] Chat window opens/closes
- [ ] Messages send successfully
- [ ] N8N webhook receives requests (test manually if N8N setup)
- [ ] Typing indicator shows
- [ ] Conversation history maintains

### 🗄️ Database Check

- [ ] **All tables exist:**
  ```sql
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public';
  ```
  Should show: profile, hero_section, work_experience, skills_categories, skills_items, projects, messages, site_settings, chat_conversations

- [ ] **Settings table initialized:**
  ```sql
  SELECT * FROM site_settings;
  ```
  Should return 1 row with default values

- [ ] **Test data exists:**
  - At least 1 profile record
  - At least 1 hero_section record
  - Some projects (5 visible)
  - Skills categories and items

### 📦 Files Ready for Deployment

- [x] `.env.example` - Template created
- [x] `.gitignore` - Enhanced with security rules
- [x] `DEPLOYMENT-GUIDE.md` - Complete EC2 guide
- [x] `CHANGELOG.md` - All features documented
- [x] `N8N-CHATBOT-SETUP-GUIDE.md` - Chatbot configuration
- [x] `n8n-chatbot-workflow.json` - N8N workflow
- [x] `PRE-DEPLOYMENT-CHECKLIST.md` - This file

### 🌐 Environment Variables

Verify `.env` has all required variables:

```bash
# Check locally
cat .env | grep -v "^#" | grep -v "^$"
```

Required variables:
- [x] ADMIN_PASSWORD
- [x] DATABASE_URL
- [x] GMAIL_USER
- [x] GMAIL_APP_PASSWORD
- [x] AWS_ACCESS_KEY_ID
- [x] AWS_SECRET_ACCESS_KEY
- [x] S3_BUCKET
- [x] AWS_REGION

---

## 📤 Push to GitHub

### 1. Check Git Status

```bash
cd /Users/akheelkappoor/Downloads/portfolio

# What will be committed?
git status

# VERIFY: Should NOT see:
# - .env (should be gitignored)
# - *.pem files (should be gitignored)
# - node_modules (should be gitignored)
```

### 2. Review Changes

```bash
# See what changed
git diff

# Check which files are staged
git diff --cached
```

### 3. Add Files

```bash
# Add all changes
git add .

# OR selectively add:
git add components/
git add app/
git add lib/
git add sql/
git add .env.example
git add .gitignore
git add *.md
```

### 4. Commit

```bash
git commit -m "Production ready: Portfolio with AI chatbot, dynamic theming, full admin system"
```

### 5. Push

```bash
# Push to main branch
git push origin main

# OR if first time:
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

---

## 🖥️ EC2 Deployment Steps

### 1. Connect to EC2

```bash
chmod 400 /Users/akheelkappoor/Downloads/AP.pem
ssh -i /Users/akheelkappoor/Downloads/AP.pem ubuntu@3.28.158.167
```

### 2. Clone Repository

```bash
cd ~
mkdir -p projects
cd projects
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

### 3. Setup Environment

```bash
# Create .env file
nano .env
# Paste your production environment variables
# IMPORTANT: Use production DATABASE_URL (direct RDS connection)
# DATABASE_URL=postgres://myporject:XrebTfymkYVSh2zniGKy@myporject.ct0cwgyai5d2.me-central-1.rds.amazonaws.com:5432/portfolio?sslmode=require
```

### 4. Install & Build

```bash
npm install
npm run build
```

### 5. Start with PM2

```bash
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup  # Run the command it outputs
```

### 6. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/portfolio
# Copy configuration from DEPLOYMENT-GUIDE.md

sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Verify

Visit: `http://3.28.158.167`

---

## ✅ Post-Deployment Verification

### Test Public Site:
- [ ] Homepage loads
- [ ] All sections display correctly
- [ ] Images load from S3
- [ ] Contact form works
- [ ] Chatbot responds (if N8N configured)

### Test Admin:
- [ ] Can login at `/admin/login`
- [ ] Dashboard shows stats
- [ ] All CRUD operations work
- [ ] Settings page functional
- [ ] No console errors

### Test Database:
```bash
# On EC2, check PM2 logs
pm2 logs portfolio

# Should NOT see:
# - Database connection errors
# - Authentication failed
# - SSL errors
```

### Performance:
- [ ] Page load time < 3 seconds
- [ ] No memory leaks (check PM2 monit)
- [ ] Images optimized and loading
- [ ] No 404 errors

---

## 🚨 Common Issues & Solutions

### Issue: .env accidentally committed

```bash
# Remove from Git history
git rm --cached .env
git commit -m "Remove .env from repository"
git push origin main

# Rotate all secrets immediately!
```

### Issue: Build fails on EC2

```bash
# Check Node version
node --version  # Should be 20.x

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Issue: Database connection refused

```bash
# Check RDS security group allows EC2
# Verify DATABASE_URL is correct
# Test connection:
nc -zv myporject.ct0cwgyai5d2.me-central-1.rds.amazonaws.com 5432
```

### Issue: 502 Bad Gateway

```bash
# Restart services
pm2 restart portfolio
sudo systemctl restart nginx

# Check PM2 logs
pm2 logs portfolio
```

---

## 📊 Monitoring Setup

### After deployment:

1. **Setup PM2 monitoring:**
   ```bash
   pm2 monit
   ```

2. **Check logs regularly:**
   ```bash
   pm2 logs portfolio --lines 100
   ```

3. **Monitor resource usage:**
   ```bash
   free -h  # Memory
   df -h    # Disk
   top      # CPU
   ```

4. **Setup log rotation:**
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   ```

---

## 🔐 Security Hardening

### After initial deployment:

1. **Change admin password:**
   - Update in .env on EC2
   - Restart PM2

2. **Setup SSL/HTTPS:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Enable firewall:**
   ```bash
   sudo ufw allow 22,80,443/tcp
   sudo ufw enable
   ```

4. **Regular updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## ✅ Final Check

Before going live:
- [ ] All tests pass
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Backup plan ready
- [ ] Documentation complete
- [ ] Team notified (if applicable)

---

## 🎉 You're Ready to Deploy!

Follow the steps in `DEPLOYMENT-GUIDE.md` for detailed instructions.

**Good luck! 🚀**
