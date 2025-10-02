# Contributing to Short URL Service

Thank you for your interest in contributing to the Short URL Service! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. Please:

- Be respectful and constructive in discussions
- Accept feedback graciously
- Focus on what's best for the project
- Show empathy towards other contributors

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 14 (v18 recommended)
- **npm** or **yarn** package manager
- **PostgreSQL** 12 or higher
- **Git** for version control
- A code editor (VS Code recommended)

### Recommended VS Code Extensions

- ESLint
- Prettier
- Prisma
- TypeScript and JavaScript Language Features

## Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ShortUrl.git
   cd ShortUrl
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/lettlebread/ShortUrl.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Set up environment variables**:
   Create `.env.development` in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/shorturldb
   COOKIE_PASSWORD=your-secret-password-must-be-at-least-32-characters-long
   ```

6. **Set up the database**:
   ```bash
   # Generate Prisma client
   npx prisma generate --schema="src/database/schema.prisma"
   
   # Run migrations
   npx prisma migrate dev --schema="src/database/schema.prisma"
   ```

7. **Start the development server**:
   ```bash
   npm run dev
   ```

8. **Verify setup**: Navigate to `http://localhost:3000` in your browser

## Making Changes

### Branch Naming Convention

Create descriptive branch names:
- `feature/add-url-expiration` - New features
- `fix/login-redirect-bug` - Bug fixes
- `docs/update-api-guide` - Documentation updates
- `refactor/improve-cache-service` - Code refactoring
- `test/add-api-tests` - Test additions

### Workflow

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Write clean, readable code
   - Follow existing code patterns
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**:
   ```bash
   npm run lint    # Check code style
   npm run test    # Run tests
   npm run build   # Ensure it builds
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add url expiration feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a pull request** on GitHub

## Testing

### Running Tests

Run all tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test -- --watch
```

Run tests with coverage:
```bash
npm run test -- --coverage
```

### Writing Tests

We use Jest for testing. Place tests in the `__tests__/` directory, mirroring the source structure.

**Example test**:
```typescript
// __tests__/libs/hashUtil/index.test.ts
import { createHashString } from '@/libs/hashUtil'

describe('hashUtil', () => {
  describe('createHashString', () => {
    it('should generate a hash string', () => {
      const hash = createHashString()
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should generate unique hashes', () => {
      const hash1 = createHashString()
      const hash2 = createHashString()
      expect(hash1).not.toBe(hash2)
    })
  })
})
```

### Test Coverage Guidelines

- **Utility functions**: 100% coverage expected
- **API routes**: Test happy path and error cases
- **React components**: Test user interactions and state changes
- **Middleware**: Test authentication and error handling

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define types/interfaces for all data structures
- Avoid `any` type; use `unknown` if necessary

**Example**:
```typescript
// Good
interface UrlEntry {
  id: number
  hashKey: string
  targetUrl: string
}

function getUrlEntry(id: number): Promise<UrlEntry> {
  // ...
}

// Avoid
function getUrlEntry(id: any): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Destructure props
- Use TypeScript for prop types
- Keep components small and focused

**Example**:
```typescript
interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return <div className="loading">{message}</div>
}
```

### API Routes

- Use explicit return types
- Handle errors properly
- Validate input data
- Return consistent response formats

**Example**:
```typescript
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }
    
    // Handle request
    const data = await processRequest(req.body)
    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default handler
```

### Code Formatting

We use ESLint for code quality. Run the linter:
```bash
npm run lint
```

Fix auto-fixable issues:
```bash
npm run lint -- --fix
```

**Key rules**:
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- No trailing commas in objects (ES5 style)

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat: add URL expiration feature

Allow users to set expiration dates for their short URLs.
Expired URLs return a 410 Gone status.

Closes #123
```

```
fix: correct login redirect loop

Users were stuck in infinite redirect when accessing login page
while already authenticated. Now properly redirects to /urlentry.

Fixes #456
```

```
docs: update API documentation

Add examples for URL creation endpoint and clarify authentication
requirements for protected routes.
```

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run test`)
- [ ] Linter passes with no errors (`npm run lint`)
- [ ] Code builds successfully (`npm run build`)
- [ ] New code has adequate test coverage
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested these changes

## Checklist
- [ ] Tests pass
- [ ] Linter passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks**: CI will run tests and linting
2. **Code review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged
5. **Deployment**: Changes are deployed to production after merge to `main`

### Getting Feedback

- Be patient - maintainers are volunteers
- Respond to feedback promptly
- Ask questions if feedback is unclear
- Don't take criticism personally

## Project Structure

```
ShortUrl/
├── src/
│   ├── pages/              # Next.js pages & API routes
│   │   ├── api/           # Backend API endpoints
│   │   ├── index.tsx      # Home page
│   │   ├── login/         # Login page
│   │   ├── register/      # Registration page
│   │   └── urlentry/      # URL management page
│   ├── components/        # Reusable React components
│   ├── libs/              # Utility libraries
│   │   ├── dbService/     # Database client
│   │   ├── cacheService/  # Caching utilities
│   │   ├── hashUtil/      # Hash generation
│   │   └── ...
│   ├── middleware/        # API middleware
│   ├── interfaces/        # TypeScript types
│   ├── database/          # Prisma schema
│   └── styles/            # CSS files
├── __tests__/             # Test files
├── public/                # Static assets
└── ...
```

### Where to Add New Code

- **New page**: `src/pages/your-page/index.tsx`
- **New API endpoint**: `src/pages/api/your-endpoint/index.ts`
- **New component**: `src/components/YourComponent.tsx`
- **New utility**: `src/libs/yourUtil/index.ts`
- **New type**: Add to `src/interfaces/`
- **New test**: `__tests__/path/to/test.test.ts`

## Common Tasks

### Adding a New API Endpoint

1. Create file in `src/pages/api/`
2. Implement handler function
3. Add middleware (session, error handling)
4. Document in README
5. Add tests

### Adding a New Page

1. Create directory in `src/pages/`
2. Add `index.tsx` file
3. Implement React component
4. Add to navigation (if needed)
5. Update documentation

### Modifying Database Schema

1. Edit `src/database/schema.prisma`
2. Create migration: `npx prisma migrate dev --name "your_change"`
3. Regenerate client: `npx prisma generate`
4. Update affected code
5. Test thoroughly

### Adding a Dependency

1. Install with npm: `npm install package-name`
2. Use in your code
3. Document why it's needed in your PR
4. Keep dependencies minimal

## Questions?

If you have questions:

1. Check existing documentation (README, ARCHITECTURE)
2. Search existing issues and PRs
3. Open a new issue with the `question` label
4. Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Thank You!

Your contributions make this project better! We appreciate your time and effort.
