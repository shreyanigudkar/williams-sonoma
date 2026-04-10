#!/bin/bash
set -e

echo "🚀 Williams Sonoma Home - Full Stack Setup"
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm required"; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "⚠️  PostgreSQL client not found (but may be installed)"; }

echo "✓ Node version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend
echo "  Installing dependencies..."
npm install > /dev/null 2>&1
echo "  ✓ Dependencies installed"

if [ ! -f .env ]; then
  echo "  Creating .env file..."
  cp .env.example .env
  echo "  ⚠️  Update backend/.env with your database credentials!"
fi

echo "✓ Backend ready"
cd ..
echo ""

# Frontend setup
echo "📦 Setting up Frontend..."
cd frontend
echo "  Installing dependencies..."
npm install > /dev/null 2>&1
echo "  ✓ Dependencies installed"

if [ ! -f .env.local ]; then
  echo "  Creating .env.local file..."
  cp .env.example .env.local
fi

echo "✓ Frontend ready"
cd ..
echo ""

# Database info
echo "🗄️  Database Setup Instructions:"
echo "  1. Create database: createdb williams_sonoma_home"
echo "  2. Enable pgvector: psql -d williams_sonoma_home -c 'CREATE EXTENSION IF NOT EXISTS vector;'"
echo "  3. Update backend/.env with your credentials"
echo "  4. Migrations run automatically on first backend start"
echo ""

# Ready to go
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Update credentials in backend/.env"
echo "  2. Start backend:  cd backend && npm run dev"
echo "  3. Start frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access at: http://localhost:3000"
echo ""
