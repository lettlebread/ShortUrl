# System Diagrams

This file contains ASCII diagrams to help visualize the Short URL Service architecture.

## Overall System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  Browser   │  │  Mobile    │  │  Desktop   │  │   API      │ │
│  │  (React)   │  │  Device    │  │    App     │  │  Clients   │ │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘ │
└────────┼───────────────┼───────────────┼───────────────┼────────┘
         │               │               │               │
         │          HTTPS/HTTP           │               │
         └───────────────┴───────────────┴───────────────┘
                              │
┌─────────────────────────────┼─────────────────────────────────────┐
│                    APPLICATION LAYER                               │
│                              │                                     │
│  ┌──────────────────────────▼──────────────────────────────────┐  │
│  │              Next.js Application (Node.js)                   │  │
│  │                                                               │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │              Frontend (React SSR)                      │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │  │  │
│  │  │  │  Home    │  │  Login/  │  │   URL Management     │ │  │  │
│  │  │  │  Page    │  │ Register │  │      Dashboard       │ │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────────────────┘ │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                              │                                │  │
│  │  ┌───────────────────────────▼─────────────────────────────┐ │  │
│  │  │              API Routes (Serverless)                    │ │  │
│  │  │                                                          │ │  │
│  │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │  │
│  │  │  │   Session    │  │     URL      │  │     User     │  │ │  │
│  │  │  │  Management  │  │ CRUD & Short │  │     Auth     │  │ │  │
│  │  │  │              │  │  Redirects   │  │              │  │ │  │
│  │  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │  │
│  │  └──────────────────────────┬───────────────────────────────┘ │  │
│  │                             │                                 │  │
│  │  ┌──────────────────────────▼───────────────────────────────┐ │  │
│  │  │                   Middleware Layer                       │ │  │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐  │ │  │
│  │  │  │  Session    │  │    Error    │  │  Request/      │  │ │  │
│  │  │  │ Validation  │  │  Handling   │  │  Response      │  │ │  │
│  │  │  └─────────────┘  └─────────────┘  └────────────────┘  │ │  │
│  │  └──────────────────────────┬───────────────────────────────┘ │  │
│  │                             │                                 │  │
│  │  ┌──────────────────────────▼───────────────────────────────┐ │  │
│  │  │                  Service Layer                           │ │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │ │  │
│  │  │  │  Prisma  │  │  Cache   │  │  bcrypt  │  │  Hash   │ │ │  │
│  │  │  │   ORM    │  │ Service  │  │  Utils   │  │  Utils  │ │ │  │
│  │  │  └─────┬────┘  └────┬─────┘  └──────────┘  └─────────┘ │ │  │
│  │  └────────┼────────────┼──────────────────────────────────┘ │  │
│  └───────────┼────────────┼────────────────────────────────────┘  │
│              │            │                                        │
│              │        ┌───▼────┐                                   │
│              │        │  RAM   │                                   │
│              │        │ Cache  │                                   │
│              │        └────────┘                                   │
└──────────────┼───────────────────────────────────────────────────┘
               │
┌──────────────▼────────────────────────────────────────────────────┐
│                         DATA LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                            │  │
│  │  ┌──────────────────┐         ┌──────────────────────────┐ │  │
│  │  │   UrlEntry       │         │        User              │ │  │
│  │  │ ┌──────────────┐ │         │  ┌─────────────────────┐ │ │  │
│  │  │ │ id           │ │         │  │ id (UUID)           │ │ │  │
│  │  │ │ hashKey      │ │         │  │ email (unique)      │ │ │  │
│  │  │ │ targetUrl    │ │         │  │ password (hashed)   │ │ │  │
│  │  │ │ userId       │ │         │  │ name                │ │ │  │
│  │  │ │ name         │ │         │  └─────────────────────┘ │ │  │
│  │  │ │ description  │ │         │                          │ │  │
│  │  │ │ viewTimes    │ │         └──────────────────────────┘ │  │
│  │  │ │ createdAt    │ │                                      │  │
│  │  │ │ updatedAt    │ │                                      │  │
│  │  │ └──────────────┘ │                                      │  │
│  │  └──────────────────┘                                      │  │
│  └─────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

## Request Flow: Creating a Short URL

```
┌─────────┐                                                    
│  User   │                                                    
└────┬────┘                                                    
     │ 1. Enters long URL                                     
     │    in web form                                         
     ▼                                                         
┌─────────────────┐                                           
│  React Frontend │                                           
│   (index.tsx)   │                                           
└────────┬────────┘                                           
         │ 2. POST /api/urlentry                             
         │    {targetUrl: "..."}                              
         ▼                                                     
    ┌────────────────────┐                                    
    │  API Route Handler │                                    
    │  (urlentry/index)  │                                    
    └────────┬───────────┘                                    
             │ 3. Validate URL                                
             │    (url-exist)                                 
             ▼                                                 
        ┌─────────────┐                                       
        │ Hash Utils  │                                       
        │             │                                       
        └──────┬──────┘                                       
               │ 4. Generate unique                           
               │    hash key (base62)                         
               ▼                                               
        ┌─────────────┐                                       
        │   Prisma    │                                       
        │     ORM     │                                       
        └──────┬──────┘                                       
               │ 5. INSERT INTO                               
               │    UrlEntry                                  
               ▼                                               
        ┌─────────────┐                                       
        │ PostgreSQL  │                                       
        │  Database   │                                       
        └──────┬──────┘                                       
               │ 6. Return new entry                          
               ▼                                               
        ┌─────────────┐                                       
        │ API Handler │                                       
        └──────┬──────┘                                       
               │ 7. JSON response                             
               │    {hashKey: "abc123"}                       
               ▼                                               
        ┌─────────────┐                                       
        │   Frontend  │                                       
        └──────┬──────┘                                       
               │ 8. Display short URL                         
               ▼                                               
        ┌─────────────┐                                       
        │    User     │                                       
        └─────────────┘                                       
```

## Request Flow: URL Redirection

```
┌─────────┐                                                    
│  User   │                                                    
└────┬────┘                                                    
     │ 1. Clicks short URL                                    
     │    /api/urlentry/abc123                                
     ▼                                                         
┌─────────────────┐                                           
│  API Route      │                                           
│  [entryHash].ts │                                           
└────────┬────────┘                                           
         │ 2. Extract hashKey                                 
         │    (abc123)                                        
         ▼                                                     
    ┌────────────────────┐                                    
    │   Cache Service    │                                    
    │                    │                                    
    └────────┬───────────┘                                    
             │ 3. Check cache                                 
             │                                                 
             ├─ Cache Hit ────────┐                          
             │                    │                           
             └─ Cache Miss        │                           
                     │            │                           
                     ▼            │                           
              ┌─────────────┐    │                           
              │   Prisma    │    │                           
              │     ORM     │    │                           
              └──────┬──────┘    │                           
                     │ 4. Query  │                           
                     │    DB     │                           
                     ▼           │                           
              ┌─────────────┐   │                           
              │ PostgreSQL  │   │                           
              │  Database   │   │                           
              └──────┬──────┘   │                           
                     │ 5. Return│                           
                     │   target │                           
                     │   URL    │                           
                     ▼          │                           
              ┌─────────────┐  │                           
              │   Cache     │  │                           
              │   Service   │  │                           
              └──────┬──────┘  │                           
                     │ 6. Store│                           
                     │   in    │                           
                     │   cache │                           
                     └────┬────┘                           
                          │                                
                ┌─────────┴────────┐                       
                │                  │                       
                ▼                  ▼                       
         ┌────────────┐     ┌────────────┐               
         │  Increment │     │  Get URL   │               
         │ viewTimes  │     │            │               
         └─────┬──────┘     └─────┬──────┘               
               │                  │                       
               └────────┬─────────┘                       
                        │ 7. HTTP 307                     
                        │    Redirect                     
                        ▼                                 
                 ┌─────────────┐                         
                 │   Browser   │                         
                 │  redirects  │                         
                 │  to target  │                         
                 └──────┬──────┘                         
                        │                                 
                        ▼                                 
                 ┌─────────────┐                         
                 │  Target     │                         
                 │  Website    │                         
                 └─────────────┘                         
```

## Authentication Flow

```
┌─────────┐                                                   
│  User   │                                                   
└────┬────┘                                                   
     │ 1. Submit login form                                  
     │    (email, password)                                  
     ▼                                                        
┌─────────────────┐                                          
│  Login Page     │                                          
│  (login/index)  │                                          
└────────┬────────┘                                          
         │ 2. POST /api/user/login                           
         ▼                                                    
    ┌────────────────────┐                                   
    │  Login API Handler │                                   
    └────────┬───────────┘                                   
             │ 3. Validate input                             
             ▼                                                
        ┌─────────────┐                                      
        │   Prisma    │                                      
        │     ORM     │                                      
        └──────┬──────┘                                      
               │ 4. Query user                               
               │    by email                                 
               ▼                                              
        ┌─────────────┐                                      
        │ PostgreSQL  │                                      
        └──────┬──────┘                                      
               │ 5. Return user                              
               │    with hashed                              
               │    password                                 
               ▼                                              
        ┌─────────────┐                                      
        │   bcrypt    │                                      
        │    Utils    │                                      
        └──────┬──────┘                                      
               │ 6. Compare                                  
               │    passwords                                
               ▼                                              
        ┌─────────────┐                                      
        │ Iron Session│                                      
        │  Middleware │                                      
        └──────┬──────┘                                      
               │ 7. Create session                           
               │    Encrypt & sign                           
               │    cookie                                   
               ▼                                              
        ┌─────────────┐                                      
        │   Browser   │                                      
        └──────┬──────┘                                      
               │ 8. Store cookie                             
               │    All future requests                      
               │    include cookie                           
               ▼                                              
        ┌─────────────┐                                      
        │ Authenticated│                                     
        │    Session  │                                      
        └─────────────┘                                      
```

## Deployment Pipeline

```
┌──────────────────┐                                          
│  Developer       │                                          
│  Local Machine   │                                          
└────────┬─────────┘                                          
         │ 1. git push to main                               
         ▼                                                     
┌─────────────────────────────────────────┐                  
│         GitHub Repository                │                  
│         (main branch)                    │                  
└────────┬────────────────────────────────┘                  
         │ 2. Webhook triggers                               
         ▼                                                     
┌──────────────────────────────────────────┐                 
│       GitHub Actions                      │                 
│  ┌────────────────────────────────────┐  │                 
│  │ Step 1: Checkout code              │  │                 
│  └────────────────────────────────────┘  │                 
│  ┌────────────────────────────────────┐  │                 
│  │ Step 2: Run tests                  │  │                 
│  └────────────────────────────────────┘  │                 
│  ┌────────────────────────────────────┐  │                 
│  │ Step 3: Run linter                 │  │                 
│  └────────────────────────────────────┘  │                 
│  ┌────────────────────────────────────┐  │                 
│  │ Step 4: Build Docker image         │  │                 
│  └────────────────────────────────────┘  │                 
│  ┌────────────────────────────────────┐  │                 
│  │ Step 5: Push to GCR                │  │                 
│  └────────────────────────────────────┘  │                 
│  ┌────────────────────────────────────┐  │                 
│  │ Step 6: Deploy to Cloud Run        │  │                 
│  └────────────────────────────────────┘  │                 
└────────┬─────────────────────────────────┘                 
         │ 3. Push container                                 
         ▼                                                     
┌──────────────────────────────────────────┐                 
│  Google Container Registry                │                 
└────────┬─────────────────────────────────┘                 
         │ 4. Pull & deploy                                  
         ▼                                                     
┌──────────────────────────────────────────┐                 
│       Google Cloud Run                    │                 
│  ┌────────────────────────────────────┐  │                 
│  │  Container Instance(s)             │  │                 
│  │  - Auto-scaling                    │  │                 
│  │  - Load balancing                  │  │                 
│  │  - HTTPS enabled                   │  │                 
│  └────────┬───────────────────────────┘  │                 
└───────────┼──────────────────────────────┘                 
            │ 5. Connect to database                         
            ▼                                                  
┌──────────────────────────────────────────┐                 
│       Google Cloud SQL                    │                 
│  (Managed PostgreSQL)                     │                 
└───────────────────────────────────────────┘                 
```

## Component Dependencies

```
┌─────────────────────────────────────────────────┐
│               External Dependencies              │
├─────────────────────────────────────────────────┤
│ • Next.js (Framework)                           │
│ • React (UI Library)                            │
│ • Ant Design (Component Library)                │
│ • Prisma (ORM)                                  │
│ • Iron Session (Session Management)             │
│ • bcrypt (Password Hashing)                     │
│ • url-exist (URL Validation)                    │
│ • base62 (Hash Encoding)                        │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│            Application Components                │
├─────────────────────────────────────────────────┤
│  Pages (Frontend)                               │
│   ├─ index.tsx (Home)                           │
│   ├─ login/index.tsx                            │
│   ├─ register/index.tsx                         │
│   └─ urlentry/index.tsx                         │
│                                                  │
│  API Routes (Backend)                           │
│   ├─ /api/session                               │
│   ├─ /api/user/*                                │
│   └─ /api/urlentry/*                            │
│                                                  │
│  Components (Reusable)                          │
│   └─ LoadingScreen.tsx                          │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│              Middleware Layer                    │
├─────────────────────────────────────────────────┤
│ • withSession (Authentication)                  │
│ • createSessionValidator (Authorization)        │
│ • errorWrapper (Error Handling)                 │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│              Service Layer                       │
├─────────────────────────────────────────────────┤
│ • dbService (Database Access)                   │
│ • cacheService (In-Memory Cache)                │
│ • hashUtil (Hash Generation)                    │
│ • stringUtil (Validation)                       │
│ • bycryptUtil (Password Security)               │
└─────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────┐
│               Data Layer                         │
├─────────────────────────────────────────────────┤
│ PostgreSQL Database                             │
│  ├─ UrlEntry table                              │
│  └─ User table                                  │
└─────────────────────────────────────────────────┘
```
