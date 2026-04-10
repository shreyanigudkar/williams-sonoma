# Data Integration Schema

This document describes how your trained models and data integrate with the Williams Sonoma Home platform.

## Model Integration

### 1. Training Scripts Location
```
models/
├── client/
│   ├── train_delivery_aggregator.py
│   ├── train_faiss_indexer.py
│   ├── train_profile_embedder.py
│   ├── train_review_nlp_summarizer.py
│   ├── train_score_api_prep.py
│   └── results/
│       ├── faiss_customer_map.csv
│       ├── latest_product_scores.json
│       ├── shipping_stats.json
│       └── sku_summaries.json
└── server/
    ├── train_dashboard_nlp_tagger.py
    ├── train_ews_model.py
    ├── train_gap_analyzer.py
    ├── train_priority_scorer.py
    ├── train_return_aggregator.py
    ├── train_time_series.py
    └── results/
        ├── listing_gaps.json
        ├── priority_actions.json
        ├── return_rates.csv
        ├── rolling_scores.csv
        └── top_return_reasons.json
```

### 2. API Integration Points

#### sku_summaries.json → Product Tags
- **Location**: `models/client/results/sku_summaries.json`
- **Used In**: 
  - Product catalog cards (3-4 tags per product)
  - Product detail page insights
- **Structure**:
  ```json
  {
    "sku_id": "SKU001",
    "tags": [
      {"label": "material", "type": "positive"},
      {"label": "durability", "type": "positive"},
      {"label": "shipping delay", "type": "negative"}
    ]
  }
  ```

#### priority_actions.json → Manufacturer Alerts
- **Location**: `models/server/results/priority_actions.json`
- **Used In**:
  - Manufacturer dashboard priority queue
  - Product detail insights (suggested rewrites)
  - Admin dashboard top issues
- **Structure**:
  ```json
  {
    "sku_id": "SKU001",
    "product_name": "Premium Chair",
    "urgency_score": 850000,
    "revenue_at_risk": 5000.50,
    "action": "Fix product photos",
    "pain_points": ["damaged", "photos", "arrived"],
    "suggested_rewrite": "Improved product description..."
  }
  ```

#### User_Profile_Embeddings.csv → Personalization
- **Location**: `models/client/results/User_Profile_Embeddings.csv`
- **Used In**:
  - Similar customer matching ("Buyers Like You")
  - Recommended products (pgvector similarity search)
- **Structure**:
  ```csv
  customer_id,embedding_vector
  cust_001,"0.123,0.456,0.789..."
  ```
- **In DB**: Stored in `user_embeddings` table with pgvector type

## Data Pipeline

### 1. Load Models on Server Start
```typescript
// backend/src/controllers/catalog.ts
const loadInsights = () => {
  const priorityPath = '.../models/server/results/priority_actions.json'
  const summariesPath = '.../models/client/results/sku_summaries.json'
  // Parsed on app initialization
}
```

### 2. Enrich API Responses
```
GET /api/catalog/products
  ↓
Load from DB (products, orders, reviews)
  ↓
Enrich with sku_summaries.json (tags)
  ↓
Enrich with priority_actions.json (revenue at risk, suggested rewrites)
  ↓
Return combined data
```

### 3. Display in Frontend
```
Product Card:
  - Image, name, price
  - Rating (from reviews)
  - Tags (from sku_summaries)

Product Detail:
  - Specifications
  - "Buyers Like You" (matched from embeddings)
  - Return Reasons (from priority_actions.pain_points)
  - Suggested Rewrite (from priority_actions.suggested_rewrite)

Manufacturer Dashboard:
  - Priority Actions (from priority_actions sorted by urgency_score)
  - Return Rate Trend (from return_rates.csv)
  - Top Return Reasons (aggregated from pain_points)
```

## Data Synchronization

### Import CSV to Database

```python
# Python script to import trained data into PostgreSQL

import pandas as pd
import psycopg2

# Connect to database
conn = psycopg2.connect(
    host="localhost",
    database="williams_sonoma_home",
    user="postgres",
    password="postgres"
)

# Import embeddings
embeddings_df = pd.read_csv('models/client/results/User_Profile_Embeddings.csv')
cursor = conn.cursor()

for idx, row in embeddings_df.iterrows():
    cursor.execute(
        "INSERT INTO user_embeddings (customer_id, embedding_vector) VALUES (%s, %s)",
        (row['customer_id'], row['embedding_vector'])
    )

conn.commit()
cursor.close()
conn.close()
```

### Update Data Pipeline

Schedule periodic retraining:

```bash
# Run training scripts
cd models/client && python train_profile_embedder.py
cd ../server && python train_priority_scorer.py

# Restart backend to load new data
pm2 restart backend
```

## Model Output Schema

### priority_actions.json (Manufacturer Alerts)
```json
{
  "sku_id": "SKU00026",
  "product_name": "West Elm Premium Chair",
  "urgency_score": 927670.0000000001,
  "velocity": 100,
  "revenue_at_risk": 9276.7,
  "action": "Fix photos",
  "pain_points": ["board", "box", "color", "photos", "wood"],
  "original_description": "...",
  "suggested_rewrite": "...",
  "risk_level": "critical"  // auto-calculated: critical (>700k), high (>400k), medium, low
}
```

### sku_summaries.json (Product Insights)
```json
{
  "sku_id": "SKU00084",
  "tags": [
    {
      "label": "happily",
      "type": "positive",
      "frequency": 15
    },
    {
      "label": "damaged",
      "type": "negative", 
      "frequency": 8
    }
  ],
  "ai_summary": "Customers love the design but report quality issues in shipment..."
}
```

### return_rates.csv (Trends)
```csv
sku_id,week,return_rate,velocity,revenue_at_risk
SKU001,week_1,5.2,10,500.00
SKU001,week_2,6.1,12,610.00
```

## Environment Variables for AI

```bash
# backend/.env
GROQ_API_KEY=your-api-key        # For AI description rewriting
FAISS_INDEX_PATH=./models/client/results/faiss_customer_map.csv  # For similarity search
```

## Performance Metrics

**Data Loading**: ~50-100ms at server startup
**API Response Time**: +0-10ms for data enrichment
**Memory Usage**: All model results kept in memory (~2-5MB)

## Future Enhancements

1. **Real-time Updates**: Stream model results via WebSocket
2. **Vector Search**: Full pgvector integration for product recommendations
3. **A/B Testing**: Track impact of AI suggestions on conversions
4. **Model Retraining**: Automated nightly jobs with cron
5. **Feedback Loop**: Collect user interactions to improve suggestions

---

See model training code in `models/*/train_*.py` for implementation details.
