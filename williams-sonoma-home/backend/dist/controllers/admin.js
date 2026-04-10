"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const database_1 = __importDefault(require("../config/database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const loadInsights = () => {
    const projectRoot = process.cwd();
    const summariesPath = path_1.default.join(projectRoot, 'models', 'client', 'results', 'sku_summaries.json');
    let skuSummaries = {};
    try {
        if (fs_1.default.existsSync(summariesPath)) {
            const data = JSON.parse(fs_1.default.readFileSync(summariesPath, 'utf-8'));
            data.forEach((item) => {
                skuSummaries[item.sku_id] = item;
            });
        }
    }
    catch (e) { }
    return skuSummaries;
};
const skuSummaries = loadInsights();
exports.adminController = {
    async getStats(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const orderResult = await database_1.default.query('SELECT COUNT(*) as count, SUM(total_amount) as total FROM orders');
            const reviewResult = await database_1.default.query('SELECT AVG(rating) as avg_rating FROM reviews');
            const stats = {
                totalRevenue: orderResult.rows[0].total || 0,
                totalOrders: parseInt(orderResult.rows[0].count || 0),
                overallReturnRate: 13.2,
                averageRating: parseFloat(reviewResult.rows[0].avg_rating || 4.5).toFixed(1),
            };
            res.json(stats);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    },
    async getCategories(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const result = await database_1.default.query(`SELECT category, COUNT(*) as count, AVG(price) as avg_price
         FROM products
         GROUP BY category
         ORDER BY count DESC`);
            const categories = result.rows.map((r) => ({
                category: r.category,
                productCount: parseInt(r.count),
                averagePrice: parseFloat(r.avg_price || 0).toFixed(2),
            }));
            res.json({ categories });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    },
    async getManufacturers(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const result = await database_1.default.query(`SELECT brand, COUNT(*) as product_count, AVG(price) as avg_price
         FROM products
         GROUP BY brand
         ORDER BY product_count DESC
         LIMIT 20`);
            const manufacturers = result.rows.map((r) => ({
                brand: r.brand,
                productCount: parseInt(r.product_count),
                averagePrice: parseFloat(r.avg_price || 0).toFixed(2),
            }));
            res.json({ manufacturers });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch manufacturers' });
        }
    },
    async getTopIssues(req, res) {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Admin access required' });
            }
            const allTags = {};
            Object.values(skuSummaries).forEach((summary) => {
                if (summary.tags) {
                    summary.tags.forEach((tag) => {
                        const label = tag.label;
                        allTags[label] = (allTags[label] || 0) + 1;
                    });
                }
            });
            const topIssues = Object.entries(allTags)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([issue, count]) => ({
                issue,
                frequency: count,
            }));
            res.json({ topIssues });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch top issues' });
        }
    },
};
