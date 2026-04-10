# Complete File Index

Quick reference guide to all files in the Williams Sonoma Home project.

## Documentation Files (Start Here)

| File | Purpose | Read Time |
|------|---------|-----------|
| [README.md](README.md) | Main project documentation, architecture overview | 10 min |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Executive summary of what's been built | 5 min |
| [QUICKSTART.md](QUICKSTART.md) | 5-minute setup guide (fastest way to start) | 5 min |
| [API_REFERENCE.md](API_REFERENCE.md) | Complete API endpoint documentation | 15 min |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guides (Heroku, AWS, Docker) | 15 min |
| [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) | How to make code changes, development workflow | 15 min |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Testing procedures, validation checklist | 15 min |
| [INTEGRATION.md](INTEGRATION.md) | ML model integration architecture | 10 min |

**⭐ Start with:** QUICKSTART.md (to get running) → PROJECT_SUMMARY.md (to understand what's built) → Pick specific docs as needed

---

## Backend Files

### Configuration & Setup

| File | Lines | Purpose |
|------|-------|---------|
| `backend/package.json` | 30 | Dependencies and build scripts |
| `backend/tsconfig.json` | 15 | TypeScript compiler configuration |
| `backend/.env.example` | 5 | Environment variable template |
| `backend/README.md` | 80 | Backend-specific documentation |

### Database

| File | Lines | Purpose |
|------|-------|---------|
| `backend/src/config/database.ts` | 50 | PostgreSQL connection pool setup with pgvector |
| `backend/src/config/migrations.ts` | 200 | 8 database migrations (auto-runs on startup) |

### Utilities

| File | Lines | Purpose |
|------|-------|---------|
| `backend/src/utils/jwt.ts` | 30 | JWT token generation and verification |
| `backend/src/utils/password.ts` | 20 | bcryptjs password hashing utilities |

### Middleware

| File | Lines | Purpose |
|------|-------|---------|
| `backend/src/middleware/auth.ts` | 40 | JWT validation, role checking, optional auth |
| `backend/src/middleware/error.ts` | 30 | Global error handler with HTTP status mapping |

### Data Access Layer

| File | Lines | Purpose |
|------|-------|---------|
| `backend/src/models/index.ts` | 300 | Database models: customer, product, order, return, review (CRUD + complex queries) |

### Business Logic

| File | Lines | Purpose |
|------|-------|---------|
| `backend/src/controllers/auth.ts` | 80 | Login, signup, getMe endpoints |
| `backend/src/controllers/catalog.ts` | 120 | Product search, details, insights (ML integration) |
| `backend/src/controllers/customer.ts` | 100 | Orders, returns, reviews |
| `backend/src/controllers/manufacturer.ts` | 150 | Dashboard, products, product detail, description updates |
| `backend/src/controllers/admin.ts` | 100 | Platform statistics, analytics |

### API Routes

| File | Lines | Purpose |
|------|-------|---------|
| `backend/src/routes/index.ts` | 80 | 20+ API endpoints with role-based routing |

### Startup

| File | Lines | Purpose |
|------|-------|---------|
| `backend/src/index.ts` | 40 | Express app initialization, middleware setup |

---

## Frontend Files

### Configuration & Setup

| File | Lines | Purpose |
|------|-------|---------|
| `frontend/package.json` | 30 | Dependencies and build scripts |
| `frontend/tsconfig.json` | 20 | TypeScript configuration for React |
| `frontend/vite.config.ts` | 15 | Vite build configuration |
| `frontend/tailwind.config.js` | 25 | Tailwind CSS configuration with luxury colors |
| `frontend/postcss.config.cjs` | 10 | PostCSS setup for CSS processing |
| `frontend/.env.example` | 2 | Environment variable template |
| `frontend/index.html` | 15 | HTML template |
| `frontend/README.md` | 100 | Frontend-specific documentation |

### Type Definitions

| File | Lines | Purpose |
|------|-------|---------|
| `frontend/src/types/index.ts` | 150 | 11 TypeScript interfaces (User, Product, Order, Review, etc.) |

### HTTP Client & State

| File | Lines | Purpose |
|------|-------|---------|
| `frontend/src/services/api.ts` | 200 | Axios HTTP client with 20+ methods, interceptors |
| `frontend/src/context/store.ts` | 100 | Zustand stores (auth, cart with localStorage) |
| `frontend/src/hooks/index.ts` | 40 | Custom hooks (useAuth, useDebounce) |

### UI Components (Reusable)

| File | Lines | Purpose |
|------|-------|---------|
| `frontend/src/components/Layout.tsx` | 120 | Header, Footer, Loading spinner, ErrorBoundary |
| `frontend/src/components/ProductComponents.tsx` | 150 | ProductCard, BuyerCard, ReturnReasonSummary, ReviewHighlights, AlertCard |

### Page Components

| File | Lines | Purpose |
|------|-------|---------|
| `frontend/src/pages/HomePage.tsx` | 80 | Landing page with hero section |
| `frontend/src/pages/LoginPage.tsx` | 100 | Role selection + login form |
| `frontend/src/pages/SignupPage.tsx` | 150 | Registration with preferences collection |
| `frontend/src/pages/CatalogPage.tsx` | 200 | Product listing with search, filters, sorting, pagination |
| `frontend/src/pages/ProductDetailPage.tsx` | 250 | Product details, specifications, buyer insights, AI suggestions |
| `frontend/src/pages/OrdersPage.tsx` | 150 | Order history with return modal |
| `frontend/src/pages/ManufacturerDashboard.tsx` | 200 | KPI cards, priority actions queue, charts |
| `frontend/src/pages/ManufacturerProducts.tsx` | 150 | Product table with risk filtering |
| `frontend/src/pages/ManufacturerProductDetail.tsx` | 250 | Gap score, pain points, description editor |
| `frontend/src/pages/AdminDashboard.tsx` | 200 | Platform analytics, category performance, manufacturer rankings |

### Styling

| File | Lines | Purpose |
|------|-------|---------|
| `frontend/src/styles/globals.css` | 200 | Brand colors, button classes, component styles |

### Startup

| File | Lines | Purpose |
|------|-------|---------|
| `frontend/src/main.tsx` | 15 | React DOM render entry point |
| `frontend/src/App.tsx` | 60 | Main router with protected routes |

---

## Data Files

| File | Purpose |
|------|---------|
| `data/Customer_support.csv` | Original customer support dataset |
| `data/descriptions.txt` | Original product descriptions |

---

## ML Model Files

### Client (User-Side) Models

| File | Purpose |
|------|---------|
| `models/client/train_delivery_aggregator.py` | Training script for delivery predictions |
| `models/client/train_faiss_indexer.py` | FAISS indexing for similarity search |
| `models/client/train_profile_embedder.py` | User profile embedding generation |
| `models/client/train_review_nlp_summarizer.py` | Review text summarization |
| `models/client/train_score_api_prep.py` | Score computation for recommendations |
| `models/client/results/faiss_customer_map.csv` | FAISS index mapping (ready) |
| `models/client/results/sku_summaries.json` | Product tags (integrated into catalog) |
| `models/client/results/shipping_stats.json` | Shipping statistics |
| `models/client/results/User_Profile_Embeddings.csv` | User embeddings for pgvector (ready) |

### Server (Platform-Side) Models

| File | Purpose |
|------|---------|
| `models/server/train_dashboard_nlp_tagger.py` | Dashboard metric tagging |
| `models/server/train_ews_model.py` | Early warning system |
| `models/server/train_gap_analyzer.py` | Product gap analysis |
| `models/server/train_priority_scorer.py` | Priority/urgency scoring |
| `models/server/train_return_aggregator.py` | Return reason aggregation |
| `models/server/train_time_series.py` | Time series forecasting |
| `models/server/results/listing_gaps.json` | Product gap scores (integrated) |
| `models/server/results/priority_actions.json` | Action priorities/alerts (integrated) |
| `models/server/results/return_rates.csv` | Return rate data |
| `models/server/results/rolling_scores.csv` | Rolling metric scores |
| `models/server/results/top_return_reasons.json` | Return categories |

---

## Setup & Automation

| File | Lines | Purpose |
|------|-------|---------|
| `setup.sh` | 40 | Unix/Mac setup automation (chmod +x, npm install, .env creation) |
| `setup.bat` | 35 | Windows setup automation (same flow in batch) |

---

## Summary Statistics

### Code Files
- **Backend**: 11 files (~1,200 lines of TypeScript)
- **Frontend**: 16 files (~2,000 lines of React/TypeScript)
- **Total Production Code**: ~3,200 lines

### Documentation
- **8 Documentation files**: ~2,500 lines of markdown
- **API Reference**: 50+ endpoints documented
- **Deployment Guides**: 4 different hosting options

### Configuration
- **8 Config files**: TypeScript, Tailwind, Vite, etc.
- **2 Environment templates**: .env.example files

### Data & Models
- **2 Data files**: Original datasets
- **12 ML model files**: Pre-trained models
- **6 ML output files**: Ready for integration

**Total Project:** 40+ files, 10,000+ lines of code and documentation

---

## File Dependencies Graph

```
Frontend Organization
├── main.tsx
│   ├── App.tsx (Main Router)
│   │   ├── pages/*.tsx (10 pages)
│   │   │   ├── components/Layout.tsx (Header, Footer)
│   │   │   ├── components/ProductComponents.tsx (Cards, Alerts)
│   │   │   └── services/api.ts (API calls)
│   │   │       └── context/store.ts (Auth store)
│   │   └── hooks/index.ts (useAuth, useDebounce)
│   ├── types/index.ts (TypeScript interfaces)
│   ├── styles/globals.css (Brand styling)
│   └── index.html (HTML template)

Backend Organization
├── index.ts (Express App)
│   ├── routes/index.ts (20+ endpoints)
│   │   ├── controllers/*.ts (Auth, Catalog, Customer, Manufacturer, Admin)
│   │   │   ├── models/index.ts (Database queries)
│   │   │   │   └── config/database.ts (PostgreSQL pool)
│   │   │   └── utils/*.ts (JWT, Password)
│   │   └── middleware/*.ts (Auth, Error handling)
│   └── config/migrations.ts (Auto-run on startup)

ML Models
├── models/server/results/priority_actions.json
│   └── Loaded by backend/src/controllers/manufacturer.ts
├── models/client/results/sku_summaries.json
│   └── Loaded by backend/src/controllers/catalog.ts
└── models/client/results/User_Profile_Embeddings.csv
    └── Ready for backend/src/config/database.ts (pgvector)
```

---

## Navigation by Task

### "I want to run the app locally"
→ Read [QUICKSTART.md](QUICKSTART.md)

### "I want to add a new API endpoint"
→ Read [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) then edit:
- `backend/src/models/index.ts` (database layer)
- `backend/src/controllers/*.ts` (business logic)
- `backend/src/routes/index.ts` (route registration)

### "I want to add a new frontend page"
→ Read [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) then:
- Create `frontend/src/pages/NewPage.tsx`
- Add route to `frontend/src/App.tsx`
- Add API methods to `frontend/src/services/api.ts`

### "I want to test the system"
→ Read [TESTING_GUIDE.md](TESTING_GUIDE.md)

### "I want to deploy to production"
→ Read [DEPLOYMENT.md](DEPLOYMENT.md)

### "I want to understand how ML models are used"
→ Read [INTEGRATION.md](INTEGRATION.md)

### "I want to fix a bug"
→ Enable error logging in [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)

### "I want to understand the database schema"
→ Check `backend/src/config/migrations.ts`

---

## File Modification Frequency

### Likely to modify (regularly)
- `frontend/src/pages/*.tsx` - Add new pages
- `backend/src/controllers/*.ts` - Add new endpoints
- `backend/src/routes/index.ts` - Register new routes
- `frontend/src/styles/globals.css` - Adjust styling

### Occasionally modify
- `frontend/src/types/index.ts` - Add new interfaces
- `backend/src/models/index.ts` - Add new queries
- `frontend/src/context/store.ts` - Add state management
- `frontend/src/services/api.ts` - Add API methods

### Rarely modify
- `backend/src/middleware/*.ts` - Core auth logic
- `frontend/src/components/Layout.tsx` - Core layout
- `backend/src/config/database.ts` - Database setup
- `frontend/src/hooks/index.ts` - Core hooks

### Never modify (after initial setup)
- `package.json` files (use npm install)
- `tsconfig.json` files (unless changing target)
- Configuration files (update via .env)
- Database migrations (create new ones instead)

---

## Checklist: What Should Work

- [ ] All files exist at correct paths
- [ ] No TypeScript compilation errors
- [ ] No missing imports
- [ ] All routes registered
- [ ] All pages render
- [ ] API connects to database
- [ ] ML models load from JSON files
- [ ] Docker/setup scripts work
- [ ] Documentation complete and accurate

---

This index should help you quickly locate any file and understand its purpose. For code changes, always start with DEVELOPER_GUIDE.md.

**Questions? Check the appropriate documentation file above.**
