import { Request, Response } from 'express';
import pool from '../config/database';
import fs from 'fs';
import path from 'path';

const loadInsights = () => {
  const projectRoot = process.cwd();
  const summariesPath = path.join(projectRoot, 'models', 'client', 'results', 'sku_summaries.json');
  let skuSummaries: any = {};

  try {
    if (fs.existsSync(summariesPath)) {
      const data = JSON.parse(fs.readFileSync(summariesPath, 'utf-8'));
      data.forEach((item: any) => {
        skuSummaries[item.sku_id] = item;
      });
    }
  } catch (e) {}

  return skuSummaries;
};

const skuSummaries = loadInsights();

export const adminController = {
  async getStats(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const orderResult = await pool.query('SELECT COUNT(*) as count, SUM(total_amount) as total FROM orders');
      const reviewResult = await pool.query('SELECT AVG(rating) as avg_rating FROM reviews');

      const stats = {
        totalRevenue: orderResult.rows[0].total || 0,
        totalOrders: parseInt(orderResult.rows[0].count || 0),
        overallReturnRate: 13.2,
        averageRating: parseFloat(reviewResult.rows[0].avg_rating || 4.5).toFixed(1),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  },

  async getCategories(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const result = await pool.query(
        `SELECT category, COUNT(*) as count, AVG(price) as avg_price
         FROM products
         GROUP BY category
         ORDER BY count DESC`
      );

      const categories = result.rows.map((r: any) => ({
        category: r.category,
        productCount: parseInt(r.count),
        averagePrice: parseFloat(r.avg_price || 0).toFixed(2),
      }));

      res.json({ categories });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },

  async getManufacturers(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const result = await pool.query(
        `SELECT brand, COUNT(*) as product_count, AVG(price) as avg_price
         FROM products
         GROUP BY brand
         ORDER BY product_count DESC
         LIMIT 20`
      );

      const manufacturers = result.rows.map((r: any) => ({
        brand: r.brand,
        productCount: parseInt(r.product_count),
        averagePrice: parseFloat(r.avg_price || 0).toFixed(2),
      }));

      res.json({ manufacturers });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch manufacturers' });
    }
  },

  async getTopIssues(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const allTags: { [key: string]: number } = {};

      Object.values(skuSummaries).forEach((summary: any) => {
        if (summary.tags) {
          summary.tags.forEach((tag: any) => {
            const label = tag.label;
            allTags[label] = (allTags[label] || 0) + 1;
          });
        }
      });

      const topIssues = Object.entries(allTags)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 10)
        .map(([issue, count]) => ({
          issue,
          frequency: count,
        }));

      res.json({ topIssues });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch top issues' });
    }
  },
};
