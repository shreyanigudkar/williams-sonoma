# Developer Workflow Guide

Guide for developers working on the Williams Sonoma Home platform.

## Project Structure Overview

```
williams-sonoma-home/
├── backend/                          # Node.js + Express API
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   ├── database.ts           # PostgreSQL setup + pgvector
│   │   │   └── migrations.ts         # Auto-running DB migrations
│   │   ├── utils/
│   │   │   ├── jwt.ts                # Token generation/verification
│   │   │   └── password.ts           # bcryptjs hashing
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT validation, role checking
│   │   │   └── error.ts              # Global error handler
│   │   ├── models/
│   │   │   └── index.ts              # Database models (CRUD operations)
│   │   ├── controllers/
│   │   │   ├── auth.ts               # Authentication endpoints
│   │   │   ├── catalog.ts            # Product search, details, insights
│   │   │   ├── customer.ts           # Orders, returns, reviews
│   │   │   ├── manufacturer.ts       # Dashboard and product management
│   │   │   └── admin.ts              # Platform analytics
│   │   ├── routes/
│   │   │   └── index.ts              # All API endpoints (20+)
│   │   └── index.ts                  # Express app initialization
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                         # React + TypeScript + Vite
│   ├── src/
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces (11 types)
│   │   ├── services/
│   │   │   └── api.ts                # Axios HTTP client
│   │   ├── context/
│   │   │   └── store.ts              # Zustand stores (auth, cart)
│   │   ├── hooks/
│   │   │   └── index.ts              # Custom React hooks
│   │   ├── components/
│   │   │   ├── Layout.tsx            # Header, Footer, Loading, ErrorBoundary
│   │   │   └── ProductComponents.tsx # Reusable product UI components
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── CatalogPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── ManufacturerDashboard.tsx
│   │   │   ├── ManufacturerProducts.tsx
│   │   │   ├── ManufacturerProductDetail.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── App.tsx                   # Main router
│   │   ├── main.tsx                  # React entry point
│   │   ├── index.html
│   │   └── styles/
│   │       └── globals.css           # Brand colors, component classes
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   ├── .env.example
│   └── README.md
│
├── data/                             # Original datasets
│   ├── Customer_support.csv
│   └── descriptions.txt
├── models/                           # Pre-trained ML models
│   ├── client/
│   │   ├── train_*.py                # Training scripts
│   │   └── results/
│   │       ├── faiss_customer_map.csv
│   │       ├── sku_summaries.json    # Product tags
│   │       ├── shipping_stats.json
│   │       └── User_Profile_Embeddings.csv
│   └── server/
│       ├── train_*.py                # Training scripts
│       └── results/
│           ├── listing_gaps.json
│           ├── priority_actions.json # Urgency scores, pain points
│           ├── return_rates.csv
│           ├── rolling_scores.csv
│           └── top_return_reasons.json
│
├── API_REFERENCE.md                  # Complete API documentation
├── DEPLOYMENT.md                     # Production deployment guide
├── INTEGRATION.md                    # ML model integration docs
├── QUICKSTART.md                     # 5-minute setup guide
├── README.md                         # Main project documentation
├── setup.sh                          # Unix setup automation
└── setup.bat                         # Windows setup automation
```

## Development Setup

### 1. Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd williams-sonoma-home

# Setup both backend and frontend
./setup.sh                 # Unix/Mac
setup.bat                  # Windows
```

### 2. Configure Environment

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Frontend
cd ../frontend
cp .env.example .env.local
# VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 4. Verify Setup

- Backend: `curl http://localhost:5000/health` should return 200
- Frontend: Open http://localhost:3000 in browser
- Database: Migrations should auto-run on backend startup

---

## Development Workflow

### Making Backend Changes

#### Adding a New Endpoint

1. **Update the model** (`backend/src/models/index.ts`):
```typescript
export async function getNewData(filters?: any) {
  const query = buildQuery(filters);
  return queryDB(query);
}
```

2. **Create/update controller** (`backend/src/controllers/*.ts`):
```typescript
export async function getNewData(req: Request, res: Response) {
  try {
    const data = await models.getNewData(req.query);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

3. **Add route** (`backend/src/routes/index.ts`):
```typescript
router.get('/new-endpoint', authMiddleware, roleMiddleware('customer'), 
  controller.getNewData);
```

4. **Test endpoint**:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/new-endpoint
```

#### Database Schema Changes

1. **Add migration** (`backend/src/config/migrations.ts`):
```typescript
async function migrateXXX(client: any) {
  await client.query(`
    CREATE TABLE new_table (
      id SERIAL PRIMARY KEY,
      ...
    );
  `);
}

migrations.push({
  up: migrateXXX,
  name: 'create_new_table'
});
```

2. **Backend will auto-run on startup** - no manual migration needed

#### Debugging Backend

```typescript
// Add console logs (visible in npm run dev output)
console.log('Debug info:', variable);

// Use debugging in VSCode:
// Add breakpoint, then use npm run debug
// Attach debugger to localhost:9229
```

---

### Making Frontend Changes

#### Adding a New Page

1. **Create component** (`frontend/src/pages/NewPage.tsx`):
```typescript
export default function NewPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="page-content">
        {/* Page content */}
      </div>
    </Layout>
  );
}
```

2. **Add route** (`frontend/src/App.tsx`):
```typescript
import NewPage from './pages/NewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/new-page" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
```

3. **Add API call** (`frontend/src/services/api.ts`):
```typescript
export async function getNewData(): Promise<DataType[]> {
  const { data } = await client.get('/endpoint');
  return data.data;
}
```

4. **Use API in component**:
```typescript
useEffect(() => {
  api.getNewData().then(setData).catch(handleError);
}, []);
```

#### Styling Components

Use Tailwind CSS classes:
```jsx
<div className="flex items-center justify-between px-6 py-4 bg-[#FAF9F6]">
  <h1 className="text-3xl font-serif text-[#1A1A1A]">Title</h1>
  <button className="px-8 py-2 bg-[#1A1A1A] text-white tracking-widest">
    ACTION
  </button>
</div>
```

Brand color variables available in `globals.css`:
```css
--primary: #1A1A1A
--secondary: #8B7355
--accent: #C4A882
--background: #FAF9F6
```

#### Type Safety

Always define types before using:
```typescript
interface Product {
  skuId: string;
  name: string;
  price: number;
}

const products: Product[] = [];
```

---

## Common Tasks

### Testing an API Endpoint

```bash
# Using curl
curl -X GET http://localhost:5000/api/catalog/products \
  -H "Authorization: Bearer <token>"

# Using Postman
# Set header: Authorization: Bearer <token>
# Send request to: http://localhost:5000/api/endpoint

# Using fetch in browser console
fetch('http://localhost:5000/api/endpoint', {
  header: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json()).then(console.log)
```

### Adding a New Product Type/Interface

```typescript
// frontend/src/types/index.ts
export interface NewType {
  id: string;
  name: string;
  // ... fields
}
```

### Debugging React Component

```typescript
// Use React DevTools browser extension
// Or add to component:
useEffect(() => {
  console.log('State:', state);
}, [state]);

// Check browser console for errors
// Network tab for API calls
// Application tab for localStorage
```

### Running Tests

```bash
# Backend (when tests are added)
cd backend
npm test

# Frontend (when tests are added)
cd frontend
npm test
```

### Database Queries

```bash
# Connect to PostgreSQL
psql -h localhost -U postgres -d williams_sonoma_home

# Common queries:
SELECT * FROM customers LIMIT 5;
SELECT COUNT(*) FROM orders;
SELECT * FROM products WHERE category = 'Furniture';

# Check indexes
\d products

# Exit
\q
```

---

## Code Style Guide

### Backend TypeScript

```typescript
// Always use async/await
async function getData() {
  const result = await queryDB();
  return result;
}

// Use type annotations
function process(data: string[]): number {
  return data.length;
}

// Use interfaces for objects
interface User {
  id: string;
  email: string;
}

// Error handling
try {
  await operation();
} catch (error) {
  console.error('Operation failed:', error);
  throw new AppError('Failed', 500);
}
```

### Frontend React/TypeScript

```typescript
// Use functional components
export default function MyComponent() {
  const [state, setState] = useState<string>('');

  useEffect(() => {
    // Cleanup function
    return () => {
      // Cleanup
    };
  }, []);

  return <div className="component">Content</div>;
}

// Use custom hooks for logic
function useCustomLogic() {
  const [data, setData] = useState(null);
  return { data };
}
```

### CSS/Styling

```css
/* Use class names for reusable styles */
.button-primary {
  @apply px-8 py-2 bg-[#1A1A1A] text-white tracking-widest;
}

/* Use Tailwind utilities for one-off styles */
<button className="px-4 py-2 bg-accent text-white">
  Click me
</button>
```

---

## Useful Commands

### Backend

```bash
cd backend

npm run dev              # Start development server
npm run build           # Compile TypeScript
npm start               # Run production build
npm test               # Run tests (when added)
npm run migrate        # Run database migrations manually
npm run seed           # Seed database (when created)
```

### Frontend

```bash
cd frontend

npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm test              # Run tests (when added)
npm run lint          # Run linter (when added)
```

### Git Workflow

```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create pull request
# After review: git merge to main

# Cleanup
git branch -d feature/new-feature
```

---

## Troubleshooting

### Backend won't start

```bash
# Check Node version
node --version  # Should be 18+

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check database connection
psql -h localhost -U postgres
# If fails, check PostgreSQL is running

# Check ports
lsof -i :5000  # Make sure port 5000 is free
```

### Frontend has errors

```bash
# Clear cache
rm -rf node_modules .next
npm install

# Check environment variables
cat .env.local  # Verify VITE_API_URL

# Clear browser cache
# DevTools > Application > Clear storage

# Check console for errors
# Open DevTools: F12 or Cmd+Option+I
```

### API returns 401 Unauthorized

```bash
# JWT token expired or invalid
# Clear localStorage
localStorage.clear()

# Login again
# New token will be stored

# Check token format
// In browser console
const token = localStorage.getItem('token');
console.log(token);
```

### Data not appearing

```bash
# Check network tab in DevTools
# Look for failed API calls
# Check response status and error message

# Verify backend is running
curl http://localhost:5000/api/endpoint

# Check database has data
psql -h localhost -U postgres -d williams_sonoma_home
SELECT * FROM products LIMIT 5;
```

---

## Performance Tips

### Backend

- Use database indexes for frequently queried columns
- Cache frequently accessed data
- Batch API requests when possible
- Use database connection pooling (already configured)

### Frontend

- Use React.memo for expensive components
- Implement pagination for large lists
- Lazy load images
- Minimize API calls (debounce search)
- Bundle size: `npm run analyze-bundle`

### Database

```sql
-- Add indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- Check query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE category = 'Furniture';
```

---

## Deployment from Development

### Build for Production

```bash
# Backend
cd backend
npm run build
npm start  # Runs compiled dist/ directory

# Frontend
cd frontend
npm run build
# Creates dist/ directory ready for deployment
```

### Test Production Build Locally

```bash
# Backend
NODE_ENV=production npm start

# Frontend (serve dist directory)
npx serve dist -l 3000
```

### Deploy Changes

```bash
# Commit to git
git add .
git commit -m "Deploy: New feature"
git push

# Deploying platform-specific
# Heroku: git push heroku main
# Vercel: Auto-deploys on push to main
# AWS: Re-run deployment pipeline
```

---

## Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Axios Docs](https://axios-http.com/)

---

## Getting Help

1. Check the README.md in your specific directory
2. Review API_REFERENCE.md for endpoint details
3. Check INTEGRATION.md for ML model data flow
4. Search existing issues on GitHub
5. Ask team members

---

Happy coding! 🚀
