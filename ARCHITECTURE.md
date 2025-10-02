# Architecture Documentation

## System Overview

The Short URL Service is a full-stack web application built on Next.js that provides URL shortening functionality with user authentication and management features.

## High-Level Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────────┐
│         Next.js Application             │
│  ┌─────────────────────────────────┐   │
│  │     React Frontend (SSR)        │   │
│  │  - Home Page                    │   │
│  │  - Login/Register Pages         │   │
│  │  - URL Management Dashboard     │   │
│  └─────────────────────────────────┘   │
│                 │                        │
│  ┌─────────────────────────────────┐   │
│  │     API Routes (Backend)        │   │
│  │  - Session Management           │   │
│  │  - URL CRUD Operations          │   │
│  │  - User Authentication          │   │
│  └─────────────────────────────────┘   │
│                 │                        │
│  ┌──────────┬──────────┬──────────┐    │
│  │ Prisma   │  Cache   │ bcrypt   │    │
│  │   ORM    │ Service  │  Utils   │    │
│  └────┬─────┴──────────┴──────────┘    │
└───────┼────────────────────────────────┘
        │
        ▼
┌─────────────────┐
│   PostgreSQL    │
│    Database     │
└─────────────────┘
```

## Component Architecture

### Frontend Layer

**Technology**: React 18 + Next.js 13 with TypeScript

**Key Components**:
- `src/pages/index.tsx` - Anonymous URL creation landing page
- `src/pages/login/index.tsx` - User authentication page
- `src/pages/register/index.tsx` - User registration page
- `src/pages/urlentry/index.tsx` - Authenticated URL management dashboard
- `src/components/LoadingScreen.tsx` - Reusable loading component

**State Management**: React hooks (`useState`, `useEffect`)
**Styling**: Ant Design component library + custom CSS modules

### Backend Layer

**Technology**: Next.js API Routes (serverless functions)

**API Structure**:
```
/api
├── session/
│   └── index.ts          # Session validation
├── user/
│   ├── login.ts          # User login
│   ├── logout.ts         # User logout
│   └── register.ts       # User registration
└── urlentry/
    ├── index.ts          # Create & list URLs
    └── [entryHash].ts    # Get, update, delete URL
```

### Middleware Layer

**Session Middleware** (`src/middleware/withSession.ts`):
- Wraps API routes with session management
- Uses Iron Session for encrypted cookie-based sessions
- Provides `createSessionValidator` for protected routes

**Error Handling** (`src/middleware/errorWrapper.ts`):
- Catches and formats API errors
- Returns consistent error responses
- Logs errors for debugging

### Data Layer

**ORM**: Prisma Client
**Database**: PostgreSQL

**Schema**:
```prisma
model UrlEntry {
  id          Int      @id @default(autoincrement())
  hashKey     String   @unique
  targetUrl   String
  userId      String   @default("")
  name        String   @default("")
  description String   @default("")
  viewTimes   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now())
}

model User {
  id       String @id @default(cuid())
  email    String @unique
  password String
  name     String @default("")
}
```

### Utility Libraries

**Hash Generation** (`src/libs/hashUtil/`):
- Generates unique base62-encoded hash keys
- Used for creating short URL identifiers
- Collision-resistant

**Cache Service** (`src/libs/cacheService/`):
- In-memory cache for frequently accessed URLs
- Reduces database load
- Simple get/set/delete interface

**String Validation** (`src/libs/stringUtil/`):
- URL validation
- Email validation
- Input sanitization

**Password Security** (`src/libs/bycryptUtil/`):
- Password hashing with bcrypt
- Secure password comparison
- Salt generation

## Data Flow Patterns

### 1. URL Creation Flow

```
User Input (Long URL)
    ↓
Frontend Validation
    ↓
API Request: POST /api/urlentry
    ↓
Backend Validation (url-exist check)
    ↓
Generate Hash Key (base62)
    ↓
Store in Database (Prisma)
    ↓
Return Short URL to User
```

### 2. URL Redirection Flow

```
User Clicks Short URL
    ↓
GET /api/urlentry/[hashKey]
    ↓
Check In-Memory Cache
    ↓ (cache miss)
Query Database
    ↓
Cache Result
    ↓
Increment View Counter
    ↓
HTTP 307 Redirect to Target URL
```

### 3. Authentication Flow

```
User Submits Credentials
    ↓
POST /api/user/login
    ↓
Query User from Database
    ↓
Compare Passwords (bcrypt)
    ↓
Create Session (Iron Session)
    ↓
Set Encrypted Cookie
    ↓
Return Success Response
```

## Security Considerations

### Authentication & Authorization

- **Password Storage**: All passwords are hashed using bcrypt with automatic salt generation
- **Session Management**: Iron Session provides encrypted, signed cookies
- **Cookie Security**: 
  - HttpOnly cookies prevent XSS attacks
  - Secure flag enabled in production (HTTPS only)
  - SameSite protection against CSRF

### Input Validation

- **URL Validation**: Uses `url-exist` package to verify URLs are valid and reachable
- **Email Validation**: Uses `isemail` package for RFC-compliant email validation
- **SQL Injection Prevention**: Prisma ORM provides parameterized queries
- **XSS Prevention**: React automatically escapes output

### Authorization

- **Ownership Checks**: Users can only modify/delete their own URLs
- **Session Validation**: Protected routes check session validity
- **Database-Level Constraints**: Unique constraints on email and hashKey

## Caching Strategy

### In-Memory Cache

**Purpose**: Reduce database load for frequently accessed short URLs

**Implementation**:
```typescript
// Simple key-value store
const cache = new Map<string, string>()

getShortUrlCache(hashKey: string): string | undefined
setShortUrlCache(hashKey: string, targetUrl: string): void
deleteShortUrlCache(hashKey: string): void
```

**Cache Invalidation**:
- On URL update: Cache entry is deleted
- On URL deletion: Cache entry is removed
- No TTL: Cache persists until server restart or explicit deletion

**Limitations**:
- Not distributed: Cache is per-instance
- Memory-bounded: Could grow large with many URLs
- Cold start: Empty cache on deployment/restart

**Future Improvements**:
- Use Redis for distributed caching
- Implement TTL (Time To Live)
- Add cache size limits with LRU eviction

## Deployment Architecture

### Development Environment

```
Local Machine
├── Node.js Runtime
├── PostgreSQL (local or remote)
└── Hot-Reload Development Server
```

### Production Environment (GCP)

```
GitHub Repository
    ↓ (push to main)
GitHub Actions CI/CD
    ↓
Build Docker Image
    ↓
Push to Google Container Registry
    ↓
Deploy to Cloud Run
    ↓
Cloud Run Instance(s)
    ↓
Cloud SQL (PostgreSQL)
```

**Infrastructure**:
- **Cloud Run**: Serverless container platform
  - Auto-scaling based on traffic
  - Pay-per-use pricing
  - Automatic HTTPS
- **Cloud SQL**: Managed PostgreSQL
  - Automatic backups
  - High availability
  - Private connection from Cloud Run

## Performance Considerations

### Frontend Performance

- **Server-Side Rendering (SSR)**: Next.js pre-renders pages for faster initial load
- **Code Splitting**: Automatic code splitting per page
- **Static Assets**: Optimized images and fonts
- **Bundle Size**: Ant Design provides tree-shaking

### Backend Performance

- **Caching Layer**: Reduces database queries for popular URLs
- **Connection Pooling**: Prisma manages PostgreSQL connections
- **Serverless**: Cloud Run scales automatically with demand
- **CDN**: Static assets served from edge locations

### Database Performance

- **Indexes**: 
  - Unique index on `UrlEntry.hashKey` for fast lookups
  - Unique index on `User.email` for authentication
- **Query Optimization**: Prisma generates optimized SQL
- **Connection Management**: Connection pooling prevents exhaustion

## Scalability

### Current Limitations

1. **In-Memory Cache**: Not shared across instances
2. **Single Database**: Could become bottleneck
3. **No CDN**: All requests go through application

### Scaling Strategies

**Horizontal Scaling**:
- Cloud Run automatically adds instances under load
- Stateless design allows unlimited horizontal scaling
- Session cookies eliminate need for shared session storage

**Database Scaling**:
- Cloud SQL read replicas for read-heavy workloads
- Connection pooling (PgBouncer) for more connections
- Partitioning for very large URL tables

**Cache Scaling**:
- Migrate to Redis for distributed caching
- Add CDN for static assets and popular redirects
- Implement edge caching with Cloud CDN

## Monitoring & Observability

### Logging

- **Console Logs**: Development debugging
- **Cloud Run Logs**: Production logging
- **Error Tracking**: API errors logged with stack traces

### Metrics

- **Cloud Run Metrics**:
  - Request count
  - Response time
  - Error rate
  - Instance count
- **Database Metrics**:
  - Connection count
  - Query performance
  - Storage usage

### Future Improvements

- Add application performance monitoring (APM)
- Implement distributed tracing
- Add custom metrics for business KPIs
- Set up alerting for errors and performance degradation

## Testing Strategy

### Current Tests

- **Unit Tests**: Utility functions (hash, string, bcrypt)
- **Test Framework**: Jest with TypeScript support
- **Coverage**: Core utility libraries

### Testing Gaps

- No integration tests for API routes
- No end-to-end tests for user flows
- No database integration tests
- No performance tests

### Recommended Testing Approach

1. **Unit Tests**: All utility functions (✅ implemented)
2. **API Tests**: Test each endpoint with mock database
3. **Integration Tests**: Test with real database
4. **E2E Tests**: Full user flows with Playwright/Cypress
5. **Load Tests**: Performance under high traffic

## Development Workflow

### Local Development

1. Clone repository
2. Install dependencies (`npm install`)
3. Set up PostgreSQL database
4. Configure `.env.development`
5. Generate Prisma client
6. Run migrations
7. Start development server (`npm run dev`)

### Making Changes

1. Create feature branch
2. Make code changes
3. Write/update tests
4. Run linter (`npm run lint`)
5. Run tests (`npm run test`)
6. Commit and push
7. Create pull request to `main`

### Deployment

1. Merge PR to `main` branch
2. GitHub Actions triggers automatically
3. Runs tests and builds Docker image
4. Pushes to Google Container Registry
5. Deploys to Cloud Run
6. Verifies deployment health

## Code Organization Best Practices

### File Structure Conventions

- **Pages**: Each route is a file in `src/pages/`
- **API Routes**: Backend endpoints in `src/pages/api/`
- **Components**: Reusable React components in `src/components/`
- **Libraries**: Pure utility functions in `src/libs/`
- **Middleware**: Request/response processors in `src/middleware/`
- **Types**: TypeScript interfaces in `src/interfaces/`

### Naming Conventions

- **Files**: kebab-case for directories, camelCase for TypeScript files
- **Components**: PascalCase (e.g., `LoadingScreen.tsx`)
- **Functions**: camelCase (e.g., `createHashString`)
- **Types**: PascalCase (e.g., `SessionUser`)
- **Constants**: UPPER_SNAKE_CASE

### Code Style

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with TypeScript and React rules
- **Formatting**: Consistent indentation and spacing
- **Comments**: Minimal, self-documenting code preferred

## Future Architecture Improvements

### Short Term

1. **Distributed Caching**: Replace in-memory cache with Redis
2. **API Tests**: Add comprehensive API endpoint tests
3. **Rate Limiting**: Prevent abuse of URL creation
4. **URL Analytics**: Track more detailed usage metrics

### Medium Term

1. **Custom Domains**: Allow users to use their own domains
2. **URL Expiration**: Time-limited short URLs
3. **QR Codes**: Generate QR codes for short URLs
4. **Bulk Operations**: Create/import multiple URLs at once

### Long Term

1. **Microservices**: Split into separate services (auth, URL, analytics)
2. **GraphQL API**: Alternative to REST API
3. **Real-Time Dashboard**: WebSocket-based live analytics
4. **Mobile Apps**: Native iOS and Android applications
5. **API Keys**: Programmatic access with API authentication
