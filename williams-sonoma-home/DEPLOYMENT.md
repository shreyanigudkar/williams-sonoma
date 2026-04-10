# Deployment Guide

Complete guide to deploying Williams Sonoma Home to production.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+ with pgvector extension
- Git for version control
- Cloud hosting account (Heroku, AWS, Azure, Vercel, Netlify, etc.)

## Backend Deployment

### Option 1: Heroku (Recommended for Beginners)

#### 1. Create Heroku App

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create williams-sonoma-home-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0 -a williams-sonoma-home-api

# Enable pgvector extension
heroku pg:psql DATABASE_URL -a williams-sonoma-home-api
# In psql console:
# CREATE EXTENSION IF NOT EXISTS vector;
# \q
```

#### 2. Configure Environment

```bash
# Set environment variables
heroku config:set JWT_SECRET=your-production-secret -a williams-sonoma-home-api
heroku config:set GROQ_API_KEY=your-groq-api-key -a williams-sonoma-home-api
heroku config:set PORT=5000 -a williams-sonoma-home-api
```

#### 3. Deploy

```bash
# Add Procfile in backend root
echo "web: npm run migrate && npm start" > Procfile

# Commit and deploy
git add .
git commit -m "Add Procfile for Heroku"
git push heroku main
```

#### 4. Verify

```bash
heroku logs --tail -a williams-sonoma-home-api
# Should see: "✨ Williams Sonoma Home Backend running on port 5000"
```

---

### Option 2: AWS EC2

#### 1. Launch EC2 Instance

```bash
# Use Ubuntu 22.04 LTS
# Security group: Allow ports 22 (SSH), 5000 (Backend)
# Create key pair and save locally
```

#### 2. Connect & Setup

```bash
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib postgis
sudo apt install -y postgresql-13-pgrouting

# Enable pgvector
sudo -u postgres psql
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

#### 3. Deploy Application

```bash
# Clone repository
git clone your-repo-url
cd williams-sonoma-home/backend

# Install dependencies
npm install

# Build
npm run build

# Configure environment
cp .env.example .env
# Edit .env with production settings

# Start with PM2 for process management
npm install -g pm2
pm2 start dist/index.js --name "williams-sonoma-api"
pm2 startup
pm2 save
```

#### 4. Setup Reverse Proxy (Nginx)

```bash
sudo apt install -y nginx

# Create nginx config
sudo tee /etc/nginx/sites-available/williams-sonoma << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/williams-sonoma /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 3: Docker + Container Registry

#### 1. Create Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### 2. Build & Push

```bash
# Build image
docker build -t williams-sonoma-api:latest .

# Tag for registry
docker tag williams-sonoma-api:latest your-registry/williams-sonoma-api:latest

# Push to registry (Docker Hub, ECR, etc.)
docker push your-registry/williams-sonoma-api:latest
```

#### 3. Deploy on AWS ECS / Google Cloud Run

Refer to cloud provider documentation for containerized deployment.

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
# During setup, configure environment variables:
# VITE_API_URL=https://your-api-domain.com/api

# Set production URL
vercel env add VITE_API_URL
# Enter: https://your-api-domain.com/api
```

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod

# Configure build settings:
# - Build command: npm run build
# - Publish directory: dist

# Set environment variables in Netlify dashboard:
# VITE_API_URL=https://your-api-domain.com/api
```

---

### Option 3: AWS S3 + CloudFront

```bash
# Build for production
npm run build

# Create S3 bucket
aws s3 mb s3://williams-sonoma-home-frontend

# Upload files
aws s3 sync dist/ s3://williams-sonoma-home-frontend --delete

# Create CloudFront distribution
# Point to S3 bucket
# Set cache behaviors
```

---

## Database Deployment

### PostgreSQL Managed Services

#### AWS RDS
```bash
# Create RDS instance
# Engine: PostgreSQL 13+
# Enable: Multi-AZ, Enhanced monitoring
# Security group: Allow backend security group

# Enable pgvector
PGPASSWORD=your-password psql \
  -h your-rds-endpoint.us-east-1.rds.amazonaws.com \
  -U postgres \
  -d williams_sonoma_home \
  -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

#### Google Cloud SQL
```bash
gcloud sql instances create williams-sonoma-db \
  --database-version POSTGRES_13 \
  --region us-central1

# Enable pgvector extension
gcloud sql connect williams-sonoma-db \
  --user=postgres

# Inside psql:
# CREATE EXTENSION IF NOT EXISTS vector;
```

#### Azure Database for PostgreSQL
```bash
az postgres server create \
  --resource-group myResourceGroup \
  --name williams-sonoma-db \
  --location eastus

# Connect and enable pgvector
psql -h williams-sonoma-db.postgres.database.azure.com \
  -U admin@williams-sonoma-db \
  -d postgres

# CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Environment Variables (Production)

### Backend (.env)
```env
PORT=5000
DB_HOST=your-rds-endpoint
DB_PORT=5432
DB_USER=postgres_prod
DB_PASSWORD=strong-production-password
DB_NAME=williams_sonoma_home
JWT_SECRET=very-long-random-secret-key-min-32-chars
GROQ_API_KEY=your-production-groq-api-key
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-api-domain.com/api
```

---

## SSL/TLS Certificates

### Let's Encrypt (Free)
```bash
# Using Certbot
sudo certbot certonly --standalone -d your-domain.com
sudo certbot certonly --standalone -d api.your-domain.com

# Renews automatically with cron job
```

### AWS Certificate Manager
```bash
aws acm request-certificate \
  --domain-name your-domain.com \
  --subject-alternative-names api.your-domain.com
```

---

## Monitoring & Logging

### Application Logs

#### Backend (PM2)
```bash
pm2 logs williams-sonoma-api
pm2 save logs to file
```

#### Frontend (Vercel/Netlify)
- Built-in analytics and logs
- Real-time error tracking

### Uptime Monitoring
```bash
# Using services like:
# - Pingdom
# - UptimeRobot
# - Datadog
# - New Relic

# Monitor endpoints:
# - GET /health (backend)
# - Home page (frontend)
```

### Error Tracking
```bash
# Integrate with:
# - Sentry
# - Rollbar
# - Bugsnag

# Example (Sentry):
npm install @sentry/node @sentry/tracing
# Configure in server startup
```

---

## Performance Optimization

### Backend
```typescript
// Enable compression
import compression from 'compression';
app.use(compression());

// Cache headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

### Frontend
```bash
# Build optimizations
npm run build

# Check bundle size
npm install -g webpack-bundle-analyzer
webbpack-bundle-analyzer dist/stats.json

# Lazy loading
# Code splitting
# Image optimization
```

---

## Database Backups

### Automated Backups

#### AWS RDS
- Automated daily backups (35-day retention)
- Manual snapshots before major changes

#### Custom Backup Script
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)

pg_dump -h localhost -U postgres williams_sonoma_home | \
  gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Keep only last 30 days
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +30 -delete
```

### Schedule with Cron
```bash
0 2 * * * /path/to/backup.sh  # Run daily at 2 AM
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (AWS ALB, Nginx)
- Deploy multiple backend instances
- Use read replicas for database

### Vertical Scaling
- Increase server resources
- Upgrade database tier
- Cache frequently accessed data

### Database Optimization
```sql
-- Add indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_reviews_sku ON reviews(sku_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- Vector index for embeddings
CREATE INDEX idx_embeddings_vector ON user_embeddings USING ivfflat (embedding_vector vector_cosine_ops);
```

---

## Security Best Practices

- ✅ Use HTTPS/SSL everywhere
- ✅ Keep dependencies updated
- ✅ Use strong passwords and keys
- ✅ Enable two-factor authentication
- ✅ Regular security audits
- ✅ Rate limiting on APIs
- ✅ CORS properly configured
- ✅ Secrets in environment variables
- ✅ Database credentials encrypted
- ✅ Regular backups tested

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql -h your-host -U your-user -d your-database

# Check firewall rules
# Verify security groups
# Check credentials in .env
```

### API Not Responding
```bash
# Check server logs
pm2 logs

# Verify ports are open
netstat -tlnp | grep 5000

# Restart service
pm2 restart williams-sonoma-api
```

### High Latency
```bash
# Monitor database queries
# Check network bandwidth
# Review application logs
# Enable caching where appropriate
```

---

## Post-Deployment Checklist

- [ ] SSL certificate installed
- [ ] Environment variables set correctly
- [ ] Database backups automated
- [ ] Monitoring and alerts configured
- [ ] Error tracking integrated
- [ ] Health check endpoint working
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Logging to central location
- [ ] Performance metrics being tracked
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Documentation updated
- [ ] Team has deployment runbook
- [ ] Disaster recovery plan prepared

---

See individual cloud provider docs for more details.
