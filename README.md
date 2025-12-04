# 💼 Professional Portfolio Website with AI Chatbot

A modern, full-stack portfolio system built with Next.js, featuring an admin dashboard, AI-powered chatbot, and complete content management - all without touching code!

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

![Portfolio Screenshot](https://via.placeholder.com/800x400/0066CC/FFFFFF?text=Your+Portfolio+Screenshot+Here)

---

## ✨ Features

### 🎨 For Visitors
- **Modern Portfolio** - Beautiful, responsive design that works on all devices
- **Project Showcase** - Interactive project gallery with case studies
- **AI Chatbot** 🤖 - GPT-4 powered assistant that answers questions about you
- **Contact Form** - Easy way for visitors to reach you
- **Dynamic Theming** - Customizable colors and branding
- **Fast & SEO-Friendly** - Optimized for search engines and performance

### 🔐 For You (Admin Dashboard)
- **Easy Setup Wizard** - 5-step guided setup process
- **No Coding Required** - Manage everything through the admin panel
- **Project Management** - Add, edit, delete projects with drag-and-drop ordering
- **Content Editor** - Update homepage, profile, skills, and experience
- **Message Inbox** - View and manage contact form submissions
- **Settings Panel** - Control appearance, SEO, email, and more
- **Data Export** - Backup all your content as JSON

### 🤖 AI Chatbot
- N8N workflow integration
- OpenAI GPT-4 powered responses
- Answers questions about your background, skills, and projects
- Conversation history tracking
- Real-time typing indicators
- Fully customizable personality

---

## 🚀 Quick Start

**New to this project?** → See [GETTING_STARTED.md](./GETTING_STARTED.md) for complete setup guide.

### Prerequisites

- Node.js 20+
- PostgreSQL database (AWS RDS, Neon, Supabase)
- AWS S3 bucket (for file uploads)
- Gmail account (for contact form)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your credentials

# Run database migrations
node migrate-contact-page.js
node migrate-add-footer-fields.js
node migrate-setup-wizard.js
node migrate-email-settings.js

# Build and start
npm run build
npm run dev
```

Visit `http://localhost:3000/admin/login` to start the setup wizard!

---

## 📸 Screenshots

### Public Portfolio
![Homepage](https://via.placeholder.com/600x300/0066CC/FFFFFF?text=Homepage+Screenshot)

### Admin Dashboard
![Admin Panel](https://via.placeholder.com/600x300/0066CC/FFFFFF?text=Admin+Dashboard+Screenshot)

### AI Chatbot
![Chatbot](https://via.placeholder.com/300x500/0066CC/FFFFFF?text=Chatbot+Screenshot)

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| **[GETTING_STARTED.md](./GETTING_STARTED.md)** | Complete setup guide for beginners |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Detailed setup instructions |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Deploy to AWS, Vercel, or other platforms |
| **[N8N_CHATBOT_SETUP.md](./N8N_CHATBOT_SETUP.md)** | AI chatbot configuration |
| **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** | Customize your portfolio |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Contribute to the project |

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 15.2.4](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript 5](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Lucide Icons](https://lucide.dev/) - Icons

**Backend:**
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Backend API
- [PostgreSQL](https://www.postgresql.org/) - Database
- [AWS S3](https://aws.amazon.com/s3/) - File storage
- [Nodemailer](https://nodemailer.com/) - Email sending
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Password hashing

**AI & Automation:**
- [N8N](https://n8n.io/) - Workflow automation
- [OpenAI GPT-4](https://openai.com/) - AI chatbot

**Deployment:**
- [AWS EC2](https://aws.amazon.com/ec2/) - Hosting
- [AWS RDS](https://aws.amazon.com/rds/) - Database hosting
- [Nginx](https://nginx.org/) - Reverse proxy
- [PM2](https://pm2.keymetrics.io/) - Process manager
- [Vercel](https://vercel.com/) - Alternative hosting

---

## 🎯 Use Cases

This portfolio system is perfect for:

- 💼 **Business Analysts** - Showcase projects and case studies
- 👨‍💻 **Software Developers** - Display coding projects and GitHub repos
- 🎨 **Designers** - Create visual portfolio with project galleries
- 📊 **Data Analysts** - Present data visualization projects
- 📝 **Content Creators** - Share your work and writing
- 🚀 **Entrepreneurs** - Professional business presence
- 🎓 **Students** - Build your first professional portfolio
- 💡 **Freelancers** - Attract clients with impressive portfolio

---

## 🎨 Features in Detail

### Setup Wizard
First-time users get a guided 5-step setup:
1. 🔐 Create admin password
2. 👤 Enter personal information
3. 📞 Add contact details
4. 🎨 Set brand colors
5. 🎉 Complete setup

No technical knowledge required!

### Admin Dashboard

**Dashboard** (`/admin`)
- Overview statistics
- Quick actions
- Recent messages

**Projects** (`/admin/projects`)
- Add/edit/delete projects
- Upload images and PDF case studies
- Drag-and-drop reordering
- Toggle visibility

**Homepage Editor** (`/admin/homepage`)
- **Hero Section:** Name, tagline, profile image
- **Experience:** Work history with achievements
- **Skills:** Categorized skill sets

**Contact Page** (`/admin/contact`)
- Email, phone, location
- Social media links (LinkedIn, GitHub, Twitter)
- Logo and footer customization

**Profile** (`/admin/profile`)
- Full name, title, bio
- Profile image and resume upload

**Settings** (`/admin/settings`)
- **Account:** Password, session timeout
- **Email:** SMTP configuration (Gmail/custom)
- **Site:** Title, description, Google Analytics
- **Appearance:** Colors, logo, favicon
- **SEO:** Meta tags, Open Graph, Twitter cards
- **Backup:** Export/import portfolio data

### Contact Form

- Email notifications via Gmail SMTP
- Anti-spam measures
- Message inbox in admin panel
- Mark as read/unread
- Delete unwanted messages

### File Management

- Upload to AWS S3
- Support for images (JPG, PNG, WebP)
- Support for PDFs (case studies)
- Automatic optimization
- Public URL generation

---

## 🚀 Deployment Options

### Option 1: Vercel (Easiest) ⭐

```bash
npm install -g vercel
vercel --prod
```

**Pros:** Free tier, automatic deployments, built-in SSL
**Cons:** Limited backend features

### Option 2: AWS EC2 (Full Control)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

**Pros:** Full control, can run PM2, better for chatbot
**Cons:** More complex setup, need to manage server

### Option 3: Railway

1. Connect GitHub repo
2. Add environment variables
3. Deploy

**Pros:** Very simple, good free tier
**Cons:** Limited free tier

### Option 4: DigitalOcean App Platform

1. Create app from GitHub
2. Configure build settings
3. Add environment variables

**Pros:** Simple, good documentation
**Cons:** Paid service

---

## 🤖 AI Chatbot Setup

The chatbot is optional but adds significant value. See [N8N_CHATBOT_SETUP.md](./N8N_CHATBOT_SETUP.md) for complete setup.

**What the chatbot does:**
- Answers questions about your background
- Provides information about your skills and experience
- Shares details about your projects
- Directs visitors to contact you
- Maintains conversation context

**Requirements:**
- N8N account (free tier available)
- OpenAI API key ($5-10/month)
- 1-2 hours setup time

---

## 💰 Cost Estimate

### Minimum Setup (No Chatbot)
- **AWS RDS:** $0 (12 months free tier)
- **AWS S3:** $0.50-2/month
- **Vercel Hosting:** $0
- **Domain:** $10-15/year
- **Total:** ~$1-2/month + domain

### With AI Chatbot
- **Above costs** +
- **OpenAI API:** $5-10/month
- **N8N Cloud:** $0-20/month
- **Total:** ~$15-30/month + domain

### After AWS Free Tier
- **AWS RDS:** $15-25/month
- **Consider:** Neon or Supabase (free tier forever)

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Ways to contribute:**
- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository

---

## 📝 Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/portfolio

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your-bucket
S3_PUBLIC_BASE_URL=https://your-bucket.s3.amazonaws.com

# Email (configure in admin panel after setup)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_app_password
CONTACT_TO_EMAIL=recipient@email.com
CONTACT_FROM_EMAIL=sender@email.com

# Security
ENCRYPTION_KEY=your-32-character-random-key

# Optional: Admin password (or set via setup wizard)
# ADMIN_PASSWORD=your_secure_password

# Optional: Chatbot
# NEXT_PUBLIC_CHATBOT_WEBHOOK_URL=https://your-n8n.app/webhook/chatbot
```

See `.env.example` for a complete template.

---

## 🔒 Security

- **Authentication:** Cookie-based sessions with bcrypt password hashing
- **Environment Variables:** All sensitive data in environment variables
- **SQL Injection:** Parameterized queries
- **XSS Protection:** Input sanitization
- **CSRF Protection:** Built-in Next.js protection
- **File Upload Security:** Type and size validation
- **Rate Limiting:** Built-in API rate limiting

**Best Practices:**
- Never commit `.env.local`
- Use strong admin passwords
- Keep dependencies updated
- Enable 2FA on AWS/GitHub accounts
- Regular database backups

---

## 🐛 Troubleshooting

### Common Issues

**Setup wizard not showing:**
- Clear browser cache and cookies
- Check `/api/setup` endpoint
- Verify database migrations ran

**Images not uploading:**
- Verify AWS S3 credentials
- Check bucket permissions
- Ensure bucket CORS configured

**Contact form not sending:**
- Configure email in `/admin/settings`
- Use Gmail App Password, not regular password
- Check SMTP settings

**Database connection failed:**
- Verify DATABASE_URL in `.env.local`
- Check database is running
- Ensure RDS security group allows connections

See [GETTING_STARTED.md](./GETTING_STARTED.md) for more troubleshooting help.

---

## 📊 Database Schema

### Core Tables:
- `profile` - Personal information
- `hero_section` - Homepage hero content
- `work_experience` - Job history
- `skills_categories` - Skill categories
- `skills_items` - Individual skills
- `projects` - Portfolio projects
- `messages` - Contact form submissions
- `contact_page_content` - Contact page data
- `site_settings` - Site configuration
- `setup_status` - Setup wizard status
- `admin_credentials` - Admin authentication
- `chat_conversations` - Chatbot logs (optional)

---

## 🌟 Showcase

**Using this portfolio? Share it!**

Open an issue or PR to add your portfolio to our showcase:
- Your Name - [yourportfolio.com](https://yourportfolio.com) - Industry/Title

---

## 📞 Support

**Need help?**
1. Check the [documentation](./GETTING_STARTED.md)
2. Review [troubleshooting guide](./GETTING_STARTED.md#troubleshooting)
3. Search [existing issues](https://github.com/YOUR_USERNAME/Portfolio/issues)
4. [Create a new issue](https://github.com/YOUR_USERNAME/Portfolio/issues/new)

**Found a bug?**
Please [report it](https://github.com/YOUR_USERNAME/Portfolio/issues/new) with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

**What this means:**
- ✅ Use for personal projects
- ✅ Use for commercial projects
- ✅ Modify the code
- ✅ Distribute the code
- ❌ Hold authors liable
- ⚠️ Must include license and copyright notice

---

## 🙏 Acknowledgments

Built with these amazing open-source projects:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [N8N](https://n8n.io/)
- [OpenAI](https://openai.com/)

Special thanks to all contributors!

---

## 🗺️ Roadmap

### Coming Soon:
- [ ] Dark mode toggle
- [ ] Blog section with markdown support
- [ ] Analytics dashboard
- [ ] Email newsletter integration
- [ ] Multi-language support
- [ ] PDF resume generator
- [ ] LinkedIn import
- [ ] Testimonials section
- [ ] Custom domain email
- [ ] Advanced SEO features

Want to contribute? See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## ⭐ Star History

If you find this project useful, please consider starring it on GitHub!

[![Star History Chart](https://api.star-history.com/svg?repos=YOUR_USERNAME/Portfolio&type=Date)](https://star-history.com/#YOUR_USERNAME/Portfolio&Date)

---

## 📬 Contact

**Project Maintainer:** Your Name
- **Email:** your.email@example.com
- **LinkedIn:** [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- **GitHub:** [@yourusername](https://github.com/yourusername)
- **Portfolio:** [yourportfolio.com](https://yourportfolio.com)

---

## 🎯 Quick Links

- [Get Started](./GETTING_STARTED.md) - New user guide
- [Deploy Guide](./DEPLOYMENT_GUIDE.md) - Production deployment
- [Setup Chatbot](./N8N_CHATBOT_SETUP.md) - AI chatbot
- [Customize](./CUSTOMIZATION_GUIDE.md) - Personalization
- [Contribute](./CONTRIBUTING.md) - Join the project
- [Report Bug](https://github.com/YOUR_USERNAME/Portfolio/issues/new) - Found an issue?
- [Request Feature](https://github.com/YOUR_USERNAME/Portfolio/issues/new) - Have an idea?

---

<div align="center">

**Made with ❤️ by developers, for developers**

[⭐ Star](https://github.com/YOUR_USERNAME/Portfolio) · [🐛 Report Bug](https://github.com/YOUR_USERNAME/Portfolio/issues) · [💡 Request Feature](https://github.com/YOUR_USERNAME/Portfolio/issues)

**Ready to build your portfolio?** → [Get Started](./GETTING_STARTED.md)

</div>

---

**Status:** ✅ Production Ready | **Version:** 1.0.0 | **Last Updated:** 2025-01-15
