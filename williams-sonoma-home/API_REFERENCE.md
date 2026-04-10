# API Reference

Complete API documentation for Williams Sonoma Home backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained via `/auth/login` or `/auth/signup` and are valid for 7 days.

## Response Format

All responses are JSON:

### Success Response
```json
{
  "data": { ... },
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

---

## Endpoints

### Authentication

#### POST /auth/login
User login with role selection.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cust_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid credentials
- `404` - User not found

---

#### POST /auth/signup
Register new customer account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "ageGroup": "30-40",
  "lifestyleTags": "family,pet-owner",
  "preferredStyles": "modern,minimalist",
  "preferredColors": "neutral,warm",
  "lightingCondition": "bright"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "cust_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Status Codes:**
- `201` - Account created
- `400` - Invalid input or email exists

---

#### GET /auth/me
Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "cust_123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "customer",
  "preferences": {
    "ageGroup": "30-40",
    "lifestyleTags": "family,pet-owner",
    "preferredStyles": "modern,minimalist",
    "preferredColors": "neutral,warm",
    "lightingCondition": "bright"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

### Catalog (Public)

#### GET /catalog/products
Fetch products with optional filtering and sorting.

**Query Parameters:**
- `category` (string, optional) - Filter by category. Default: "All"
- `search` (string, optional) - Search product name or description
- `sort` (string, optional) - Sort order. Options: "featured", "price-low", "price-high", "rating". Default: "featured"
- `limit` (number, optional) - Results per page. Max: 100. Default: 20
- `offset` (number, optional) - Pagination offset. Default: 0

**Example:**
```
GET /catalog/products?category=Furniture&search=chair&sort=price-low&limit=10&offset=0
```

**Response:**
```json
{
  "products": [
    {
      "skuId": "SKU001",
      "name": "Premium Chair",
      "brand": "West Elm",
      "price": 499.99,
      "imageUrl": "https://via.placeholder.com/400x400/8B7355/FFFFFF?text=Premium+Chair",
      "rating": 4.5,
      "ratingCount": 123,
      "tags": ["comfortable", "durable", "modern"],
      "category": "Furniture"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

#### GET /catalog/product/:skuId
Get detailed product information.

**Parameters:**
- `skuId` (string, required) - Product SKU identifier

**Example:**
```
GET /catalog/product/SKU001
```

**Response:**
```json
{
  "skuId": "SKU001",
  "name": "Premium Chair",
  "brand": "West Elm",
  "category": "Furniture",
  "subCategory": "Seating",
  "price": 499.99,
  "description": "Beautifully crafted chair...",
  "imageUrl": "https://via.placeholder.com/400x400/8B7355/FFFFFF?text=Premium+Chair",
  "rating": 4.5,
  "ratingCount": 123,
  "specifications": {
    "material": "Fabric upholstery",
    "color": "Charcoal",
    "finish": "Matte",
    "dimensions": "32\"H x 28\"W x 30\"D",
    "weight": "45 lbs",
    "style": "Mid-Century Modern"
  },
  "tags": [
    {
      "label": "comfortable",
      "type": "positive"
    },
    {
      "label": "durable",
      "type": "positive"
    }
  ]
}
```

---

#### GET /catalog/product/:skuId/insights
Get AI-powered insights for a product.

**Parameters:**
- `skuId` (string, required) - Product SKU identifier

**Response:**
```json
{
  "buyersLikeYou": [
    {
      "initials": "JD",
      "matchPercentage": 85,
      "context": "Similar taste preference",
      "rating": 5,
      "excerpt": "This chair is exactly what I was looking for..."
    }
  ],
  "returnReasons": ["shipping delay", "color mismatch", "quality"],
  "highlights": {
    "pros": ["comfortable", "stylish", "durable"],
    "cons": ["shipping time", "color variation"]
  },
  "suggestedRewrite": "Enhanced product description...",
  "originalDescription": "Original description..."
}
```

---

#### GET /catalog/categories
Get available product categories.

**Response:**
```json
{
  "categories": [
    "All",
    "Furniture",
    "Lighting",
    "Kitchen",
    "Decor",
    "Bedding",
    "Bath"
  ]
}
```

---

### Customer Routes (Protected: role = "customer")

#### GET /customer/orders
Get customer's order history.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "orders": [
    {
      "orderId": "ord_123",
      "orderDate": "2024-04-10T10:30:00Z",
      "deliveryDate": "2024-04-15T14:20:00Z",
      "totalAmount": 1299.98,
      "itemCount": 2,
      "status": "delivered",
      "items": [
        {
          "skuId": "SKU001",
          "quantity": 1,
          "pricePerUnit": 499.99,
          "productName": "Premium Chair"
        }
      ]
    }
  ]
}
```

---

#### POST /customer/orders
Create a new order.

**Request:**
```json
{
  "items": [
    {
      "skuId": "SKU001",
      "quantity": 1,
      "pricePerUnit": 499.99
    }
  ],
  "totalAmount": 499.99,
  "paymentType": "credit_card"
}
```

**Response:**
```json
{
  "orderId": "ord_123",
  "orderDate": "2024-04-10T10:30:00Z"
}
```

**Status Codes:**
- `201` - Order created
- `400` - Invalid input

---

#### POST /customer/returns
Initiate a product return.

**Request:**
```json
{
  "orderId": "ord_123",
  "orderItemId": "oi_456",
  "skuId": "SKU001",
  "reason": "damaged",
  "note": "Package arrived with dent on corner"
}
```

**Response:**
```json
{
  "returnId": "ret_123",
  "status": "pending",
  "returnDate": "2024-04-10T10:30:00Z"
}
```

**Status Codes:**
- `201` - Return initiated
- `400` - Invalid order

---

#### GET /customer/product/:skuId/similar-reviews
Get customer reviews for a product.

**Parameters:**
- `skuId` (string, required) - Product SKU identifier

**Response:**
```json
{
  "reviews": [
    {
      "reviewId": "rev_123",
      "author": "John Doe",
      "rating": 5,
      "title": "Excellent quality",
      "text": "Very satisfied with this purchase...",
      "date": "2024-04-01T15:30:00Z"
    }
  ]
}
```

---

### Manufacturer Routes (Protected: role = "manufacturer")

#### GET /manufacturer/dashboard
Get manufacturer dashboard data.

**Response:**
```json
{
  "priorityActions": [
    {
      "level": "critical",
      "productName": "Premium Chair",
      "issue": "Fix product photos",
      "revenueAtRisk": "$9276.70",
      "urgencyScore": 927670
    }
  ],
  "metrics": {
    "totalProducts": 150,
    "criticalAlerts": 5,
    "averageReturnRate": 13.1
  },
  "returnRateTrend": [
    {
      "week": "Week 1",
      "rate": 12.5
    }
  ],
  "topReturnReasons": [
    {
      "reason": "Color mismatch",
      "percentage": 28
    }
  ]
}
```

---

#### GET /manufacturer/products
Get list of manufacturer's products.

**Response:**
```json
{
  "products": [
    {
      "skuId": "SKU001",
      "name": "Premium Chair",
      "category": "Furniture",
      "price": 499.99,
      "returnRate": 8.5,
      "riskLevel": "high"
    }
  ]
}
```

---

#### GET /manufacturer/product/:skuId
Get product detail with AI insights.

**Response:**
```json
{
  "skuId": "SKU001",
  "productName": "Premium Chair",
  "gapScore": 65,
  "originalDescription": "...",
  "suggestedRewrite": "...",
  "missingAttributes": ["Weight", "Care instructions"],
  "painPoints": ["shipping", "quality", "color"],
  "urgencyScore": 650000,
  "revenueAtRisk": 6500
}
```

---

#### PUT /manufacturer/product/:skuId/description
Update product description.

**Request:**
```json
{
  "description": "Updated product description..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Description updated"
}
```

---

### Admin Routes (Protected: role = "admin")

#### GET /admin/stats
Get platform statistics.

**Response:**
```json
{
  "totalRevenue": 250000,
  "totalOrders": 1234,
  "overallReturnRate": 13.2,
  "averageRating": 4.5
}
```

---

#### GET /admin/categories
Get category performance.

**Response:**
```json
{
  "categories": [
    {
      "category": "Furniture",
      "productCount": 50,
      "averagePrice": "549.99"
    }
  ]
}
```

---

#### GET /admin/manufacturers
Get manufacturer data.

**Response:**
```json
{
  "manufacturers": [
    {
      "brand": "West Elm",
      "productCount": 35,
      "averagePrice": "599.99"
    }
  ]
}
```

---

#### GET /admin/top-issues
Get platform-wide issues.

**Response:**
```json
{
  "topIssues": [
    {
      "issue": "shipping delay",
      "frequency": 145
    }
  ]
}
```

---

## Error Handling

All errors return appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Server Error |

**Error Response Format:**
```json
{
  "error": "Descriptive error message"
}
```

---

## Rate Limiting

No rate limiting currently implemented. Production deployment should add this.

---

## Pagination

For paginated endpoints, use `limit` and `offset` query parameters:

```
GET /catalog/products?limit=20&offset=0
GET /catalog/products?limit=20&offset=20
```

---

## Sorting

Supported sort options vary by endpoint. Check individual endpoint docs.

---

## Filtering

Category, search, and other filters are applied via query parameters.

---

## Example Client Usage

### JavaScript/TypeScript
```typescript
// Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    role: 'customer'
  })
});
const { token } = await loginRes.json();

// Fetch products
const productsRes = await fetch('/api/catalog/products?limit=10', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await productsRes.json();
```

---

See individual controller files for implementation details.
