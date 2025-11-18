# Portfolio – Run Locally and Deploy to AWS

Overview
- Tech: Next.js (App Router), TypeScript, Tailwind (via shadcn styles), API Routes.
- Features: Public portfolio pages, Contact form (Resend), Admin-only pages (protected by ADMIN_PASSWORD), Projects management, Resume download.
- Design: Matte white background with black text, subtle accent colors, accessible typography.

Local Development
1) Requirements
- Node.js 18+ (LTS recommended)
- npm or pnpm
- A Resend API key (for the contact form) — optional during development

2) Setup
- Copy .env.example to .env.local and fill in values:
  - RESEND_API_KEY=your_resend_api_key
  - CONTACT_TO_EMAIL=you@example.com
  - ADMIN_PASSWORD=set-a-strong-password
- Install and run:
  - npm install
  - npm run dev
- Open http://localhost:3000

3) Admin Access (for adding/editing projects)
- Visit /admin/login
- Use the password from ADMIN_PASSWORD
- Manage projects at /admin/projects
- Note: Routes are protected using an HttpOnly session cookie after successful login.

4) Resume Download
- Place your resume at public/resume.pdf
- The “Download Resume” button links to /resume.pdf

Sending Email (Contact Page)
- This project uses Resend to send emails from /contact.
- Set:
  - RESEND_API_KEY=... (from Resend)
  - CONTACT_TO_EMAIL=your target inbox (e.g., yourname@gmail.com)
- In development, if the key is missing, the form may show an informative error.

Environment Variables
- RESEND_API_KEY: Resend API key used by the contact API route
- CONTACT_TO_EMAIL: The recipient email address for contact form submissions
- ADMIN_PASSWORD: Password to access /admin (keep this secret)

AWS Deployment Options

Option A – AWS Amplify Hosting (Recommended for simplicity)
- Connect your GitHub repo in Amplify.
- Framework: Next.js
- Build settings: Amplify auto-detects Next.js SSR. Default is typically:
  - Build Command: npm ci && npm run build
  - Start Command: npm start
- Set environment variables in Amplify:
  - RESEND_API_KEY
  - CONTACT_TO_EMAIL
  - ADMIN_PASSWORD
- Verify:
  - Contact page can send email (Resend key valid)
  - /admin/login works and only accepts your ADMIN_PASSWORD
- Custom domain (optional): Add in Amplify’s domain settings.

Option B – Elastic Beanstalk or ECS (Docker)
1) Ensure scripts in package.json:
- "build": "next build"
- "start": "next start -p $PORT"
- EB/ECS set PORT automatically; Next will listen on it.

2) Dockerfile (for ECS or EB using Docker)
- Example:
  \`\`\`
  FROM node:18-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  ENV NODE_ENV=production PORT=3000
  EXPOSE 3000
  CMD ["npm", "start"]
  \`\`\`

3) Elastic Beanstalk (without Docker)
- Platform: Node.js 18
- Add a Procfile:
  \`\`\`
  web: npm start
  \`\`\`
- In EB, set env vars:
  - RESEND_API_KEY, CONTACT_TO_EMAIL, ADMIN_PASSWORD
- Deploy zip or connect to your repository pipeline.

4) Notes for AWS uploads
- If your project uses image uploads and you want AWS-native storage, consider S3:
  - You will need to update upload logic to use AWS SDK and S3 bucket credentials.
  - Set S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, S3_BUCKET.
  - This README does not change code; it only documents the approach.

Troubleshooting
- 404s for /resume.pdf: Ensure file exists in public/.
- Contact form fails:
  - Check RESEND_API_KEY and CONTACT_TO_EMAIL are set in your environment.
- Admin page denies access:
  - Confirm ADMIN_PASSWORD is set and matches your input.
- Production build errors:
  - Clear node_modules and try a clean install/build (npm ci && npm run build).
- Hydration mismatch (dev): If you see “Hydration failed because the server rendered HTML didn’t match the client,” common causes include:
  - Browser extensions injecting attributes (e.g., jf-ext-button-ct) into buttons/links before React hydrates
  - Non-deterministic output in server-rendered markup (using Date.now(), Math.random(), user-locale dates) 
  - Client-only branches rendering different DOM than the server

Fixes:
- Temporarily disable browser extensions or try a private window
- Ensure server and client render identical markup: move non-deterministic code to useEffect or gate with a mounted state
- Avoid Date.now()/Math.random() directly in SSR-rendered elements
- If a third-party extension adds attributes, strip them out or ensure they don’t modify SSR HTML

Security
- Never commit .env.local to source control.
- Use a strong ADMIN_PASSWORD and rotate it regularly.
- Limit who has access to your AWS environment variables and hosting.

Happy shipping!
