"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewModel = exports.returnModel = exports.orderModel = exports.productModel = exports.customerModel = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.customerModel = {
    async findById(customerId) {
        const result = await database_1.default.query('SELECT customer_id, email, full_name, role, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition, avg_spend, return_rate FROM customers WHERE customer_id = $1', [customerId]);
        return result.rows[0];
    },
    async findByEmail(email) {
        const result = await database_1.default.query('SELECT * FROM customers WHERE email = $1', [email]);
        return result.rows[0];
    },
    async create(data) {
        const { email, full_name, password_hash, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition } = data;
        const result = await database_1.default.query(`INSERT INTO customers (email, full_name, password_hash, role, age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition, avg_spend, return_rate)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING customer_id, email, full_name, role`, [email, full_name, password_hash, 'customer', age_group, lifestyle_tags, preferred_styles, preferred_colors, lighting_condition, 0, 0]);
        return result.rows[0];
    },
    async getEmbedding(customerId) {
        const result = await database_1.default.query('SELECT embedding_vector FROM user_embeddings WHERE customer_id = $1', [customerId]);
        return result.rows[0];
    },
};
exports.productModel = {
    async findBySku(skuId) {
        const result = await database_1.default.query('SELECT * FROM products WHERE sku_id = $1', [skuId]);
        return result.rows[0];
    },
    async search(filters) {
        let query = 'SELECT * FROM products WHERE 1=1';
        const params = [];
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
        if (filters.sort === 'price-low')
            query += ' ORDER BY price ASC';
        else if (filters.sort === 'price-high')
            query += ' ORDER BY price DESC';
        else if (filters.sort === 'rating')
            query += ' ORDER BY rating DESC';
        else
            query += ' ORDER BY launch_date DESC';
        query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
        params.push(filters.limit, filters.offset);
        const result = await database_1.default.query(query, params);
        return result.rows;
    },
    async getCategories() {
        const result = await database_1.default.query('SELECT DISTINCT category FROM products ORDER BY category');
        return result.rows.map((r) => r.category);
    },
    async count() {
        const result = await database_1.default.query('SELECT COUNT(*) FROM products');
        return parseInt(result.rows[0].count);
    },
};
exports.orderModel = {
    async create(customerId, items, totalAmount, paymentType) {
        const client = await database_1.default.connect();
        try {
            await client.query('BEGIN');
            const orderResult = await client.query(`INSERT INTO orders (customer_id, order_date, total_amount, payment_type)
         VALUES ($1, NOW(), $2, $3)
         RETURNING order_id, order_date`, [customerId, totalAmount, paymentType]);
            const orderId = orderResult.rows[0].order_id;
            for (const item of items) {
                await client.query(`INSERT INTO order_items (order_id, sku_id, quantity, price_per_unit, discount)
           VALUES ($1, $2, $3, $4, $5)`, [orderId, item.skuId, item.quantity, item.pricePerUnit, item.discount || 0]);
            }
            await client.query('COMMIT');
            return orderResult.rows[0];
        }
        catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
        finally {
            client.release();
        }
    },
    async getCustomerOrders(customerId) {
        const result = await database_1.default.query(`SELECT o.*, COUNT(oi.order_item_id) as item_count
       FROM orders o
       LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.customer_id = $1
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`, [customerId]);
        return result.rows;
    },
    async getOrderDetails(orderId) {
        const result = await database_1.default.query(`SELECT oi.*, p.product_name, p.price
       FROM order_items oi
       JOIN products p ON oi.sku_id = p.sku_id
       WHERE oi.order_id = $1`, [orderId]);
        return result.rows;
    },
};
exports.returnModel = {
    async create(customerId, orderId, orderItemId, skuId, reason, note) {
        const result = await database_1.default.query(`INSERT INTO returns (order_id, order_item_id, sku_id, customer_id, return_reason, return_note, return_date, return_status)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'pending')
       RETURNING return_id, return_date, return_status`, [orderId, orderItemId, skuId, customerId, reason, note]);
        return result.rows[0];
    },
    async getCustomerReturns(customerId) {
        const result = await database_1.default.query(`SELECT r.*, p.product_name
       FROM returns r
       JOIN products p ON r.sku_id = p.sku_id
       WHERE r.customer_id = $1
       ORDER BY r.return_date DESC`, [customerId]);
        return result.rows;
    },
};
exports.reviewModel = {
    async getProductReviews(skuId, limit = 10) {
        const result = await database_1.default.query(`SELECT r.review_id, r.customer_id, r.rating, r.review_text, r.review_title, r.review_date, c.full_name
       FROM reviews r
       JOIN customers c ON r.customer_id = c.customer_id
       WHERE r.sku_id = $1
       ORDER BY r.review_date DESC
       LIMIT $2`, [skuId, limit]);
        return result.rows;
    },
    async getAverageRating(skuId) {
        const result = await database_1.default.query('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE sku_id = $1', [skuId]);
        return result.rows[0];
    },
    async create(skuId, customerId, rating, reviewText, reviewTitle) {
        const result = await database_1.default.query(`INSERT INTO reviews (sku_id, customer_id, rating, review_text, review_title, review_date, verified_purchase)
       VALUES ($1, $2, $3, $4, $5, NOW(), true)
       RETURNING review_id`, [skuId, customerId, rating, reviewText, reviewTitle]);
        return result.rows[0];
    },
};
