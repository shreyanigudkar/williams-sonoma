# Testing & Validation Guide

Comprehensive guide for testing and validating the Williams Sonoma Home platform.

## Pre-Deployment Checklist

### Backend Validation

- [ ] All TypeScript files compile without errors: `npm run build`
- [ ] No unused imports or variables
- [ ] Environment variables set correctly in `.env`
- [ ] Database connection successful
- [ ] All migrations run successfully (check logs on startup)
- [ ] JWT secret is strong (min 32 characters)
- [ ] Password hashing works (bcryptjs correctly configured)
- [ ] CORS enabled for frontend domain
- [ ] Error handling middleware catches all errors
- [ ] API endpoints return proper HTTP status codes

### Frontend Validation

- [ ] All TypeScript files compile without errors: `npm run build`
- [ ] No console errors or warnings
- [ ] Environment variables set correctly
- [ ] API URL points to backend correctly
- [ ] All pages load without errors
- [ ] No unused dependencies
- [ ] Bundle size acceptable (check with webpack-bundle-analyzer)

### Database Validation

- [ ] PostgreSQL running (version 13+)
- [ ] pgvector extension installed
- [ ] All 8 tables created (check with `\d` in psql)
- [ ] Sample data loaded (if using seed script)
- [ ] Connection pooling working
- [ ] Indexes created for performance

---

## Manual Testing Scenarios

### 1. User Authentication Flow

#### Signup
```
1. Navigate to http://localhost:3000
2. Click "Sign Up"
3. Fill in form:
   - Email: test@example.com
   - Password: TestPass123!
   - Full Name: Test User
   - Age Group: 30-40
   - Preferences: Select options
   - Lighting: Bright
4. Click "Sign Up"
5. Verify redirected to Catalog page
6. Check localStorage for token
```

**Expected Results:**
- [ ] New customer created in database
- [ ] JWT token stored in localStorage
- [ ] Redirected to /catalog
- [ ] Header shows user name

#### Login
```
1. Navigate to http://localhost:3000/login
2. Select role: "Customer"
3. Enter email and password
4. Click "Log In"
5. Verify redirected to Catalog page
```

**Expected Results:**
- [ ] Correct role selected in header
- [ ] Token retrieved and stored
- [ ] Can access protected routes

### 2. Catalog & Product Discovery

#### Browse Products
```
1. Go to Catalog page
2. See list of products with images, prices, ratings
3. Use search bar - search "chair"
4. Filter by category - select "Furniture"
5. Sort by price - lowest to highest
6. Verify pagination works
```

**Expected Results:**
- [ ] Products display correctly
- [ ] Search filters results
- [ ] Category filter works
- [ ] Sorting changes order
- [ ] Pagination shows correct items
- [ ] Tags visible on product cards

#### View Product Details
```
1. Click on a product card
2. See full product details
3. View specifications table
4. See "Buyers Like You" section (3+ cards)
5. See Return Reason Summary
6. See Review Highlights (Pros/Cons)
7. See AI-Suggested Rewrite section
8. Click "Add to Cart"
```

**Expected Results:**
- [ ] Product loads with full information
- [ ] Images display
- [ ] Specifications table formatted correctly
- [ ] Buyer insights show match percentages
- [ ] AI insights from models visible
- [ ] Add to cart updates cart count in header

### 3. Shopping & Ordering

#### Add to Cart
```
1. On product detail page
2. Increase quantity if desired (up to 5)
3. Click "Add to Cart"
4. Verify cart count increases in header
5. Add another product
6. Click cart icon to view cart
```

**Expected Results:**
- [ ] Cart persists in localStorage
- [ ] Quantity updates correctly
- [ ] Cart count shows in header
- [ ] Multiple items can be added

#### Create Order
```
1. View Cart (mock feature - button exists)
2. Note: Full checkout not yet implemented
3. Verify order data structure ready
```

**Expected Results:**
- [ ] Cart shows all items
- [ ] Totals calculate correctly
- [ ] User can review before checkout

### 4. Order Management

#### View Orders
```
1. Login as customer
2. Go to Orders page
3. See list of past orders
4. Click order details
5. See order items, status, total
6. Click "Initiate Return"
```

**Expected Results:**
- [ ] Orders display with correct data
- [ ] Status badges show
- [ ] Order items listed
- [ ] Total amount correct

#### Return Product
```
1. Click "Initiate Return" on order
2. Modal appears
3. Select return reason (dropdown)
4. Enter note
5. Click "Submit Return"
```

**Expected Results:**
- [ ] Modal appears with form
- [ ] Reasons dropdown populated
- [ ] Return submitted to backend
- [ ] Modal closes on success
- [ ] Return created in database

### 5. Manufacturer Dashboard

#### Login as Manufacturer
```
1. Go to /login
2. Select "Manufacturer"
3. Login with manufacturer credentials
```

**Expected Results:**
- [ ] Role is "Manufacturer"
- [ ] Redirected to /manufacturer/dashboard
- [ ] Dashboard shows manufacturer-specific data

#### View Dashboard
```
1. Manufacturer Dashboard loads
2. See KPI cards (Products, Alerts, Return Rate, Actions)
3. See Priority Actions queue
4. See Return Rate Trend chart
5. See Top Return Reasons chart
```

**Expected Results:**
- [ ] All KPIs display with correct values
- [ ] Priority actions sorted by urgency
- [ ] Charts render without errors
- [ ] Data loads from model JSON files
- [ ] Urgency color-coded (red/yellow/green)

#### Manage Products
```
1. Click "View All Products"
2. Manufacturer Products page loads
3. Filter by risk level (All/Critical/High)
4. See product table with return rates
5. Click "Review" on a product
```

**Expected Results:**
- [ ] Products filtered correctly
- [ ] Risk level badges show
- [ ] Return rate progress bars display
- [ ] Navigation to product detail works

#### Edit Product Description
```
1. On Product Detail page
2. See gap score metric
3. See pain points (red pills)
4. See AI-suggested description
5. Click "Edit Description"
6. Type new description
7. Click "Save"
8. Description updates in database
```

**Expected Results:**
- [ ] Gap score displays
- [ ] Pain points from model visible
- [ ] Suggested rewrite shows
- [ ] Edit form appears
- [ ] Description saves to database
- [ ] Changes persist after page reload

### 6. Admin Dashboard

#### Login as Admin
```
1. Go to /login
2. Select "Admin"
3. Login with admin credentials
```

**Expected Results:**
- [ ] Role is "Admin"
- [ ] Redirected to /admin/dashboard

#### View Analytics
```
1. Admin Dashboard loads
2. See KPI cards (Revenue, Orders, Return Rate, Rating)
3. See Category Performance table with charts
4. See Manufacturer Scorecards
5. See Top Issues section
```

**Expected Results:**
- [ ] All KPIs show correct aggregated data
- [ ] Category table has all categories
- [ ] Progress bars for metrics
- [ ] Manufacturers ranked
- [ ] Top issues listed by frequency

---

## API Endpoint Testing

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!","role":"customer"}'

# Response should include token
# Save token for subsequent requests

TOKEN="eyJhbGciOiJIUzI1NiIs..."

# Get Products
curl http://localhost:5000/api/catalog/products \
  -H "Authorization: Bearer $TOKEN"

# Get Product Details
curl http://localhost:5000/api/catalog/product/SKU001 \
  -H "Authorization: Bearer $TOKEN"

# Get Current User
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Create Order
curl -X POST http://localhost:5000/api/customer/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"skuId":"SKU001","quantity":1,"pricePerUnit":499.99}],"totalAmount":499.99,"paymentType":"credit_card"}'

# Get Orders
curl http://localhost:5000/api/customer/orders \
  -H "Authorization: Bearer $TOKEN"

# Get Manufacturer Dashboard
curl http://localhost:5000/api/manufacturer/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Get Admin Stats
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Create new workspace
2. Create requests for each endpoint
3. Set headers: `Authorization: Bearer <token>`
4. Test all variations (success, errors, edge cases)
5. Save requests to collection
6. Export collection for team

---

## Database Testing

### Verify Schema

```bash
# Connect to database
psql -h localhost -U postgres -d williams_sonoma_home

# List all tables
\d

# Check specific table
\d customers
\d products
\d orders

# Count records
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;

# Verify data integrity
SELECT * FROM customers LIMIT 5;
SELECT * FROM products LIMIT 5;
```

### Test Migrations

```typescript
// backend/src/config/migrations.ts should auto-run
// Verify in server logs on startup:
// "Running migration: create_customers_table"
// "Migration complete"

// If migrations don't run:
// Delete public.schema_migrations table
// Restart backend
// Migrations will re-run
```

---

## Performance Testing

### Load Test with Apache Bench

```bash
# Single endpoint
ab -n 1000 -c 100 http://localhost:5000/api/catalog/products

# With authentication
ab -n 1000 -c 100 -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/catalog/products
```

### Measure Response Times

```bash
# Using curl with timing
curl -w "\nTotal time: %{time_total}s\n" \
  http://localhost:5000/api/catalog/products
```

### Frontend Performance

```bash
# Lighthouse audit
# DevTools > Lighthouse > Analyze page load

# Bundle analysis
npm install -g webpack-bundle-analyzer
npm run analyze-bundle

# Check Core Web Vitals
# PageSpeed Insights: https://pagespeed.web.dev/
```

---

## Browser Testing

### Chrome/Edge/Safari

```
Devices to test:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Features to test:
- [ ] Responsive layout
- [ ] Touch interactions (mobile)
- [ ] Form inputs
- [ ] Charts rendering
- [ ] Console shows no errors
```

### Browser DevTools Checks

```
Console:
- [ ] No error messages
- [ ] No warning messages
- [ ] No undefined variable references

Network:
- [ ] All requests successful (200/201 status)
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] Response times < 500ms

Application:
- [ ] localStorage contains token
- [ ] localStorage contains cart data
- [ ] No blocked cookies
```

---

## Security Testing

### Input Validation

```bash
# Test SQL injection protection
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"\" OR \"1\"=\"1","password":"test","role":"customer"}'

# Should fail gracefully, not execute SQL

# Test XSS protection
# Try to submit: <script>alert("xss")</script>
# Should be escaped or sanitized (not executed)
```

### Authentication

```bash
# Test JWT validation
# Use invalid token
curl -H "Authorization: Bearer invalid_token" \
  http://localhost:5000/api/customer/orders

# Should return 401 Unauthorized

# Test expired token
# Create token with short expiration
# Wait for expiration
# Try to use expired token
# Should return 401
```

### Authorization (Role-Based Access)

```bash
# Login as Customer
TOKEN_CUSTOMER=$(curl -s -X POST ... | jq -r '.token')

# Try to access admin endpoint
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN_CUSTOMER"

# Should return 403 Forbidden (not 200)

# Test manufacturer-only endpoint
curl http://localhost:5000/api/manufacturer/dashboard \
  -H "Authorization: Bearer $TOKEN_CUSTOMER"

# Should return 403
```

---

## Error Handling Testing

### Test Error Scenarios

```bash
# 400 Bad Request
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}'  # Missing password

# 401 Unauthorized
curl http://localhost:5000/api/customer/orders
# No token provided

# 403 Forbidden
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"

# 404 Not Found
curl http://localhost:5000/api/nonexistent

# 500 Server Error
# Intentionally cause error (if possible)
```

---

## Integration Testing

### Full User Journey: Customer

```
1. Start at home page
2. Click "Browse Products"
3. Search for a product
4. View product details
5. Add to cart
6. View cart
7. Proceed to checkout (when implemented)
8. Place order
9. View order in Orders page
10. Initiate return
11. Verify return in system
```

### Full User Journey: Manufacturer

```
1. Login as manufacturer
2. View dashboard with alerts
3. Click on critical product
4. View product details with gap score
5. See AI-suggested description
6. Edit and save new description
7. Verify save reflected in database
8. Return to dashboard
9. Verify metrics updated
```

### Full User Journey: Admin

```
1. Login as admin
2. View dashboard
3. Check all KPIs display
4. View category performance
5. Check manufacturer rankings
6. Review top issues
7. Drill into specific metrics (if clicking implemented)
```

---

## Regression Testing Checklist

After any code changes, verify:

- [ ] Backend compiles without errors
- [ ] Frontend compiles without errors
- [ ] All API endpoints respond with 200/201
- [ ] Authentication still works
- [ ] Role-based access still enforced
- [ ] Database migrations still run
- [ ] Models load from JSON correctly
- [ ] Charts display in dashboards
- [ ] Forms submit without errors
- [ ] No new console errors
- [ ] Responsive design still works

---

## Automated Testing (For Future)

### Backend Unit Tests

```typescript
// backend/src/__tests__/auth.test.ts
import { generateToken, verifyToken } from '../utils/jwt';

describe('JWT Utilities', () => {
  test('generateToken creates valid token', () => {
    const token = generateToken({ id: '123', role: 'customer' });
    expect(token).toBeTruthy();
  });

  test('verifyToken validates correct token', () => {
    const token = generateToken({ id: '123' });
    const verified = verifyToken(token);
    expect(verified.id).toBe('123');
  });
});
```

### Frontend Component Tests

```typescript
// frontend/src/__tests__/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/ProductComponents';

describe('ProductCard', () => {
  test('renders product name and price', () => {
    const product = {
      skuId: 'SKU001',
      name: 'Chair',
      price: 299.99,
      imageUrl: 'https://...'
    };
    
    render(<ProductCard product={product} />);
    expect(screen.getByText('Chair')).toBeInTheDocument();
    expect(screen.getByText('$299.99')).toBeInTheDocument();
  });
});
```

---

## User Acceptance Testing (UAT)

Provide test accounts to business stakeholders:

```
Customer Account:
- Email: customer@test.com
- Password: TestPass123!
- Role: Customer

Manufacturer Account:
- Email: manufacturer@test.com
- Password: TestPass123!
- Role: Manufacturer

Admin Account:
- Email: admin@test.com
- Password: TestPass123!
- Role: Admin
```

Stakeholders verify:
- [ ] Can complete intended workflows
- [ ] UI matches design requirements
- [ ] Data displays correctly
- [ ] Performance is acceptable
- [ ] No obvious bugs encountered

---

## Bug Reporting Template

When bugs are found:

```
Title: [Component] Brief description

Severity: Critical/High/Medium/Low

Steps to Reproduce:
1. Step 1
2. Step 2
3. ...

Expected Result:
What should happen

Actual Result:
What actually happened

Screenshots/Video:
[Attach if possible]

Environment:
- Browser: Chrome 120.0
- OS: Windows 11
- Backend: Running locally
- Frontend: Running locally
```

---

## Sign-Off Checklist

Before declaring system ready:

- [ ] All tests pass
- [ ] No open critical bugs
- [ ] Performance acceptable
- [ ] Security review complete
- [ ] Stakeholder UAT complete
- [ ] Documentation complete
- [ ] Deployment process tested
- [ ] Rollback procedure documented
- [ ] Monitoring configured
- [ ] Team trained on system

---

See main README.md for additional resources and support.
