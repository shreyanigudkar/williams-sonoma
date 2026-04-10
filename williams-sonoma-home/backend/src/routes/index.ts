import { Router } from 'express';
import { authController } from '../controllers/auth';
import { catalogController } from '../controllers/catalog';
import { customerController } from '../controllers/customer';
import { manufacturerController } from '../controllers/manufacturer';
import { adminController } from '../controllers/admin';
import { authMiddleware, roleMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/auth/login', authController.login);
router.post('/auth/signup', authController.signup);
router.get('/auth/me', authMiddleware, authController.getMe);
router.get('/auth/preference-options', authController.getPreferenceOptions);

// Catalog routes (public)
router.get('/catalog/products', optionalAuthMiddleware, catalogController.getProducts);
router.get('/catalog/product/:skuId', optionalAuthMiddleware, catalogController.getProduct);
router.get('/catalog/product/:skuId/insights', optionalAuthMiddleware, catalogController.getProductInsights);
router.get('/catalog/categories', catalogController.getCategories);

// Customer routes
router.get('/customer/orders', authMiddleware, roleMiddleware(['customer']), customerController.getOrders);
router.post('/customer/orders', authMiddleware, roleMiddleware(['customer']), customerController.createOrder);
router.post('/customer/returns', authMiddleware, roleMiddleware(['customer']), customerController.createReturn);
router.get('/customer/product/:skuId/similar-reviews', authMiddleware, roleMiddleware(['customer']), customerController.getSimilarReviews);

// Manufacturer routes
router.get('/manufacturer/dashboard', authMiddleware, roleMiddleware(['manufacturer']), manufacturerController.getDashboard);
router.get('/manufacturer/products', authMiddleware, roleMiddleware(['manufacturer']), manufacturerController.getProducts);
router.get('/manufacturer/product/:skuId', authMiddleware, roleMiddleware(['manufacturer']), manufacturerController.getProductDetail);
router.put('/manufacturer/product/:skuId/description', authMiddleware, roleMiddleware(['manufacturer']), manufacturerController.updateDescription);

// Admin routes
router.get('/admin/stats', authMiddleware, roleMiddleware(['admin']), adminController.getStats);
router.get('/admin/categories', authMiddleware, roleMiddleware(['admin']), adminController.getCategories);
router.get('/admin/manufacturers', authMiddleware, roleMiddleware(['admin']), adminController.getManufacturers);
router.get('/admin/top-issues', authMiddleware, roleMiddleware(['admin']), adminController.getTopIssues);

export default router;
