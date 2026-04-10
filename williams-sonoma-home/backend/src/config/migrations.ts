import pool from '../config/database';

const migrations = [
  {
    name: '001-create-customers',
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS customers (
          customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          external_id VARCHAR(50) UNIQUE,
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'customer',
          age_group VARCHAR(50),
          lifestyle_tags TEXT,
          preferred_styles TEXT,
          preferred_colors TEXT,
          lighting_condition VARCHAR(100),
          avg_spend DECIMAL(10, 2) DEFAULT 0,
          return_rate DECIMAL(5, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    },
  },
  {
    name: '002-create-products',
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          sku_id VARCHAR(50) PRIMARY KEY,
          product_name VARCHAR(255) NOT NULL,
          category VARCHAR(100),
          sub_category VARCHAR(100),
          brand VARCHAR(100),
          price DECIMAL(10, 2),
          material VARCHAR(255),
          color VARCHAR(100),
          finish VARCHAR(100),
          dimensions VARCHAR(255),
          weight VARCHAR(100),
          style VARCHAR(100),
          description_text TEXT,
          image_url VARCHAR(500),
          launch_date TIMESTAMP,
          rating DECIMAL(3, 2) DEFAULT 4.5,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    },
  },
  {
    name: '003-create-orders',
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          customer_id UUID NOT NULL REFERENCES customers(customer_id),
          order_date TIMESTAMP NOT NULL,
          delivery_date TIMESTAMP,
          shipping_time_days INTEGER,
          total_amount DECIMAL(10, 2) NOT NULL,
          payment_type VARCHAR(50),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    },
  },
  {
    name: '004-create-order-items',
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          order_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID NOT NULL REFERENCES orders(order_id),
          sku_id VARCHAR(50) NOT NULL REFERENCES products(sku_id),
          quantity INTEGER NOT NULL,
          price_per_unit DECIMAL(10, 2) NOT NULL,
          discount DECIMAL(5, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    },
  },
  {
    name: '005-create-returns',
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS returns (
          return_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID NOT NULL REFERENCES orders(order_id),
          order_item_id UUID NOT NULL REFERENCES order_items(order_item_id),
          sku_id VARCHAR(50) NOT NULL REFERENCES products(sku_id),
          customer_id UUID NOT NULL REFERENCES customers(customer_id),
          return_reason VARCHAR(255),
          return_note TEXT,
          return_date TIMESTAMP NOT NULL,
          return_status VARCHAR(50) DEFAULT 'pending',
          refund_amount DECIMAL(10, 2),
          return_shipping_cost DECIMAL(10, 2),
          condition_received VARCHAR(100),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    },
  },
  {
    name: '006-create-reviews',
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sku_id VARCHAR(50) NOT NULL REFERENCES products(sku_id),
          customer_id UUID NOT NULL REFERENCES customers(customer_id),
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          review_title VARCHAR(255),
          sentiment_score DECIMAL(3, 2),
          review_date TIMESTAMP NOT NULL DEFAULT NOW(),
          verified_purchase BOOLEAN DEFAULT false,
          image_uploaded BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    },
  },
  {
    name: '007-create-embeddings',
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_embeddings (
          customer_id UUID PRIMARY KEY REFERENCES customers(customer_id),
          embedding_vector TEXT,
          last_updated TIMESTAMP DEFAULT NOW()
        )
      `);
    },
  },
  {
    name: '008-create-indexes',
    up: async () => {
      await pool.query('CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_reviews_sku ON reviews(sku_id)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)');
    },
  },
  {
    name: '009-robust-schema-fix',
    up: async () => {
      // Ensure customers has all required columns for ML matching
      await pool.query('ALTER TABLE customers ADD COLUMN IF NOT EXISTS external_id VARCHAR(50) UNIQUE');
      await pool.query('ALTER TABLE customers ADD COLUMN IF NOT EXISTS lighting_condition VARCHAR(100)');
      await pool.query('ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_styles TEXT');
      await pool.query('ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_colors TEXT');
      await pool.query('ALTER TABLE customers ADD COLUMN IF NOT EXISTS age_group VARCHAR(50)');
      
      // Ensure reviews has review_date with a default
      await pool.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS review_date TIMESTAMP DEFAULT NOW()');
      await pool.query('ALTER TABLE reviews ALTER COLUMN review_date SET NOT NULL');
      await pool.query('ALTER TABLE reviews ALTER COLUMN review_date SET DEFAULT NOW()');
    },
  },
  {
    name: '010-create-manufacturers',
    up: async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS manufacturers (
          manufacturer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'manufacturer',
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    },
  },
  {
    name: '011-link-products-manufacturers',
    up: async () => {
      // Add manufacturer_id (the external business ID) to manufacturers
      await pool.query('ALTER TABLE manufacturers ADD COLUMN IF NOT EXISTS external_manufacturer_id VARCHAR(100) UNIQUE');
      
      // Add manufacturer_id to products to map them
      await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS manufacturer_id VARCHAR(100)');
      
      // Default existing products to 'MFR-SONOMA' for demo purposes
      await pool.query("UPDATE products SET manufacturer_id = 'MFR-SONOMA' WHERE manufacturer_id IS NULL");
    },
  },
];

export const runMigrations = async () => {
  try {
    console.log('🔄 Running migrations...');

    for (const migration of migrations) {
      try {
        await migration.up();
        console.log(`✓ ${migration.name}`);
      } catch (error: any) {
        if (!error.message.includes('already exists')) {
          console.error(`✗ ${migration.name}:`, error.message);
        }
      }
    }

    console.log('✅ Migrations completed');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

export default runMigrations;
