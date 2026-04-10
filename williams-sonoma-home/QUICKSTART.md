# Quick Start Guide

Get the Williams Sonoma Home platform up and running in 5 minutes.

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 13+ ([Download](https://www.postgresql.org/download/))
- **Git** (optional)

## Step 1: Run Setup Script

### macOS / Linux
```bash
chmod +x setup.sh
./setup.sh
```

### Windows
```cmd
setup.bat
```

This will:
- ✅ Create backend and frontend folders
- ✅ Install all dependencies  
- ✅ Create .env configuration files
- ✅ Prepare everything for launch

## Step 2: Configure Database

### Create Database
```bash
createdb williams_sonoma_home
```

### Enable Vector Extension
```bash
psql -d williams_sonoma_home
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

### Update Credentials
Edit `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=williams_sonoma_home
```

## Step 3: Start Backend

```bash
cd backend
npm run dev
```

✓ Backend starts on `http://localhost:5000`
✓ Migrations run automatically
✓ Data models created in database

## Step 4: Start Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

✓ Frontend starts on `http://localhost:3000`

## Step 5: Test the Platform

### Home Page
Visit http://localhost:3000

### Browse Catalog
http://localhost:3000/catalog

### Create Account (Test)
- Go to /signup
- Fill in details
- Select "Customer" role
- Complete signup

### Login
- Go to /login
- Use your credentials
- Role: Customer

### Explore Dashboards

**Manufacturer Dashboard** (After signing up as manufacturer):
- http://localhost:3000/manufacturer
- View priority alerts
- See return rate trends

**Admin Dashboard** (After signing up as admin):
- http://localhost:3000/admin
- View platform statistics
- Analyze performance

## Test Account Demo Data

You can also seed test data:

```bash
# Backend seed script (optional)
cd backend
npm run seed  # If seed script exists
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in backend
PORT=5001 npm run dev

# Change port in frontend  
npm run dev -- --port 3001
```

### Database Connection Error
1. Verify PostgreSQL is running
2. Check credentials in `.env`
3. Confirm database exists: `psql -l`

### Module Not Found
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### API Not Responding
1. Ensure backend is running on :5000
2. Check browser console for cors errors
3. Verify VITE_API_URL in frontend/.env.local

## Common Commands

### Backend
```bash
npm run dev             # Start development server
npm run build           # Compile TypeScript
npm run migrate         # Run migrations manually
npm start               # Run compiled code
```

### Frontend
```bash
npm run dev             # Start dev server with HMR
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## Project Structure Review

```
williams-sonoma-home/
├── backend/              # API server
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── models/       # Database queries
│   │   └── config/       # DB & JWT config
│   ├── package.json
│   └── .env              # Database credentials
│
├── frontend/             # React UI
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API client
│   │   └── types/        # TypeScript types
│   ├── package.json
│   └── .env.local        # API URL config
│
├── README.md             # Main documentation
├── INTEGRATION.md        # Model integration guide
└── setup.sh             # Automated setup
```

## Key Files to Review

- **Backend Routes**: `backend/src/routes/index.ts`
- **API Endpoints**: All controller files in `backend/src/controllers/`
- **Frontend Components**: `frontend/src/components/`
- **Database Schema**: `backend/src/config/migrations.ts`
- **Type Definitions**: `frontend/src/types/index.ts`

## Accessing Models Data

Your trained models are integrated:

- **Priority Actions**: Loaded in manufacturer dashboard
- **SKU Summaries**: Used as product tags
- **User Embeddings**: Used for personalization
- **Return Analysis**: Displayed in insights

See `INTEGRATION.md` for detailed integration documentation.

## Next Steps

1. **Explore the Code**: Review files mentioned above
2. **Test All Flows**: Signup → Browse → Order → Return
3. **Check Manufacturer View**: See AI insights and suggestions
4. **Review Admin Dashboard**: Platform analytics
5. **Read Full Docs**: `README.md`, `backend/README.md`, `frontend/README.md`

## Support

- Check individual README files for specific issues
- Review `.env.example` files for configuration options
- See INTEGRATION.md for model data details

---

**Ready to go!** 🚀

Let me know if you hit any snags - all tools are configuration-based, nothing complex to debug.
