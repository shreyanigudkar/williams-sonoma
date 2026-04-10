@echo off
setlocal enabledelayedexpansion

echo 🚀 Williams Sonoma Home - Full Stack Setup
echo.

REM Check prerequisites
echo ✓ Checking prerequisites...
where node >nul 2>nul || (
  echo ❌ Node.js required
  exit /b 1
)
where npm >nul 2>nul || (
  echo ❌ npm required
  exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i

echo ✓ Node version: %NODE_VER%
echo ✓ npm version: %NPM_VER%
echo.

REM Backend setup
echo 📦 Setting up Backend...
cd backend
echo   Installing dependencies...
call npm install >nul 2>nul
echo   ✓ Dependencies installed

if not exist .env (
  echo   Creating .env file...
  copy .env.example .env >nul
  echo   ⚠️  Update backend\.env with your database credentials!
)

echo ✓ Backend ready
cd ..
echo.

REM Frontend setup
echo 📦 Setting up Frontend...
cd frontend
echo   Installing dependencies...
call npm install >nul 2>nul
echo   ✓ Dependencies installed

if not exist .env.local (
  echo   Creating .env.local file...
  copy .env.example .env.local >nul
)

echo ✓ Frontend ready
cd ..
echo.

REM Database info
echo 🗄️  Database Setup Instructions:
echo   1. Create database: createdb williams_sonoma_home
echo   2. Enable pgvector: psql -d williams_sonoma_home -c "CREATE EXTENSION IF NOT EXISTS vector;"
echo   3. Update backend\.env with your credentials
echo   4. Migrations run automatically on first backend start
echo.

REM Ready to go
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo   1. Update credentials in backend\.env
echo   2. Start backend:  cd backend ^&^& npm run dev
echo   3. Start frontend: cd frontend ^&^& npm run dev
echo.
echo 🌐 Access at: http://localhost:3000
echo.

endlocal
