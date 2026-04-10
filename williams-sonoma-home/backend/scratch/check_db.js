const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/williams_sonoma'
});

async function check() {
  try {
    const clients = await pool.query('SELECT external_id, full_name, lighting_condition FROM customers WHERE external_id IS NOT NULL LIMIT 5;');
    console.log('Sample Customers:', JSON.stringify(clients.rows, null, 2));
    
    const count = await pool.query('SELECT COUNT(*) FROM customers WHERE external_id IS NOT NULL;');
    console.log('Total customers with external_id:', count.rows[0].count);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

check();
