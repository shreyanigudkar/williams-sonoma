import pool from './src/config/database';

async function fix() {
  await pool.query('ALTER TABLE reviews ALTER COLUMN review_date SET DEFAULT NOW()');
  console.log('✅ review_date column default set to NOW()');
  await pool.end();
}

fix().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
