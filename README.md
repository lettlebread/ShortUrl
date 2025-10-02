# Short URL Service

A full-stack web application and HTTP API for creating and managing short URL entries. This service allows users to convert long URLs into short, shareable links with optional user authentication for managing personal URL collections.

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Architecture Documentation](ARCHITECTURE.md)** - Deep dive into system design
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to this project

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Install](#install)
- [Deploy](#deploy)
- [Usage](#usage)
  - [Web Application](#web-application)
  - [HTTP API](#http-api)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Contact](#contact)

## Overview

This project is a URL shortening service built with modern web technologies. It provides both a user-friendly web interface and a RESTful API for programmatic access. Users can create short URLs anonymously or sign up for an account to manage their URL entries with additional features like editing, tracking view counts, and organizing links with names and descriptions.

### Key Features

- **URL Shortening**: Convert long URLs into short, easy-to-share links
- **User Authentication**: Sign up and log in to manage personal URL collections
- **URL Management**: Edit, delete, and organize your short URLs
- **View Tracking**: Monitor how many times each short URL has been accessed
- **Metadata Support**: Add custom names and descriptions to your URLs
- **Anonymous Creation**: Create short URLs without signing up
- **RESTful API**: Programmatic access to all features
- **Production Ready**: Deployed on Google Cloud Platform with CI/CD

## Technology Stack

### Frontend
- **Next.js 13**: React framework for server-side rendering and static site generation
- **React 18**: UI library for building interactive interfaces
- **TypeScript**: Type-safe JavaScript for better code quality
- **Ant Design**: Professional UI component library
- **CSS Modules**: Scoped styling for components

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **PostgreSQL**: Relational database for data persistence
- **Prisma**: Modern ORM for database operations
- **Iron Session**: Secure, stateless session management with encrypted cookies
- **bcrypt**: Password hashing for secure authentication

### Infrastructure & DevOps
- **Docker**: Containerization for consistent deployments
- **Google Cloud Platform**: Production hosting
  - Cloud Run: Serverless container deployment
  - Cloud SQL: Managed PostgreSQL database
- **GitHub Actions**: Automated CI/CD pipeline
- **Jest**: Unit and integration testing

## Architecture

### Application Structure

```
ShortUrl/
├── src/
│   ├── pages/              # Next.js pages and API routes
│   │   ├── index.tsx       # Home page (anonymous URL creation)
│   │   ├── login/          # User login page
│   │   ├── register/       # User registration page
│   │   ├── urlentry/       # Authenticated URL management page
│   │   └── api/            # API endpoints
│   │       ├── session/    # Session validation
│   │       ├── urlentry/   # URL CRUD operations
│   │       └── user/       # Authentication endpoints
│   ├── components/         # Reusable React components
│   ├── libs/               # Utility libraries
│   │   ├── dbService/      # Prisma database client
│   │   ├── cacheService/   # In-memory caching for URLs
│   │   ├── hashUtil/       # Hash generation for short URLs
│   │   ├── stringUtil/     # String validation utilities
│   │   └── bycryptUtil/    # Password hashing utilities
│   ├── middleware/         # Express-like middleware
│   │   ├── withSession.ts  # Session validation middleware
│   │   └── errorWrapper.ts # Error handling wrapper
│   ├── interfaces/         # TypeScript type definitions
│   ├── clientLib/          # Client-side API helpers
│   ├── database/           # Prisma schema and migrations
│   └── styles/             # Global styles
├── __tests__/              # Unit tests
├── public/                 # Static assets
└── Dockerfile              # Container configuration
```

### Data Flow

1. **URL Creation Flow**:
   - User submits a long URL through the web interface or API
   - System validates the URL and generates a unique hash key (using base62 encoding)
   - URL entry is stored in PostgreSQL with metadata
   - Short URL is returned to the user
   - Entry is cached for fast retrieval

2. **URL Redirection Flow**:
   - User accesses short URL (e.g., `/api/urlentry/abc123`)
   - System checks cache first for performance
   - If not cached, queries database for the hash key
   - Updates view count in database
   - Redirects user to the target URL (HTTP 307)

3. **Authentication Flow**:
   - User registers with email and password
   - Password is hashed with bcrypt before storage
   - On login, credentials are validated
   - Session is created using encrypted cookie (Iron Session)
   - Protected routes validate session for access control

### Database Schema

The application uses two main database tables:

**UrlEntry**:
- `id`: Auto-incrementing primary key
- `hashKey`: Unique identifier for the short URL
- `targetUrl`: The original long URL
- `userId`: Owner of the URL (empty string for anonymous)
- `name`: Custom name for the URL entry
- `description`: Additional notes about the URL
- `viewTimes`: Counter for tracking access
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last modification

**User**:
- `id`: UUID primary key
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `name`: User's display name

### Caching Strategy

The application implements an in-memory cache for frequently accessed short URLs to reduce database load and improve response times. When a short URL is accessed, the system:
1. Checks the cache first
2. On cache miss, queries the database
3. Stores the result in cache for subsequent requests
4. Invalidates cache on URL updates or deletions

## Install
To run or deploy this service on your local machine, follow the instructions below.

### Requirements
* **Node.js** >= 14 (v18 recommended)
* **npm** or **yarn** package manager
* **PostgreSQL** instance (local or remote)
* **Git** for cloning the repository

### Steps

#### 1. Clone this repository and install dependencies
```bash
$ git clone https://github.com/lettlebread/ShortUrl.git

$ cd ShortUrl

$ npm install
```

This will install all the necessary dependencies including Next.js, React, Prisma, and other packages.

#### 2. Prepare a PostgreSQL connection string
The database connection string follows the PostgreSQL URL format:
```
postgresql://<user>:<password>@<net_location>:<port>/<db_name>
```

**Example:**
```
postgresql://myuser:mypassword@localhost:5432/shorturldb
```

Make sure your PostgreSQL database is running and accessible.

#### 3. Create .env file
Create a text file named `.env.development` in the repository root directory with the following keys:

**Required environment variables:**
* `DATABASE_URL`: PostgreSQL connection string
* `COOKIE_PASSWORD`: A string longer than 32 characters (used for encrypting session cookies)

**Example `.env.development` file:**
```env
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/shorturldb
COOKIE_PASSWORD=my-super-secret-password-that-is-at-least-32-characters-long
```

**Security Note**: Never commit your `.env` files to version control. They contain sensitive credentials.

#### 4. Generate Prisma client
This command must be run when:
- Installing the service for the first time
- After modifying the Prisma schema file (`./src/database/schema.prisma`)

```bash
$ DATABASE_URL="<postgres_connect_string>" \
  npx prisma generate --schema="src/database/schema.prisma"
```

**Alternative:** If you've already set `DATABASE_URL` in your `.env.development` file:
```bash
$ npx prisma generate --schema="src/database/schema.prisma"
```

#### 5. Initialize the database
Run Prisma migrations to create the database tables:
```bash
$ npx prisma migrate dev --schema="src/database/schema.prisma"
```

This will create the `UrlEntry` and `User` tables in your database.

## Deploy
### Local Development

For testing and development, you can start the service with:
```bash
$ npm run dev
```

This command will:
1. Build the Next.js application
2. Start the development server
3. Listen on port 3000 by default
4. Enable hot-reloading for code changes

You can then access the application at `http://localhost:3000`

**Available Scripts:**
- `npm run dev`: Start development server
- `npm run build`: Build production bundle
- `npm run start`: Start production server
- `npm run lint`: Run ESLint on TypeScript files
- `npm run test`: Run Jest tests

### Docker Deployment

You can also build this service as a Docker image for consistent deployment across environments.

#### Build the Docker image:
```bash
$ docker build -t short-url-service .
```

#### Run the container:
```bash
$ docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="<postgres_connect_string>" \
  -e COOKIE_PASSWORD="<cookie_password>" \
  short-url-service
```

**Docker Environment Variables:**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `COOKIE_PASSWORD`: Session encryption key (required)
- `NODE_ENV`: Set to `production` for production builds

The containerized service will be accessible at `http://localhost:3000`

### Production
#### Service instance
This project deploys the service instance of production version on **GCP Cloud Run**.

Since this project is hooked with GitHub Actions, you can deploy a new version to the production environment by starting a pull request to the `main` branch.

Once the pull request is merged, the GitHub Actions workflow will automatically check, build, and deploy the service using GCP services.

The production version service can be accessed here: [https://short-url-yisp5qgdea-uc.a.run.app](https://short-url-yisp5qgdea-uc.a.run.app)

**Note**: Only commits to the `main` branch will trigger deployment to the production environment.

##### GitHub Actions Configuration
* The GitHub Actions workflow is defined in `.github/workflows/deploy-cloud-run.yml`
* Secrets used in GitHub Actions are stored in `Settings → Secrets and Variables → Actions`
* The workflow performs linting, testing, building, and deployment steps

#### Database
The production database is a PostgreSQL instance running on **GCP Cloud SQL**.

The service instance on Cloud Run has the necessary permissions to access the database securely.

For database configuration changes or access, please contact the GCP project owner.

## Project Structure

### Key Directories

- **`src/pages/`**: Next.js pages and API routes (follows Next.js file-based routing)
- **`src/components/`**: Reusable React components (e.g., LoadingScreen)
- **`src/libs/`**: Utility libraries for common operations
- **`src/middleware/`**: Express-style middleware for session and error handling
- **`src/interfaces/`**: TypeScript type definitions and interfaces
- **`src/database/`**: Prisma schema definitions
- **`__tests__/`**: Unit tests for utility functions
- **`public/`**: Static assets served directly

### API Design Pattern

The API follows RESTful conventions:
- **POST**: Create new resources
- **GET**: Retrieve resources
- **PATCH**: Update existing resources
- **DELETE**: Remove resources

All API routes are located under `/api/` and return JSON responses. Authentication is handled via session cookies, and protected endpoints return 401 Unauthorized when accessed without valid authentication.

## Usage
### Web Application
Users can access the web interface by navigating to the service URL in their browser. The application provides an intuitive interface for all URL shortening features.

#### Pages

##### Home page
* **Path**: `/` (root)
* **Purpose**: Landing page for anonymous users
* **Features**:
  - Create short URLs without signing up
  - Access sign in/sign up links
  - Short URLs created here are not associated with any user account
* **Behavior**: 
  - Accessing this page while logged in will redirect to `/urlentry`
  - Ideal for quick, one-time URL shortening

##### Sign in page
* **Path**: `/login`
* **Purpose**: User authentication
* **Features**:
  - Email and password login form
  - Error handling for invalid credentials
* **Behavior**:
  - Successful login redirects to `/urlentry`
  - Accessing while already logged in redirects to `/urlentry`

##### Sign up page
* **Path**: `/register`
* **Purpose**: New user registration
* **Features**:
  - Email and password registration form
  - Input validation
  - Secure password storage (bcrypt hashing)
* **Behavior**:
  - Successful registration redirects to `/login`
  - Accessing while already logged in redirects to `/urlentry`

##### Short URL management page
* **Path**: `/urlentry`
* **Purpose**: Authenticated URL management dashboard
* **Features**:
  - View all your short URLs in a list
  - See detailed information for each URL:
    - Hash key (short URL identifier)
    - Target URL
    - Custom name
    - Description
    - View count
    - Creation and update timestamps
  - Edit URL properties (target, name, description)
  - Delete URL entries
  - Create new short URLs with metadata
  - Copy short URLs to clipboard
  - Logout functionality
* **Behavior**:
  - Accessing without authentication redirects to `/`
  - Requires valid session cookie

### HTTP API
The service provides a RESTful API for programmatic access to all features. All API endpoints return JSON responses and use standard HTTP status codes.

**Base URL**: `http://localhost:3000` (development) or your deployed service URL

**Authentication**: Most endpoints require authentication via session cookies. Include credentials in requests:
```javascript
fetch('/api/endpoint', {
  method: 'POST',
  credentials: 'include', // Important for cookie-based auth
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

#### Session Management

##### Check user session
Validates the current session and returns user information.

* **Endpoint**: `/api/session/`
* **Method**: `POST`
* **Authentication**: Required
* **Request body**: None
* **Response**:
  * **Status**: `200 OK`
  * **Body**:
    ```json
    {
      "isLoggedIn": true,
      "id": "ckx1234567890",
      "email": "user@example.com"
    }
    ```
* **Error responses**:
  * `401 Unauthorized`: Invalid or missing session

#### URL Entry Operations

##### Redirect to target URL
Redirects the short URL to its target destination and increments the view counter.

* **Endpoint**: `/api/urlentry/[entryHash]`
* **Method**: `GET`
* **Authentication**: Not required
* **Parameters**:
  * `entryHash`: The unique hash key of the short URL (in path)
* **Response**:
  * **Status**: `307 Temporary Redirect`
  * **Headers**: `Location: <target-url>`
* **Error responses**:
  * `404 Not Found`: Hash key does not exist

**Example**: Accessing `/api/urlentry/abc123` redirects to the stored target URL.

##### Create a short URL entry
Creates a new short URL. Can be used with or without authentication.

* **Endpoint**: `/api/urlentry`
* **Method**: `POST`
* **Authentication**: Optional (if authenticated, URL is associated with user)
* **Request body**:
  ```json
  {
    "targetUrl": "https://example.com/very/long/url",
    "name": "My Important Link",
    "description": "This is a description of the link"
  }
  ```
  * `targetUrl` (required): The long URL to shorten
  * `name` (optional): Custom name for the URL entry
  * `description` (optional): Additional notes about the URL

* **Response**:
  * **Status**: `200 OK`
  * **Body**:
    ```json
    {
      "id": 1,
      "createdAt": "2023-01-15T10:30:00.000Z",
      "updatedAt": "2023-01-15T10:30:00.000Z",
      "userId": "ckx1234567890",
      "hashKey": "abc123",
      "targetUrl": "https://example.com/very/long/url",
      "name": "My Important Link",
      "viewTimes": 0,
      "description": "This is a description of the link"
    }
    ```
* **Error responses**:
  * `400 Bad Request`: Invalid URL format
  * `404 Not Found`: Database error

##### Get user's URL entries
Retrieves all URL entries belonging to the authenticated user.

* **Endpoint**: `/api/urlentry`
* **Method**: `GET`
* **Authentication**: Required
* **Request body**: None
* **Response**:
  * **Status**: `200 OK`
  * **Body**:
    ```json
    {
      "urlEntries": [
        {
          "hashKey": "abc123",
          "targetUrl": "https://example.com/url1",
          "name": "Link 1",
          "createdAt": "2023-01-15T10:30:00.000Z",
          "updatedAt": "2023-01-15T10:30:00.000Z",
          "description": "Description 1",
          "viewTimes": 42
        },
        {
          "hashKey": "def456",
          "targetUrl": "https://example.com/url2",
          "name": "Link 2",
          "createdAt": "2023-01-16T14:20:00.000Z",
          "updatedAt": "2023-01-16T14:20:00.000Z",
          "description": "Description 2",
          "viewTimes": 17
        }
      ]
    }
    ```
* **Error responses**:
  * `401 Unauthorized`: Not authenticated

##### Update a short URL entry
Updates properties of an existing short URL. Only the owner can update their URLs.

* **Endpoint**: `/api/urlentry/[entryHash]`
* **Method**: `PATCH`
* **Authentication**: Required
* **Parameters**:
  * `entryHash`: The unique hash key of the short URL (in path)
* **Request body**:
  ```json
  {
    "targetUrl": "https://example.com/updated/url",
    "name": "Updated Name",
    "description": "Updated description"
  }
  ```
  * `targetUrl` (required): New target URL
  * `name` (optional): Updated name
  * `description` (optional): Updated description

* **Response**:
  * **Status**: `200 OK`
  * **Body**: Updated URL entry object (same format as create response)
* **Error responses**:
  * `400 Bad Request`: Invalid URL or no permission
  * `401 Unauthorized`: Not authenticated
  * `404 Not Found`: Entry not found

##### Delete a short URL entry
Permanently deletes a short URL. Only the owner can delete their URLs.

* **Endpoint**: `/api/urlentry/[entryHash]`
* **Method**: `DELETE`
* **Authentication**: Required
* **Parameters**:
  * `entryHash`: The unique hash key of the short URL (in path)
* **Request body**: None
* **Response**:
  * **Status**: `200 OK`
  * **Body**: `{}`
* **Error responses**:
  * `400 Bad Request`: No permission or entry not found
  * `401 Unauthorized`: Not authenticated

#### User Authentication

##### User registration
Creates a new user account.

* **Endpoint**: `/api/user/register`
* **Method**: `POST`
* **Authentication**: Not required
* **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
  * `email` (required): Valid email address
  * `password` (required): Password (will be hashed with bcrypt)

* **Response**:
  * **Status**: `200 OK`
  * **Body**: `{}`
* **Error responses**:
  * `400 Bad Request`: Invalid email format or email already exists
  * `500 Internal Server Error`: Database error

##### User login
Authenticates a user and creates a session.

* **Endpoint**: `/api/user/login`
* **Method**: `POST`
* **Authentication**: Not required
* **Request body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

* **Response**:
  * **Status**: `200 OK`
  * **Headers**: Sets session cookie
  * **Body**: `{}`
* **Error responses**:
  * `400 Bad Request`: Invalid credentials
  * `404 Not Found`: User not found

##### User logout
Destroys the current session.

* **Endpoint**: `/api/user/logout`
* **Method**: `POST`
* **Authentication**: Required
* **Request body**: None
* **Response**:
  * **Status**: `200 OK`
  * **Body**: `{}`

### Using the Short URLs

Once created, short URLs can be accessed in two ways:

1. **Direct browser access**: Navigate to `<service-url>/api/urlentry/<hashKey>`
   - Example: `https://short-url-yisp5qgdea-uc.a.run.app/api/urlentry/abc123`
   - Browser will be redirected to the target URL

2. **API access**: Send GET request to the same endpoint for programmatic redirection

**Note**: Every access increments the `viewTimes` counter, allowing you to track URL usage.

## Development Guide

### Running Tests

The project uses Jest for testing. Run tests with:
```bash
$ npm run test
```

Tests are located in the `__tests__/` directory and cover utility functions like hash generation, string validation, and password hashing.

### Linting

ESLint is configured for TypeScript and React. Run the linter with:
```bash
$ npm run lint
```

Configuration is in `.eslintrc.json`. The linter checks:
- TypeScript syntax and type safety
- React best practices
- Code style consistency

### Database Management

**View database schema**:
```bash
$ npx prisma studio --schema="src/database/schema.prisma"
```

This opens a GUI for browsing and editing database records.

**Create a migration** after schema changes:
```bash
$ npx prisma migrate dev --name "description_of_change" --schema="src/database/schema.prisma"
```

**Reset database** (warning: deletes all data):
```bash
$ npx prisma migrate reset --schema="src/database/schema.prisma"
```

### Adding New Features

1. **New API endpoint**: Create a file in `src/pages/api/`
2. **New page**: Create a file in `src/pages/`
3. **Utilities**: Add to appropriate library in `src/libs/`
4. **Middleware**: Add to `src/middleware/`
5. **Types**: Define in `src/interfaces/`

Follow the existing patterns for consistency.

## Troubleshooting

### Common Issues

**"Module not found" errors**:
```bash
$ npm install
$ npx prisma generate --schema="src/database/schema.prisma"
```

**Database connection errors**:
- Verify `DATABASE_URL` in `.env.development`
- Ensure PostgreSQL is running
- Check network connectivity to database

**Session/authentication issues**:
- Verify `COOKIE_PASSWORD` is set and > 32 characters
- Clear browser cookies
- Check that cookies are enabled

**Port already in use**:
```bash
$ lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
$ npm run dev
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run linting and tests
5. Submit a pull request to `main`

## License

This project is private and not licensed for public use.

## Contact

For questions, issues, or access requests, please contact the repository owner.
