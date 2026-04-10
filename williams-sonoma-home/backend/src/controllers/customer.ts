import { Request, Response } from 'express';
import { orderModel, returnModel, reviewModel, customerModel } from '../models';
import { getReviewsFromCSV } from '../utils/mlResults';

export const customerController = {
  async getOrders(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const orders = await orderModel.getCustomerOrders(req.user.userId);

      const ordersWithDetails = await Promise.all(
        orders.map(async (order: any) => {
          const items = await orderModel.getOrderDetails(order.order_id);
          return {
            orderId: order.order_id,
            orderDate: order.order_date,
            deliveryDate: order.delivery_date,
            totalAmount: order.total_amount,
            itemCount: order.item_count,
            status: order.delivery_date ? 'delivered' : 'processing',
            items,
          };
        })
      );

      res.json({ orders: ordersWithDetails });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },

  async createOrder(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { items, totalAmount, paymentType } = req.body;

      if (!items || !totalAmount) {
        return res.status(400).json({ error: 'Items and total amount required' });
      }

      const order = await orderModel.create(req.user.userId, items, totalAmount, paymentType || 'credit_card');

      res.status(201).json({
        orderId: order.order_id,
        orderDate: order.order_date,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  async createReturn(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const { orderId, orderItemId, skuId, reason, note } = req.body;

      if (!orderId || !reason) {
        return res.status(400).json({ error: 'Order ID and reason required' });
      }

      const returnRecord = await returnModel.create(
        req.user.userId,
        orderId,
        orderItemId,
        skuId,
        reason,
        note || ''
      );

      res.status(201).json({
        returnId: returnRecord.return_id,
        status: returnRecord.return_status,
        returnDate: returnRecord.return_date,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create return' });
    }
  },

  async getSimilarReviews(req: Request, res: Response) {
    try {
      const { skuId } = req.params;

      // Authentically load reviews from the master CSV dataset
      const csvReviews = getReviewsFromCSV(skuId);

      // Map CSV records to frontend format and join with DB profile data
      const formattedReviews = await Promise.all(csvReviews.map(async (rev: any) => {
        const reviewer = await customerModel.findByExternalId(rev.customer_id);
        
        return {
          review_id: rev.review_id,
          full_name: reviewer?.full_name || `Customer ${rev.customer_id}`,
          rating: parseInt(rev.rating) || 5,
          review_title: rev.review_title || 'Verified Purchase',
          review_text: rev.review_text,
          review_date: rev.review_date,
          verified_purchase: rev.verified_purchase === 'True',
          sentiment_score: parseFloat(rev.sentiment_score) || null
        };
      }));

      // Sort by date newest first as requested
      formattedReviews.sort((a, b) => new Date(b.review_date).getTime() - new Date(a.review_date).getTime());

      res.json({ reviews: formattedReviews });
    } catch (error) {
      console.error('❌ Error fetching CSV reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  },
};
