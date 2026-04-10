import pool from '../config/database';

export const customerModel = {
  async findById(customerId: string) {
    const result = await pool.query(
      'SELECT customer_id, external_id, email, full_name, role, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition, avg_spend, return_rate FROM customers WHERE customer_id = $1',
      [customerId]
    );
    return result.rows[0];
  },

  async findByExternalId(externalId: string) {
    const result = await pool.query(
      'SELECT customer_id, external_id, full_name, role, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition FROM customers WHERE external_id = $1',
      [externalId]
    );
    return result.rows[0];
  },

  async findByEmail(email: string) {
    const result = await pool.query(
      'SELECT * FROM customers WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async create(data: any) {
    const { email, full_name, password_hash, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition } = data;
    const result = await pool.query(
      `INSERT INTO customers (email, full_name, password_hash, role, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition, avg_spend, return_rate)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING customer_id, email, full_name, role`,
      [email, full_name, password_hash, 'customer', age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition, 0, 0]
    );
    return result.rows[0];
  },

  async getEmbedding(customerId: string) {
    const result = await pool.query(
      'SELECT embedding_vector FROM user_embeddings WHERE customer_id = $1',
      [customerId]
    );
    return result.rows[0];
  },

  async update(customerId: string, data: any) {
    const { full_name, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition } = data;
    const result = await pool.query(
      `UPDATE customers 
       SET full_name = COALESCE($1, full_name),
           age_group = COALESCE($2, age_group),
           lifestyle_tags = COALESCE($3, lifestyle_tags),
           preferred_styles = COALESCE($4, preferred_styles),
           preferred_colors = COALESCE($5, preferred_colors),
           lighting_condition = COALESCE($6, lighting_condition)
       WHERE customer_id = $7
       RETURNING *`,
      [full_name, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition, customerId]
    );
    return result.rows[0];
  },
};

export const manufacturerModel = {
  async findById(id: string) {
    const result = await pool.query(
      'SELECT manufacturer_id, external_manufacturer_id, email, full_name, role FROM manufacturers WHERE manufacturer_id = $1',
      [id]
    );
    return result.rows[0];
  },

  async findByEmail(email: string) {
    const result = await pool.query(
      'SELECT * FROM manufacturers WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  async create(data: any) {
    const { email, full_name, password_hash, manufacturerId } = data;
    const result = await pool.query(
      `INSERT INTO manufacturers (email, full_name, password_hash, external_manufacturer_id)
       VALUES ($1, $2, $3, $4)
       RETURNING manufacturer_id, external_manufacturer_id, email, full_name, role`,
      [email, full_name, password_hash, manufacturerId]
    );
    return result.rows[0];
  },
};

export const productModel = {
  async findBySku(skuId: string) {
    const result = await pool.query(
      'SELECT * FROM products WHERE sku_id = $1',
      [skuId]
    );
    return result.rows[0];
  },

  async search(filters: { category?: string; search?: string; sort?: string; limit: number; offset: number }) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.category && filters.category !== 'All') {
      query += ` AND category = $${paramIndex++}`;
      params.push(filters.category);
    }

    if (filters.search) {
      query += ` AND (product_name ILIKE $${paramIndex} OR description_text ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.sort === 'price-low') query += ' ORDER BY price ASC';
    else if (filters.sort === 'price-high') query += ' ORDER BY price DESC';
    else if (filters.sort === 'rating') query += ' ORDER BY rating DESC';
    else query += ' ORDER BY launch_date DESC';

    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(filters.limit, filters.offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getCategories() {
    const result = await pool.query(
      'SELECT DISTINCT category FROM products ORDER BY category'
    );
    return result.rows.map((r: any) => r.category);
  },

  async count() {
    const result = await pool.query('SELECT COUNT(*) FROM products');
    return parseInt(result.rows[0].count);
  },
};

export const orderModel = {
  async create(customerId: string, items: any[], totalAmount: number, paymentType: string) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderResult = await client.query(
        `INSERT INTO orders (customer_id, order_date, total_amount, payment_type)
         VALUES ($1, NOW(), $2, $3)
         RETURNING order_id, order_date`,
        [customerId, totalAmount, paymentType]
      );

      const orderId = orderResult.rows[0].order_id;

      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (order_id, sku_id, quantity, price_per_unit, discount)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, item.skuId, item.quantity, item.pricePerUnit, item.discount || 0]
        );
      }

      await client.query('COMMIT');
      return orderResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getCustomerOrders(customerId: string) {
    const result = await pool.query(
      `SELECT o.*, COUNT(oi.order_item_id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.customer_id = $1
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`,
      [customerId]
    );
    return result.rows;
  },

  async getOrderDetails(orderId: string) {
    const result = await pool.query(
      `SELECT oi.*, p.product_name, p.price
       FROM order_items oi
       JOIN products p ON oi.sku_id = p.sku_id
       WHERE oi.order_id = $1`,
      [orderId]
    );
    return result.rows;
  },
};

export const returnModel = {
  async create(customerId: string, orderId: string, orderItemId: string, skuId: string, reason: string, note: string) {
    const result = await pool.query(
      `INSERT INTO returns (order_id, order_item_id, sku_id, customer_id, return_reason, return_note, return_date, return_status)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'pending')
       RETURNING return_id, return_date, return_status`,
      [orderId, orderItemId, skuId, customerId, reason, note]
    );
    return result.rows[0];
  },

  async getCustomerReturns(customerId: string) {
    const result = await pool.query(
      `SELECT r.*, p.product_name
       FROM returns r
       JOIN products p ON r.sku_id = p.sku_id
       WHERE r.customer_id = $1
       ORDER BY r.return_date DESC`,
      [customerId]
    );
    return result.rows;
  },
};

export const reviewModel = {
  async getProductReviews(skuId: string, limit: number = 10) {
    const result = await pool.query(
      `SELECT r.review_id, r.customer_id, r.rating, r.review_text, r.review_title, r.review_date, c.full_name
       FROM reviews r
       JOIN customers c ON r.customer_id = c.customer_id
       WHERE r.sku_id = $1
       ORDER BY r.review_date DESC
       LIMIT $2`,
      [skuId, limit]
    );
    return result.rows;
  },

  async getAverageRating(skuId: string) {
    const result = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE sku_id = $1',
      [skuId]
    );
    return result.rows[0];
  },

  async create(skuId: string, customerId: string, rating: number, reviewText: string, reviewTitle: string) {
    const result = await pool.query(
      `INSERT INTO reviews (sku_id, customer_id, rating, review_text, review_title, review_date, verified_purchase)
       VALUES ($1, $2, $3, $4, $5, NOW(), true)
       RETURNING review_id`,
      [skuId, customerId, rating, reviewText, reviewTitle]
    );
    return result.rows[0];
  },
};
