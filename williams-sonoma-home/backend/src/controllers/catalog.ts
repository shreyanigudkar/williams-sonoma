import { Request, Response } from 'express';
import { productModel, reviewModel } from '../models';
import fs from 'fs';
import path from 'path';

// Load AI-generated insights from your trained models
const loadInsights = () => {
  const projectRoot = process.cwd();
  const priorityPath = path.join(projectRoot, 'models', 'server', 'results', 'priority_actions.json');
  const summariesPath = path.join(projectRoot, 'models', 'client', 'results', 'sku_summaries.json');

  let priorityActions: any = {};
  let skuSummaries: any = {};

  try {
    if (fs.existsSync(priorityPath)) {
      const data = JSON.parse(fs.readFileSync(priorityPath, 'utf-8'));
      data.forEach((item: any) => {
        priorityActions[item.sku_id] = item;
      });
    }
  } catch (e) {
    console.log('Priority actions not loaded');
  }

  try {
    if (fs.existsSync(summariesPath)) {
      const data = JSON.parse(fs.readFileSync(summariesPath, 'utf-8'));
      data.forEach((item: any) => {
        skuSummaries[item.sku_id] = item;
      });
    }
  } catch (e) {
    console.log('SKU summaries not loaded');
  }

  return { priorityActions, skuSummaries };
};

const insights = loadInsights();

export const catalogController = {
  async getProducts(req: Request, res: Response) {
    try {
      const { category = 'All', search = '', sort = 'featured', limit = '20', offset = '0' } = req.query;

      const filters = {
        category: category as string,
        search: search as string,
        sort: sort as string,
        limit: Math.min(parseInt(limit as string) || 20, 100),
        offset: parseInt(offset as string) || 0,
      };

      const products = await productModel.search(filters);
      const total = await productModel.count();

      const productsWithRatings = await Promise.all(
        products.map(async (product: any) => {
          const rating = await reviewModel.getAverageRating(product.sku_id);
          const summary = insights.skuSummaries[product.sku_id] || { tags: [] };

          return {
            skuId: product.sku_id,
            name: product.product_name,
            brand: product.brand,
            price: product.price,
            imageUrl: `https://via.placeholder.com/400x400/8B7355/FFFFFF?text=${encodeURIComponent(product.product_name)}`,
            rating: parseFloat(rating.avg_rating || 4.5).toFixed(1),
            ratingCount: parseInt(rating.count || 0),
            tags: summary.tags ? summary.tags.slice(0, 3).map((t: any) => t.label) : [],
            category: product.category,
          };
        })
      );

      res.json({
        products: productsWithRatings,
        pagination: {
          total,
          limit: filters.limit,
          offset: filters.offset,
          hasMore: filters.offset + filters.limit < total,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  async getProduct(req: Request, res: Response) {
    try {
      const { skuId } = req.params;
      const product = await productModel.findBySku(skuId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const rating = await reviewModel.getAverageRating(skuId);
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
        tags: summary.tags ? summary.tags.map((t: any) => ({ label: t.label, type: t.type })) : [],
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  async getProductInsights(req: Request, res: Response) {
    try {
      const { skuId } = req.params;
      const product = await productModel.findBySku(skuId);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const reviews = await reviewModel.getProductReviews(skuId, 3);
      const priorityAction = insights.priorityActions[skuId];
      const summary = insights.skuSummaries[skuId] || { tags: [] };

      // Get similar customers' reviews
      const buyerInsights = reviews.map((review: any) => ({
        initials: (review.full_name || 'User')
          .split(' ')
          .map((n: string) => n[0])
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
      const pros = tags.filter((t: any) => t.type === 'positive').map((t: any) => t.label);
      const cons = tags.filter((t: any) => t.type === 'negative').map((t: any) => t.label);

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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch insights' });
    }
  },

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await productModel.getCategories();
      res.json({ categories: ['All', ...categories] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },
};
