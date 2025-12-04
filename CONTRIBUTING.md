# Contributing to Portfolio

First off, thank you for considering contributing to this portfolio project! It's people like you that make this project better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Documentation](#documentation)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

**Use this template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari]
 - Node version: [e.g. 20.10.0]
 - Project version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

**Use this template:**

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Types of Contributions

We welcome many types of contributions:

1. **Bug Fixes** - Fix issues in the codebase
2. **New Features** - Add new functionality
3. **Documentation** - Improve or add documentation
4. **Examples** - Add usage examples
5. **Tests** - Add or improve test coverage
6. **Design** - Improve UI/UX
7. **Translations** - Add multi-language support (future)
8. **Performance** - Optimize code performance

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+ installed
- PostgreSQL database access
- AWS account (for S3 testing)
- Git installed

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Portfolio.git
   cd Portfolio
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/Portfolio.git
   ```

### Setup Development Environment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your test credentials
   ```

3. **Setup database:**
   ```bash
   # Run migrations
   node migrate-contact-page.js
   node migrate-add-footer-fields.js
   node migrate-setup-wizard.js
   node migrate-email-settings.js
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Visit:** `http://localhost:3000`

### Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**

3. **Test your changes:**
   ```bash
   npm run build
   npm start
   ```

4. **Commit your changes** (see [Commit Guidelines](#commit-guidelines))

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** (see [Pull Request Process](#pull-request-process))

---

## 🎨 Coding Standards

### Code Style

We use consistent code style throughout the project:

**TypeScript/JavaScript:**
- Use TypeScript for new files
- Follow existing code style
- Use meaningful variable names
- Add comments for complex logic
- Avoid magic numbers

**Example:**
```typescript
// Good
const MAX_UPLOAD_SIZE_MB = 10;
const isFileTooLarge = file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024;

// Bad
const x = file.size > 10485760;
```

**React Components:**
- Use functional components with hooks
- Keep components small and focused
- Use TypeScript interfaces for props
- Extract reusable logic into custom hooks

**Example:**
```typescript
interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onEdit?: () => void;
}

export function ProjectCard({ title, description, imageUrl, onEdit }: ProjectCardProps) {
  // Component implementation
}
```

### File Structure

```
Portfolio/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   └── (public pages)     # Public pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature components
├── lib/                  # Utility functions
├── public/               # Static assets
└── sql/                  # Database migrations
```

### Best Practices

1. **Keep it Simple:**
   - Write simple, readable code
   - Avoid over-engineering
   - Prefer clarity over cleverness

2. **Security:**
   - Never commit secrets or credentials
   - Validate all user inputs
   - Use parameterized queries
   - Sanitize data before rendering

3. **Performance:**
   - Optimize images before committing
   - Use React.memo for expensive components
   - Lazy load heavy components
   - Minimize bundle size

4. **Accessibility:**
   - Use semantic HTML
   - Add proper ARIA labels
   - Ensure keyboard navigation works
   - Test with screen readers

---

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(admin): add project drag-and-drop reordering"

# Bug fix
git commit -m "fix(contact): resolve email sending issue with Gmail"

# Documentation
git commit -m "docs: update deployment guide with Railway instructions"

# Refactor
git commit -m "refactor(api): improve error handling in database queries"

# Multiple lines
git commit -m "feat(chatbot): add conversation history

- Add database table for chat logs
- Implement conversation context
- Update N8N workflow
- Add admin panel for viewing conversations"
```

### Commit Message Guidelines

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to" not "moves cursor to")
- First line should be 50 characters or less
- Reference issues and pull requests in footer

---

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure your code builds:**
   ```bash
   npm run build
   ```

2. **Test your changes thoroughly:**
   - Test all affected features
   - Check mobile responsiveness
   - Test in multiple browsers
   - Verify database migrations work

3. **Update documentation:**
   - Update README if needed
   - Add/update code comments
   - Update relevant guide files

4. **Keep commits clean:**
   - Squash WIP commits
   - Use meaningful commit messages
   - Keep commits focused

### Submitting Pull Request

1. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request on GitHub**

3. **Fill out the PR template:**

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Checklist
- [ ] My code follows the project's code style
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have tested this on multiple browsers
- [ ] I have tested mobile responsiveness

## Screenshots (if applicable)
Add screenshots to demonstrate changes.

## Related Issues
Closes #123
```

4. **Wait for review:**
   - Address any feedback
   - Make requested changes
   - Keep the PR updated with main branch

### Review Process

1. **Initial Review** - Maintainer reviews code
2. **Feedback** - Suggestions or required changes
3. **Updates** - You make requested changes
4. **Approval** - Maintainer approves PR
5. **Merge** - PR is merged to main branch

---

## 🐛 Reporting Bugs

### Before Reporting

1. **Check existing issues** - Your bug may already be reported
2. **Try latest version** - Bug might be fixed
3. **Isolate the problem** - Create minimal reproduction

### Creating Bug Report

1. Go to [GitHub Issues](https://github.com/YOUR_USERNAME/Portfolio/issues)
2. Click **New Issue**
3. Select **Bug Report** template
4. Fill out all sections
5. Add labels: `bug`, relevant area (e.g., `admin`, `api`)

---

## 💡 Suggesting Enhancements

### Feature Requests

1. **Check existing issues** - Feature may be planned
2. **Describe the use case** - Why is this needed?
3. **Provide examples** - How would it work?

### Creating Enhancement Suggestion

1. Go to [GitHub Issues](https://github.com/YOUR_USERNAME/Portfolio/issues)
2. Click **New Issue**
3. Select **Feature Request** template
4. Fill out all sections
5. Add label: `enhancement`

---

## 📚 Documentation

### What Needs Documentation?

- New features
- API changes
- Configuration options
- Setup instructions
- Troubleshooting steps
- Migration guides

### Documentation Standards

1. **Be Clear and Concise**
   - Use simple language
   - Avoid jargon
   - Provide examples

2. **Keep It Updated**
   - Update docs with code changes
   - Remove outdated information
   - Add migration notes for breaking changes

3. **Structure Well**
   - Use headings and sections
   - Add table of contents for long docs
   - Include code examples

### Where to Add Documentation

- **README.md** - Project overview
- **GETTING_STARTED.md** - Setup guide
- **DEPLOYMENT_GUIDE.md** - Deployment instructions
- **Code Comments** - Inline documentation
- **JSDoc** - Function documentation

---

## 🌟 Recognition

Contributors will be recognized in:
- GitHub contributors list
- CHANGELOG.md for significant contributions
- Special mentions in releases

---

## ❓ Questions?

- **General Questions:** Open a GitHub Discussion
- **Bug Reports:** Open an Issue
- **Security Issues:** Email maintainers privately
- **Chat:** Join our community (if available)

---

## 📝 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You

Your contributions make this project better for everyone. Whether you're fixing a typo, reporting a bug, or adding a major feature - every contribution is valuable and appreciated!

---

**Happy Contributing!** 🚀

**Questions or need help?** Don't hesitate to ask in the issues or discussions!
