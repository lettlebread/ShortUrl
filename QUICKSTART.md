# Quick Start Guide

Get the Short URL Service up and running in minutes!

## Prerequisites

- Node.js >= 14 (v18 recommended)
- PostgreSQL database
- npm or yarn

## 5-Minute Setup

### 1. Clone and Install

```bash
git clone https://github.com/lettlebread/ShortUrl.git
cd ShortUrl
npm install
```

### 2. Configure Environment

Create `.env.development`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/shorturldb
COOKIE_PASSWORD=your-secret-password-must-be-at-least-32-characters-long
```

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate --schema="src/database/schema.prisma"

# Run migrations
npx prisma migrate dev --schema="src/database/schema.prisma"
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🚀

## What You Can Do

### Create a Short URL (No Login Required)

1. Go to `http://localhost:3000`
2. Enter a long URL
3. Click "Create"
4. Copy your short URL!

### Manage URLs with an Account

1. Click "Sign up"
2. Create an account
3. Access `/urlentry` to:
   - View all your URLs
   - Edit names and descriptions
   - Track view counts
   - Delete URLs

## API Quick Reference

### Create Short URL

```bash
curl -X POST http://localhost:3000/api/urlentry \
  -H "Content-Type: application/json" \
  -d '{"targetUrl": "https://example.com/very/long/url"}'
```

### Use Short URL

```bash
curl -L http://localhost:3000/api/urlentry/abc123
# Redirects to target URL
```

### Register User

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securePassword"}' \
  -c cookies.txt
```

### Get Your URLs (Requires Login)

```bash
curl -X GET http://localhost:3000/api/urlentry \
  -b cookies.txt
```

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# View database in GUI
npx prisma studio --schema="src/database/schema.prisma"
```

## Project Structure

```
ShortUrl/
├── src/
│   ├── pages/          # Web pages & API routes
│   ├── components/     # React components
│   ├── libs/          # Utility functions
│   └── database/      # Prisma schema
├── __tests__/         # Tests
└── public/            # Static files
```

## Troubleshooting

**Port 3000 already in use?**
```bash
lsof -ti:3000 | xargs kill -9
```

**Database connection error?**
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env.development`

**Module not found?**
```bash
npm install
npx prisma generate --schema="src/database/schema.prisma"
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

- Check existing [GitHub Issues](https://github.com/lettlebread/ShortUrl/issues)
- Open a new issue with your question
- Contact the maintainers

Happy coding! 🎉
