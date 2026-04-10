"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catalogController = void 0;
const models_1 = require("../models");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Load AI-generated insights from your trained models
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
    catch (e) {
        console.log('Priority actions not loaded');
    }
    try {
        if (fs_1.default.existsSync(summariesPath)) {
            const data = JSON.parse(fs_1.default.readFileSync(summariesPath, 'utf-8'));
            data.forEach((item) => {
                skuSummaries[item.sku_id] = item;
            });
        }
    }
    catch (e) {
        console.log('SKU summaries not loaded');
    }
    return { priorityActions, skuSummaries };
};
const insights = loadInsights();
exports.catalogController = {
    async getProducts(req, res) {
        try {
            const { category = 'All', search = '', sort = 'featured', limit = '20', offset = '0' } = req.query;
            const filters = {
                category: category,
                search: search,
                sort: sort,
                limit: Math.min(parseInt(limit) || 20, 100),
                offset: parseInt(offset) || 0,
            };
            const products = await models_1.productModel.search(filters);
            const total = await models_1.productModel.count();
            const productsWithRatings = await Promise.all(products.map(async (product) => {
                const rating = await models_1.reviewModel.getAverageRating(product.sku_id);
                const summary = insights.skuSummaries[product.sku_id] || { tags: [] };
                return {
                    skuId: product.sku_id,
                    name: product.product_name,
                    brand: product.brand,
                    price: product.price,
                    imageUrl: `https://via.placeholder.com/400x400/8B7355/FFFFFF?text=${encodeURIComponent(product.product_name)}`,
                    rating: parseFloat(rating.avg_rating || 4.5).toFixed(1),
                    ratingCount: parseInt(rating.count || 0),
                    tags: summary.tags ? summary.tags.slice(0, 3).map((t) => t.label) : [],
                    category: product.category,
                };
            }));
            res.json({
                products: productsWithRatings,
                pagination: {
                    total,
                    limit: filters.limit,
                    offset: filters.offset,
                    hasMore: filters.offset + filters.limit < total,
                },
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    },
    async getProduct(req, res) {
        try {
            const { skuId } = req.params;
            const product = await models_1.productModel.findBySku(skuId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const rating = await models_1.reviewModel.getAverageRating(skuId);
            const summary = insights.skuSummaries[skuId] || { tags: [] };
            res.json({
                skuId: product.sku_id,
                name: product.product_name,
                brand: product.brand,
                category: product.category,
                subCategory: product.sub_category,
                price: product.price,
                description: product.description_text,
                imageUrl: `https://via.placeholder.com/400x400/8B7355/FFFFFF?text=${encodeURIComponent(product.product_name)}`,
                rating: parseFloat(rating.avg_rating || 4.5).toFixed(1),
                ratingCount: parseInt(rating.count || 0),
                specifications: {
                    material: product.material,
                    color: product.color,
                    finish: product.finish,
                    dimensions: product.dimensions,
                    weight: product.weight,
                    style: product.style,
                },
                tags: summary.tags ? summary.tags.map((t) => ({ label: t.label, type: t.type })) : [],
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch product' });
        }
    },
    async getProductInsights(req, res) {
        try {
            const { skuId } = req.params;
            const product = await models_1.productModel.findBySku(skuId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            const reviews = await models_1.reviewModel.getProductReviews(skuId, 3);
            const priorityAction = insights.priorityActions[skuId];
            const summary = insights.skuSummaries[skuId] || { tags: [] };
            // Get similar customers' reviews
            const buyerInsights = reviews.map((review) => ({
                initials: (review.full_name || 'User')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2),
                matchPercentage: Math.floor(Math.random() * 40) + 60, // Mock: 60-100%
                context: 'Similar taste preference',
                rating: review.rating,
                excerpt: review.review_text.substring(0, 150) + '...',
            }));
            // Extract pros and cons from tags
            const tags = summary.tags || [];
            const pros = tags.filter((t) => t.type === 'positive').map((t) => t.label);
            const cons = tags.filter((t) => t.type === 'negative').map((t) => t.label);
            res.json({
                buyersLikeYou: buyerInsights,
                returnReasons: priorityAction?.pain_points || [],
                highlights: {
                    pros,
                    cons,
                },
                suggestedRewrite: priorityAction?.suggested_rewrite || null,
                originalDescription: priorityAction?.original_description || null,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch insights' });
        }
    },
    async getCategories(req, res) {
        try {
            const categories = await models_1.productModel.getCategories();
            res.json({ categories: ['All', ...categories] });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    },
};
