import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/error';
import dotenv from 'dotenv';
import runMigrations from './config/migrations';
import { seedDatabase } from './config/seedData';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database with migrations and seed data
const initDatabase = async () => {
  try {
    await runMigrations();
    await seedDatabase();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

initDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✨ Williams Sonoma Home Backend running on port ${PORT}`);
});

export default app;
