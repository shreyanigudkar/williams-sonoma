"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const models_1 = require("../models");
exports.customerController = {
    async getOrders(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const orders = await models_1.orderModel.getCustomerOrders(req.user.userId);
            const ordersWithDetails = await Promise.all(orders.map(async (order) => {
                const items = await models_1.orderModel.getOrderDetails(order.order_id);
                return {
                    orderId: order.order_id,
                    orderDate: order.order_date,
                    deliveryDate: order.delivery_date,
                    totalAmount: order.total_amount,
                    itemCount: order.item_count,
                    status: order.delivery_date ? 'delivered' : 'processing',
                    items,
                };
            }));
            res.json({ orders: ordersWithDetails });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch orders' });
        }
    },
    async createOrder(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { items, totalAmount, paymentType } = req.body;
            if (!items || !totalAmount) {
                return res.status(400).json({ error: 'Items and total amount required' });
            }
            const order = await models_1.orderModel.create(req.user.userId, items, totalAmount, paymentType || 'credit_card');
            res.status(201).json({
                orderId: order.order_id,
                orderDate: order.order_date,
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create order' });
        }
    },
    async createReturn(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authenticated' });
            }
            const { orderId, orderItemId, skuId, reason, note } = req.body;
            if (!orderId || !reason) {
                return res.status(400).json({ error: 'Order ID and reason required' });
            }
            const returnRecord = await models_1.returnModel.create(req.user.userId, orderId, orderItemId, skuId, reason, note || '');
            res.status(201).json({
                returnId: returnRecord.return_id,
                status: returnRecord.return_status,
                returnDate: returnRecord.return_date,
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create return' });
        }
    },
    async getSimilarReviews(req, res) {
        try {
            const { skuId } = req.params;
            const reviews = await models_1.reviewModel.getProductReviews(skuId, 5);
            const formattedReviews = reviews.map((review) => ({
                reviewId: review.review_id,
                author: review.full_name,
                rating: review.rating,
                title: review.review_title,
                text: review.review_text,
                date: review.review_date,
            }));
            res.json({ reviews: formattedReviews });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch reviews' });
        }
    },
};
