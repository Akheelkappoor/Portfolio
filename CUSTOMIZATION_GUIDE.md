# Portfolio Customization Guide

Welcome to your new portfolio! This guide will help you customize everything without touching any code.

## 🚀 Quick Start

### 1. First Time Setup

After downloading/forking this portfolio:

1. **Run the migrations** to set up your database:
   ```bash
   node migrate-contact-page.js
   # Run any other migration files you see
   ```

2. **Access the admin panel**:
   - Visit: `http://your-domain.com/admin/login`
   - Default credentials are in your `.env.local` file

3. **Start customizing!**

---

## 📝 What You Can Customize

### ✅ **Dashboard** (`/admin`)
- View site statistics
- Monitor messages and projects
- Quick overview of your portfolio

### ✅ **Projects** (`/admin/projects`)
- Add/edit/delete portfolio projects
- Upload project images and PDF case studies
- Reorder projects via drag-and-drop
- Set project visibility

### ✅ **Messages** (`/admin/messages`)
- View contact form submissions
- Mark messages as read/unread
- Delete spam messages

### ✅ **Homepage** (`/admin/homepage`)
Edit three main sections:

**Hero Section:**
- Your name, tagline, and description
- Profile image and resume
- Statistics (years of experience, projects, etc.)
- Call-to-action buttons
- Availability status

**Work Experience:**
- Add/edit job positions
- Company, location, dates
- Achievements for each role
- Reorder and hide entries

**Skills:**
- Create skill categories
- Add skills to each category
- Reorder and manage visibility

### ✅ **Contact Page** (`/admin/contact`) 🆕
**NEW! Fully Editable:**
- Page heading and subheading
- Email, phone, location
- LinkedIn, GitHub, Twitter URLs
- Show/hide toggles for each field

### ✅ **Profile** (`/admin/profile`)
- Personal information
- Bio and social links
- Contact details
- Profile image and resume

### ✅ **Settings** (`/admin/settings`)
- Site title and metadata
- Color scheme (primary/secondary colors)
- Logo and favicon
- Google Analytics ID
- SEO keywords

---

## 🎨 Complete Customization Checklist

Use this checklist to fully customize your portfolio:

- [ ] **Login**: Change default admin password
- [ ] **Profile**: Update name, bio, and contact info
- [ ] **Hero Section**: Add your name, tagline, and profile image
- [ ] **Work Experience**: Add your job history
- [ ] **Skills**: Add your technical and soft skills
- [ ] **Projects**: Upload 3-5 portfolio projects with images
- [ ] **Contact Page**: Update email, phone, and social links
- [ ] **Settings**: Set your brand colors and site metadata
- [ ] **Resume**: Upload your latest resume PDF
- [ ] **Test Contact Form**: Send a test message to verify emails work

---

## 🔐 Security

**IMPORTANT:** After setup, change your admin password:

1. Go to `/admin/settings`
2. Look for "Change Password" section
3. Set a strong, unique password
4. Never commit `.env.local` to git

---

## 📦 File Uploads

- **Images**: Uploaded to AWS S3 (configure in `.env.local`)
- **PDFs**: Stored in S3 for project case studies
- **Supported formats**:
  - Images: JPG, PNG, WebP
  - Documents: PDF

---

## 🌐 Environment Variables

Make sure these are set in `.env.local`:

```env
# Database
DATABASE_URL=your_postgres_connection_string

# AWS S3 (for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your_bucket_name
S3_PUBLIC_BASE_URL=https://your-bucket.s3.amazonaws.com

# Email (for contact form)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
CONTACT_TO_EMAIL=where_to_receive_messages@email.com
CONTACT_FROM_EMAIL=noreply@yourdomain.com
```

---

## 🆘 Need Help?

- **Database issues?** Make sure all migration scripts have been run
- **Login not working?** Check your admin credentials in the database
- **Images not uploading?** Verify AWS S3 credentials in `.env.local`
- **Contact form not sending?** Check Gmail SMTP settings

---

## 🎉 You're All Set!

Your portfolio is now 100% customizable through the admin panel. No coding required!

**Pro Tips:**
- Keep your content up-to-date
- Add new projects regularly
- Respond to messages promptly
- Update your resume every 6 months
- Change your admin password regularly

Enjoy your new portfolio! 🚀
