"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const database_1 = __importDefault(require("./database"));
const sampleProducts = [
    {
        sku_id: 'SKU00001',
        product_name: 'Rejuvenation Artisan Sofa',
        category: 'Furniture',
        sub_category: 'Sofas',
        brand: 'Rejuvenation',
        price: 370.49,
        material: 'Wood',
        color: 'Black | Charcoal',
        finish: 'Textured',
        dimensions: '44x45x8 inches',
        weight: '48.1 lbs',
        style: 'Transitional',
        description_text: 'Elegant design meets functionality in this Rejuvenation piece. Features textured finish and durable construction.'
    },
    {
        sku_id: 'SKU00002',
        product_name: 'Rejuvenation Signature Sofa',
        category: 'Furniture',
        sub_category: 'Sofas',
        brand: 'Rejuvenation',
        price: 202.17,
        material: 'Glass | Wood',
        color: 'Black | Blue',
        finish: 'Matte',
        dimensions: '46x53x26 inches',
        weight: '133.3 lbs',
        style: 'Bohemian',
        description_text: 'Beautiful bohemian sofas crafted with premium materials. Perfect addition to any home.'
    },
    {
        sku_id: 'SKU00015',
        product_name: 'Williams Sonoma Custom Dining Table',
        category: 'Furniture',
        sub_category: 'Dining Tables',
        brand: 'Williams Sonoma',
        price: 28.43,
        material: 'Rattan | Marble',
        color: 'Ivory',
        finish: 'Brushed',
        dimensions: '42x62x26 inches',
        weight: '35.3 lbs',
        style: 'Coastal',
        description_text: 'Contemporary design that elevates your space. Easy to maintain and built to last.'
    },
    {
        sku_id: 'SKU00020',
        product_name: 'Williams Sonoma Premium Dining Table',
        category: 'Furniture',
        sub_category: 'Dining Tables',
        brand: 'Williams Sonoma',
        price: 45.07,
        material: 'Ceramic | Metal',
        color: 'Navy',
        finish: 'Polished',
        dimensions: '64x41x11 inches',
        weight: '99.5 lbs',
        style: 'Transitional',
        description_text: 'Beautiful transitional dining tables crafted with premium materials. Perfect addition to any home.'
    },
    {
        sku_id: 'SKU00024',
        product_name: 'West Elm Premium Chair',
        category: 'Furniture',
        sub_category: 'Chairs',
        brand: 'West Elm',
        price: 336.55,
        material: 'Cotton',
        color: 'Natural',
        finish: 'Distressed',
        dimensions: '22x42x20 inches',
        weight: '65.2 lbs',
        style: 'Art Deco',
        description_text: 'Contemporary design that elevates your space. Easy to maintain and built to last.'
    },
    {
        sku_id: 'SKU00027',
        product_name: 'Rejuvenation Modern Chair',
        category: 'Furniture',
        sub_category: 'Chairs',
        brand: 'Rejuvenation',
        price: 174.78,
        material: 'Velvet | Leather',
        color: 'Walnut | Natural',
        finish: 'Powder Coated',
        dimensions: '26x69x28 inches',
        weight: '123.2 lbs',
        style: 'Bohemian',
        description_text: 'Timeless furniture essential that combines style with practicality. Made from high-quality velvet.'
    },
    {
        sku_id: 'SKU00032',
        product_name: 'West Elm Custom Bed',
        category: 'Furniture',
        sub_category: 'Beds',
        brand: 'West Elm',
        price: 743.99,
        material: 'Silk | Rattan',
        color: 'Navy | Natural',
        finish: 'Antique',
        dimensions: '19x10x9 inches',
        weight: '38.8 lbs',
        style: 'Glam',
        description_text: 'Timeless furniture essential that combines style with practicality. Made from high-quality silk.'
    },
    {
        sku_id: 'SKU00035',
        product_name: 'Pottery Barn Artisan Bed',
        category: 'Furniture',
        sub_category: 'Beds',
        brand: 'Pottery Barn',
        price: 312.29,
        material: 'Velvet | Silk',
        color: 'Green',
        finish: 'Lacquered',
        dimensions: '24x34x15 inches',
        weight: '58.3 lbs',
        style: 'Minimalist | Farmhouse',
        description_text: 'Contemporary design that elevates your space. Easy to maintain and built to last.'
    },
    {
        sku_id: 'SKU00044',
        product_name: 'Williams Sonoma Custom Desk',
        category: 'Furniture',
        sub_category: 'Desks',
        brand: 'Williams Sonoma',
        price: 89.08,
        material: 'Concrete',
        color: 'Brown | Gray',
        finish: 'Powder Coated',
        dimensions: '67x13x8 inches',
        weight: '108.9 lbs',
        style: 'Farmhouse | Minimalist',
        description_text: 'Timeless furniture essential that combines style with practicality. Made from high-quality concrete.'
    },
    {
        sku_id: 'SKU00047',
        product_name: 'Rejuvenation Modern Desk',
        category: 'Furniture',
        sub_category: 'Desks',
        brand: 'Rejuvenation',
        price: 78.56,
        material: 'Linen | Leather',
        color: 'Gray | Walnut',
        finish: 'Antique',
        dimensions: '59x77x11 inches',
        weight: '103.2 lbs',
        style: 'Coastal | Transitional',
        description_text: 'Beautiful coastal desks crafted with premium materials. Perfect addition to any home.'
    }
];
const sampleReviews = [
    { sku_id: 'SKU00001', full_name: 'Sarah M.', rating: 5, review_text: 'Excellent quality! This sofa is absolutely beautiful and incredibly comfortable. The textured finish adds so much character to my living room.' },
    { sku_id: 'SKU00001', full_name: 'John D.', rating: 4, review_text: 'Great sofa, really like it. Took about 2 weeks for delivery but was worth the wait.' },
    { sku_id: 'SKU00001', full_name: 'Emily R.', rating: 5, review_text: 'Perfect for my Transitional style home. The craftsmanship is outstanding!' },
    { sku_id: 'SKU00002', full_name: 'Michael B.', rating: 5, review_text: 'Love the bohemian style. This boho sofa is my favorite piece in the house now!' },
    { sku_id: 'SKU00002', full_name: 'Lisa T.', rating: 4, review_text: 'Beautiful color options. Mine arrived in perfect condition.' },
    { sku_id: 'SKU00024', full_name: 'David R.', rating: 5, review_text: 'Premium chair, looks like it could be from a luxury boutique. Love the Art Deco style.' },
];
const seedDatabase = async () => {
    try {
        console.log('🌱 Seeding database with sample products...');
        // Insert products
        for (const product of sampleProducts) {
            await database_1.default.query(`INSERT INTO products (sku_id, product_name, category, sub_category, brand, price, material, color, finish, dimensions, weight, style, description_text)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (sku_id) DO NOTHING`, [
                product.sku_id,
                product.product_name,
                product.category,
                product.sub_category,
                product.brand,
                product.price,
                product.material,
                product.color,
                product.finish,
                product.dimensions,
                product.weight,
                product.style,
                product.description_text
            ]);
        }
        console.log('✅ Products seeded');
        // Insert sample reviews
        for (const review of sampleReviews) {
            // First get a customer ID (create if not exists)
            const customerRes = await database_1.default.query(`INSERT INTO customers (email, full_name, password_hash, role)
         VALUES ($1, $2, $3, 'customer')
         ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
         RETURNING customer_id`, [
                `${review.full_name.toLowerCase().replace(' ', '.')}@example.com`,
                review.full_name,
                'hashed_password'
            ]);
            const customerId = customerRes.rows[0].customer_id;
            await database_1.default.query(`INSERT INTO reviews (sku_id, customer_id, rating, review_text)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`, [review.sku_id, customerId, review.rating, review.review_text]);
        }
        console.log('✅ Reviews seeded');
        console.log('✅ Sample data seeded successfully!');
    }
    catch (error) {
        console.error('⚠️ Error seeding database:', error);
    }
};
exports.seedDatabase = seedDatabase;
