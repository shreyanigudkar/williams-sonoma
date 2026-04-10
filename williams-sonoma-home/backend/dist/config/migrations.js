"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const database_1 = __importDefault(require("../config/database"));
const migrations = [
    {
        name: '001-create-customers',
        up: async () => {
            await database_1.default.query(`
        CREATE TABLE IF NOT EXISTS customers (
          customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
            await database_1.default.query(`
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
            await database_1.default.query(`
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
            await database_1.default.query(`
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
            await database_1.default.query(`
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
            await database_1.default.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sku_id VARCHAR(50) NOT NULL REFERENCES products(sku_id),
          customer_id UUID NOT NULL REFERENCES customers(customer_id),
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          review_title VARCHAR(255),
          sentiment_score DECIMAL(3, 2),
          review_date TIMESTAMP NOT NULL,
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
            await database_1.default.query(`
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
            await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id)');
            await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_reviews_sku ON reviews(sku_id)');
            await database_1.default.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)');
        },
    },
];
const runMigrations = async () => {
    try {
        console.log('🔄 Running migrations...');
        for (const migration of migrations) {
            try {
                await migration.up();
                console.log(`✓ ${migration.name}`);
            }
            catch (error) {
                if (!error.message.includes('already exists')) {
                    console.error(`✗ ${migration.name}:`, error.message);
                }
            }
        }
        console.log('✅ Migrations completed');
    }
    catch (error) {
        console.error('❌ Migration error:', error);
        process.exit(1);
    }
};
exports.runMigrations = runMigrations;
exports.default = exports.runMigrations;
