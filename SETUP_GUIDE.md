# 🚀 Portfolio Setup Guide

Welcome! This guide will help you set up your portfolio in minutes.

**📌 Looking for production deployment?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete AWS, RDS, S3, and server setup instructions.

---

## 📋 Quick Start (3 Methods)

### **Method 1: Setup Wizard** ⭐ RECOMMENDED
Perfect for new users - guided 5-step process!

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables** (`.env.local`):
   ```env
   DATABASE_URL=your_postgresql_connection_string

   # AWS S3 (for image uploads)
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   S3_BUCKET=your_bucket
   S3_PUBLIC_BASE_URL=https://your-bucket.s3.amazonaws.com

   # Email (OPTIONAL - can configure in admin panel after setup)
   GMAIL_USER=your@email.com
   GMAIL_APP_PASSWORD=your_app_password
   CONTACT_TO_EMAIL=where_to_receive@email.com

   # Encryption key for secure password storage
   ENCRYPTION_KEY=your-32-character-secret-key-12
   ```

   📧 **Email Note:** You can configure email settings either:
   - Method 1: In `.env.local` (above)
   - Method 2: In admin panel at `/admin/settings` → Email tab (recommended)

3. **Run migrations:**
   ```bash
   node migrate-contact-page.js
   node migrate-add-footer-fields.js
   node migrate-setup-wizard.js
   node migrate-email-settings.js
   ```

4. **Start the server:**
   ```bash
   npm run build
   npm start
   ```

5. **Visit `/admin/login`** - You'll be redirected to the Setup Wizard!

6. **Complete 5 steps:**
   - 🔐 Admin Password
   - 👤 Personal Info
   - 📞 Contact Details
   - 🎨 Branding
   - 🎉 Done!

---

### **Method 2: Use Example Data** 🎯 FASTEST
Start with pre-filled example data!

1. Follow steps 1-3 from Method 1
2. **Import example data:**
   ```bash
   node import-portfolio-data.js
   ```
   This loads:
   - ✅ Profile information
   - ✅ Hero section
   - ✅ Work experience (2 entries)
   - ✅ Skills (4 categories, 25 skills)
   - ✅ Projects (5 examples)
   - ✅ Contact info
   - ✅ Branding

3. **Create admin password manually:**
   ```bash
   # In your database, run:
   INSERT INTO setup_status (is_completed) VALUES (true);
   ```

4. **Set ADMIN_PASSWORD in `.env.local`:**
   ```env
   ADMIN_PASSWORD=your_secure_password
   ```

5. **Start server** and login at `/admin/login`

---

### **Method 3: Manual Setup** 🛠️ ADVANCED
For those who want full control

1. Set up environment variables
2. Run all migrations
3. Manually insert data into database tables
4. Set ADMIN_PASSWORD in `.env.local`
5. Build and start

---

## 📁 **File Structure**

```
/
├── .env.local                          # Your environment variables
├── my-portfolio-data.json              # Exported example data
├── migrate-contact-page.js             # Database migration
├── migrate-add-footer-fields.js        # Footer fields migration
├── migrate-setup-wizard.js             # Setup wizard migration
├── export-my-data.js                   # Export your data
├── import-portfolio-data.js            # Import data
├── app/
│   ├── setup/page.tsx                  # Setup wizard
│   ├── admin/                          # Admin panel
│   └── api/setup/route.ts              # Setup API
└── components/
    └── setup-wizard.tsx                # Wizard UI
```

---

## 🎨 **What's Customizable?**

Everything! Through the admin panel at `/admin`:

### **Dashboard** (`/admin`)
- Overview stats
- Quick actions

### **Projects** (`/admin/projects`)
- Add/edit/delete projects
- Upload images & PDFs
- Reorder with drag-and-drop

### **Messages** (`/admin/messages`)
- View contact form submissions

### **Homepage** (`/admin/homepage`)
- **Hero Section:** Name, tagline, stats, CTAs
- **Work Experience:** Jobs, achievements
- **Skills:** Categories and items

### **Contact Page** (`/admin/contact`)
- Email, phone, location
- Social links (LinkedIn, GitHub, Twitter)
- Logo text
- Footer tagline & copyright
- Show/hide toggles

### **Profile** (`/admin/profile`)
- Full name, title, bio
- Profile image URL
- Resume URL

### **Settings** (`/admin/settings`)
- **Account:** Admin email, session timeout
- **Email:** SMTP configuration for contact form (Gmail, custom SMTP)
- **Site:** Title, description, Google Analytics
- **Appearance:** Primary/secondary colors, logo, favicon
- **SEO:** Meta keywords, Open Graph images, Twitter handle
- **Backup:** Export/import portfolio data

---

## 🔄 **Data Management**

### **Export Your Data:**
```bash
node export-my-data.js
```
Creates `my-portfolio-data.json` with all your content.

### **Import Data:**
```bash
node import-portfolio-data.js
```
Loads data from `my-portfolio-data.json`.

### **Backup:**
Keep `my-portfolio-data.json` safe! It contains:
- ✅ All text content
- ✅ Settings & branding
- ✅ Work experience & skills
- ✅ Project metadata
- ❌ Does NOT include images (use S3 backup)

---

## 🗄️ **Database Tables**

| Table | Purpose |
|-------|---------|
| `profile` | Name, title, bio |
| `hero_section` | Homepage hero content |
| `contact_page_content` | Contact info & social links |
| `site_settings` | Colors, branding, SEO |
| `work_experience` | Job history |
| `skills_categories` | Skill category headers |
| `skills_items` | Individual skills |
| `projects` | Portfolio projects |
| `messages` | Contact form submissions |
| `setup_status` | Setup wizard status |
| `admin_credentials` | Admin password (encrypted) |

---

## 🔐 **Security**

### **Admin Password:**
- Stored encrypted with bcrypt
- Set during Setup Wizard OR in `.env.local`
- Change anytime in Settings

### **Cookie-Based Auth:**
- HTTP-only cookies
- 7-day session
- Secure in production

### **Environment Variables:**
- **NEVER** commit `.env.local` to git
- Keep credentials safe
- Use strong passwords

---

## 🚀 **Deployment**

**📚 For complete deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

The deployment guide includes:
- ✅ AWS Account Setup
- ✅ PostgreSQL Database (RDS) Configuration
- ✅ S3 Bucket Setup for Images
- ✅ EC2 Server Deployment
- ✅ Vercel Deployment
- ✅ Domain & SSL Setup
- ✅ Environment Variables
- ✅ Nginx Configuration
- ✅ Troubleshooting

### **Quick Deploy: Vercel**
```bash
npm install -g vercel
vercel --prod
```
Add environment variables in Vercel dashboard → Settings → Environment Variables

### **Quick Deploy: AWS EC2**
```bash
# On your EC2 instance
git clone your-repo
cd Portfolio
npm install
npm run build
pm2 start npm --name "portfolio" -- start
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions.

---

## 🆘 **Troubleshooting**

### **"Setup wizard not showing"**
- Clear browser cache
- Check `/api/setup` returns `is_completed: false`
- Delete cookies and try again

### **"Login failed"**
- If using Setup Wizard: Use password you created
- If using `.env.local`: Check `ADMIN_PASSWORD` variable
- Check database has `admin_credentials` table

### **"Database connection failed"**
- Verify `DATABASE_URL` in `.env.local`
- Check database is running
- Ensure SSL settings match your database

### **"Images not uploading"**
- Verify AWS S3 credentials
- Check bucket permissions
- Ensure `S3_PUBLIC_BASE_URL` is correct

### **"Contact form not sending"**
- Check Gmail SMTP settings
- Verify `GMAIL_APP_PASSWORD` (not regular password)
- Test with a simple email first

---

## 📚 **Resources**

### **Files You Need:**
- ✅ `.env.local` - Environment variables
- ✅ `my-portfolio-data.json` - Example data
- ✅ Migration scripts - Database setup

### **What to Customize:**
- Profile image & resume (upload in admin)
- Project images (upload in admin)
- Colors & branding (admin settings)
- All text content (admin panel)

### **What NOT to Change:**
- Migration files (run once)
- Database schema
- API routes (unless you know what you're doing)

---

## 🎉 **You're Ready!**

Your portfolio includes:
- ✅ Beautiful homepage with hero section
- ✅ Work experience timeline
- ✅ Skills showcase
- ✅ Project gallery with PDFs
- ✅ Contact form with email notifications
- ✅ AI chatbot (optional)
- ✅ Fully responsive design
- ✅ SEO optimized
- ✅ Admin panel for everything
- ✅ Setup wizard for easy onboarding

**No coding required to customize!** 🎊

---

## 📞 **Need Help?**

1. Check this guide first
2. Review migration logs for errors
3. Check browser console for errors
4. Verify environment variables
5. Test database connection

---

## 🔄 **Updates**

To update your portfolio later:
1. Export your data: `node export-my-data.js`
2. Pull latest changes
3. Run any new migrations
4. Import your data: `node import-portfolio-data.js`
5. Rebuild: `npm run build`

---

**Made with ❤️ - Ready to share on LinkedIn!** 🚀
