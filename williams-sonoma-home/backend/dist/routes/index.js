"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const catalog_1 = require("../controllers/catalog");
const customer_1 = require("../controllers/customer");
const manufacturer_1 = require("../controllers/manufacturer");
const admin_1 = require("../controllers/admin");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Auth routes
router.post('/auth/login', auth_1.authController.login);
router.post('/auth/signup', auth_1.authController.signup);
router.get('/auth/me', auth_2.authMiddleware, auth_1.authController.getMe);
router.get('/auth/preference-options', auth_1.authController.getPreferenceOptions);
// Catalog routes (public)
router.get('/catalog/products', auth_2.optionalAuthMiddleware, catalog_1.catalogController.getProducts);
router.get('/catalog/product/:skuId', auth_2.optionalAuthMiddleware, catalog_1.catalogController.getProduct);
router.get('/catalog/product/:skuId/insights', auth_2.optionalAuthMiddleware, catalog_1.catalogController.getProductInsights);
router.get('/catalog/categories', catalog_1.catalogController.getCategories);
// Customer routes
router.get('/customer/orders', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['customer']), customer_1.customerController.getOrders);
router.post('/customer/orders', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['customer']), customer_1.customerController.createOrder);
router.post('/customer/returns', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['customer']), customer_1.customerController.createReturn);
router.get('/customer/product/:skuId/similar-reviews', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['customer']), customer_1.customerController.getSimilarReviews);
// Manufacturer routes
router.get('/manufacturer/dashboard', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['manufacturer']), manufacturer_1.manufacturerController.getDashboard);
router.get('/manufacturer/products', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['manufacturer']), manufacturer_1.manufacturerController.getProducts);
router.get('/manufacturer/product/:skuId', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['manufacturer']), manufacturer_1.manufacturerController.getProductDetail);
router.put('/manufacturer/product/:skuId/description', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['manufacturer']), manufacturer_1.manufacturerController.updateDescription);
// Admin routes
router.get('/admin/stats', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['admin']), admin_1.adminController.getStats);
router.get('/admin/categories', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['admin']), admin_1.adminController.getCategories);
router.get('/admin/manufacturers', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['admin']), admin_1.adminController.getManufacturers);
router.get('/admin/top-issues', auth_2.authMiddleware, (0, auth_2.roleMiddleware)(['admin']), admin_1.adminController.getTopIssues);
exports.default = router;
