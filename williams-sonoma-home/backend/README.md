# Williams Sonoma Home Backend

Node.js + Express.js API server for luxury e-commerce platform with PostgreSQL and AI integrations.

## Setup

```bash
npm install
npm run build
npm run dev
```

## Environment Variables

Create a `.env` file:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=williams_sonoma_home
JWT_SECRET=your-secret-key-change-in-production
GROQ_API_KEY=your-groq-api-key
```

## Database

PostgreSQL with pgvector extension for embeddings:

```bash
# Create database
createdb williams_sonoma_home

# Install pgvector extension
psql -d williams_sonoma_home -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Current user info

### Catalog (Public)
- `GET /api/catalog/products` - Product list with filters
- `GET /api/catalog/product/:skuId` - Product details
- `GET /api/catalog/product/:skuId/insights` - AI insights
- `GET /api/catalog/categories` - Available categories

### Customer
- `GET /api/customer/orders` - User's orders
- `POST /api/customer/orders` - Create order
- `POST /api/customer/returns` - Create return
- `GET /api/customer/product/:skuId/similar-reviews` - Product reviews

### Manufacturer
- `GET /api/manufacturer/dashboard` - Dashboard data
- `GET /api/manufacturer/products` - Product management
- `GET /api/manufacturer/product/:skuId` - Product details with insights
- `PUT /api/manufacturer/product/:skuId/description` - Update description

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/categories` - Category analytics
- `GET /api/admin/manufacturers` - Manufacturer data
- `GET /api/admin/top-issues` - Platform-wide issues

## Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access** - Customer, Manufacturer, Admin roles
- **Database Migrations** - Automatic schema creation
- **AI Integration** - Groq LLM for product descriptions
- **Vector Embeddings** - User profile embeddings with pgvector
- **Error Handling** - Comprehensive error middleware
- **CORS Support** - Cross-origin requests

## Available Scripts

- `npm run dev` - Start with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled code
- `npm run migrate` - Run database migrations

## Architecture

```
src/
├── config/       # Configuration (DB, migrations)
├── controllers/  # Business logic
├── routes/       # API routes
├── middleware/   # Authentication, error handling
├── models/       # Database queries
├── utils/        # Helper functions
└── index.ts      # Server entry point
```

## AI Model Integration

The backend integrates trained models from `/models/`:

- **Priority Scorer** - Urgency assessment with revenue impact
- **NLP Summarizer** - Review analysis and tag extraction
- **Profile Embedder** - Customer preference vectors
- **Gap Analyzer** - Product description quality assessment

Model results are loaded from `/models/*/results/` JSON files.
