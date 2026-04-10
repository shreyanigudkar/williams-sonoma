# Williams Sonoma Home - Luxury E-Commerce Platform

A production-ready, full-stack luxury furniture e-commerce platform with AI-powered insights, built with React, TypeScript, Node.js, Express, and PostgreSQL.

## 🎯 Project Overview

This platform serves three stakeholder groups:

- **Customers**: Browse, search, and purchase luxury furniture with AI-powered recommendations
- **Manufacturers**: Manage products, track returns, and optimize listings with AI-generated insights  
- **Admins**: Monitor platform performance and analytics

## 🏗️ Project Structure

```
williams-sonoma-home/
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── config/        # Database & JWT config
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth & error handling
│   │   ├── models/        # Database queries
│   │   ├── utils/         # Helpers
│   │   └── index.ts       # Server entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/              # React + TypeScript UI
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Zustand stores
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript types
│   │   ├── styles/        # Global CSS
│   │   ├── App.tsx        # Main app
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Build
npm run build

# Start server (development)
npm run dev
# or production
npm start
```

**Backend runs on**: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies  
npm install

# Configure environment (optional)
cp .env.example .env.local

# Start development server
npm run dev
```

**Frontend runs on**: `http://localhost:3000`

### 3. Database Setup

```bash
# Create database
createdb williams_sonoma_home

# Connect and enable pgvector
psql -d williams_sonoma_home -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Migrations run automatically on first server start
```

## 📊 Database Schema

The backend automatically creates these tables:

- **customers** - User accounts with preferences
- **products** - Product catalog with specifications
- **orders** - Customer Orders
- **order_items** - Items in each order
- **returns** - Return/refund requests
- **reviews** - Product reviews and ratings
- **user_embeddings** - Customer preference vectors (pgvector)

## 🎨 Design System

**Brand**: Williams Sonoma Home (Luxury Minimalist)

- **Primary**: #1A1A1A (Dark Charcoal)
- **Secondary**: #8B7355 (Warm Brown)
- **Accent**: #C4A882 (Gold)
- **Background**: #FAF9F6 (Off-white)

**Typography**:
- Headings: Cormorant Garamond (serif)
- Body: Inter (sans-serif)
- Style: No rounded corners, uppercase buttons, ample whitespace

## 🔐 Authentication

- JWT-based authentication
- Role-based access control (Customer, Manufacturer, Admin)
- Protected routes with middleware
- Secure password hashing with bcryptjs

## 🧠 AI Integration

The platform integrates trained ML models for:

- **Priority Scoring**: Identifies products with high return rates and revenue impact
- **NLP Summarization**: Extracts insights from customer reviews
- **Profile Embeddings**: Creates customer preference vectors
- **Gap Analysis**: Assesses product description quality
- **AI Rewriting**: Generates improved product descriptions using Groq LLM

Model results loaded from: `/models/*/results/*.json`

## 📱 Key Features

### Customer Features
- ✅ Product catalog with search and filtering
- ✅ Advanced product details with specifications
- ✅ AI insights: "Buyers Like You", return reasons, review highlights
- ✅ Shopping cart (local storage)
- ✅ Order history and tracking
- ✅ Return/refund requests
- ✅ Preference-based recommendations

### Manufacturer Features  
- ✅ Dashboard with priority alerts
- ✅ Return rate analytics and trends
- ✅ Product performance metrics
- ✅ Product description optimization with AI suggestions
- ✅ Quality gap scoring
- ✅ Revenue at risk tracking

### Admin Features
- ✅ Platform-wide KPIs and statistics
- ✅ Category performance analytics
- ✅ Manufacturer scorecards
- ✅ Top platform issues aggregation
- ✅ Revenue and order tracking

## 📡 API Endpoints

### Public
```
GET  /api/catalog/products           # Product list with filters
GET  /api/catalog/product/:skuId     # Product details
GET  /api/catalog/product/:skuId/insights  # AI insights
GET  /api/catalog/categories         # Available categories
```

### Authentication
```
POST /api/auth/login                 # User login
POST /api/auth/signup                # User registration
GET  /api/auth/me                    # Current user profile
```

### Customer (Protected)
```
GET  /api/customer/orders            # User's orders
POST /api/customer/orders            # Create order
POST /api/customer/returns           # Create return
GET  /api/customer/product/:skuId/similar-reviews
```

### Manufacturer (Protected)
```
GET  /api/manufacturer/dashboard     # Dashboard data
GET  /api/manufacturer/products      # Product list
GET  /api/manufacturer/product/:skuId # Product with insights
PUT  /api/manufacturer/product/:skuId/description # Update description
```

### Admin (Protected)
```
GET  /api/admin/stats                # Platform stats
GET  /api/admin/categories           # Category analytics
GET  /api/admin/manufacturers        # Manufacturer data
GET  /api/admin/top-issues           # Platform issues
```

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev          # Start with ts-node and auto-reload
npm run build        # Compile TypeScript
npm run migrate      # Run database migrations
```

## 📦 Dependencies

### Backend
- **express** - Web framework
- **pg** - PostgreSQL client
- **pgvector** - Vector search
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **typescript** - Type safety

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **zustand** - State management
- **axios** - HTTP client
- **recharts** - Charts & visualizations
- **tailwindcss** - Utility CSS
- **typescript** - Type safety

## 🔒 Security

- ✅ JWT token-based auth with expiry
- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes with middleware
- ✅ CORS enabled for frontend origin
- ✅ Input validation on all forms
- ✅ Environment variables for secrets

## 📈 Performance

- Responsive design (mobile-first)
- Debounced search inputs
- Optimized images with placeholder service
- Chart libraries with memoization
- Local storage for cart persistence
- API request caching in Zustand

## 🧪 Testing

Testing framework can be added with:

```bash
# Backend
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev supertest @types/supertest

# Frontend  
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

## 📝 Configuration

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=williams_sonoma_home
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-key-optional
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Deployment

### Backend (e.g., Heroku)
```bash
# Set environment variables on platform
git push heroku main
```

### Frontend (e.g., Vercel, Netlify)
```bash
npm run build
# Deploy dist/ folder
```

## 📚 Documentation

- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`
- **Database Schema**: Auto-generated in backend/src/config/migrations.ts
- **API Spec**: Detailed in controllers and routes

## 🐛 Troubleshooting

### Backend won't start
1. Check PostgreSQL is running: `psql --version`
2. Verify database exists: `psql -l`
3. Check .env credentials
4. Run migrations: `npm run migrate`

### Frontend won't connect
1. Verify backend is running on port 5000
2. Check VITE_API_URL in .env.local
3. Clear cache: `npm cache clean --force`
4. Remove node_modules and reinstall

### Database errors
1. Create extension: `psql -d williams_sonoma_home -c "CREATE EXTENSION IF NOT EXISTS vector;"`
2. Check connection pool: See database.ts
3. Review migration logs

## 📄 License

MIT

## 👥 Support

For issues or questions, check the respective README files in `backend/` and `frontend/` directories.

---

**Built with ❤️ for luxury furniture shopping**
