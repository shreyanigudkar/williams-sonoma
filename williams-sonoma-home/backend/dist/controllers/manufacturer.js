"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manufacturerController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("../config/database"));
// Load AI insights
const loadInsights = () => {
    const projectRoot = process.cwd();
    const priorityPath = path_1.default.join(projectRoot, 'models', 'server', 'results', 'priority_actions.json');
    const summariesPath = path_1.default.join(projectRoot, 'models', 'client', 'results', 'sku_summaries.json');
    let priorityActions = {};
    let skuSummaries = {};
    try {
        if (fs_1.default.existsSync(priorityPath)) {
            const data = JSON.parse(fs_1.default.readFileSync(priorityPath, 'utf-8'));
            data.forEach((item) => {
                priorityActions[item.sku_id] = item;
            });
        }
    }
    catch (e) { }
    try {
        if (fs_1.default.existsSync(summariesPath)) {
            const data = JSON.parse(fs_1.default.readFileSync(summariesPath, 'utf-8'));
            data.forEach((item) => {
                skuSummaries[item.sku_id] = item;
            });
        }
    }
    catch (e) { }
    return { priorityActions, skuSummaries };
};
const insights = loadInsights();
exports.manufacturerController = {
    async getDashboard(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const priorityActionsArray = Object.values(insights.priorityActions)
                .sort((a, b) => b.urgency_score - a.urgency_score)
                .slice(0, 10);
            const riskLevels = priorityActionsArray.map((action) => ({
                level: action.urgency_score > 700000 ? 'critical' : action.urgency_score > 400000 ? 'high' : 'medium',
                productName: action.product_name,
                issue: action.action,
                revenueAtRisk: `$${action.revenue_at_risk.toFixed(2)}`,
                urgencyScore: action.urgency_score,
            }));
            // Mock return rate trend data
            const returnRateTrend = [
                { week: 'Week 1', rate: 12.5 },
                { week: 'Week 2', rate: 13.2 },
                { week: 'Week 3', rate: 11.8 },
                { week: 'Week 4', rate: 14.1 },
                { week: 'Week 5', rate: 12.9 },
            ];
            // Mock top return reasons
            const topReturnReasons = [
                { reason: 'Color mismatch', percentage: 28 },
                { reason: 'Damaged in shipping', percentage: 22 },
                { reason: 'Size inaccuracy', percentage: 18 },
                { reason: 'Quality issues', percentage: 16 },
                { reason: 'Changed mind', percentage: 16 },
            ];
            res.json({
                priorityActions: riskLevels,
                metrics: {
                    totalProducts: Object.keys(insights.priorityActions).length,
                    criticalAlerts: riskLevels.filter((r) => r.level === 'critical').length,
                    averageReturnRate: 13.1,
                },
                returnRateTrend,
                topReturnReasons,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch dashboard' });
        }
    },
    async getProducts(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const result = await database_1.default.query('SELECT sku_id, product_name, category, price FROM products LIMIT 50');
            const products = result.rows.map((p) => {
                const priority = insights.priorityActions[p.sku_id];
                return {
                    skuId: p.sku_id,
                    name: p.product_name,
                    category: p.category,
                    price: p.price,
                    returnRate: priority ? (priority.velocity / 100) * 100 : 0,
                    riskLevel: priority
                        ? priority.urgency_score > 700000
                            ? 'critical'
                            : priority.urgency_score > 400000
                                ? 'high'
                                : 'medium'
                        : 'low',
                };
            });
            res.json({ products });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    },
    async getProductDetail(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { skuId } = req.params;
            const priority = insights.priorityActions[skuId];
            if (!priority) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json({
                skuId: priority.sku_id,
                productName: priority.product_name,
                gapScore: Math.floor(Math.random() * 40) + 40, // Mock: 40-80%
                originalDescription: priority.original_description,
                suggestedRewrite: priority.suggested_rewrite,
                missingAttributes: ['Weight', 'Care instructions'],
                painPoints: priority.pain_points,
                urgencyScore: priority.urgency_score,
                revenueAtRisk: priority.revenue_at_risk,
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch product detail' });
        }
    },
    async updateDescription(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { skuId } = req.params;
            const { description } = req.body;
            // Update database
            await database_1.default.query('UPDATE products SET description_text = $1 WHERE sku_id = $2', [description, skuId]);
            res.json({ success: true, message: 'Description updated' });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update description' });
        }
    },
};
