// import pool from './database';
// import fs from 'fs';
// import path from 'path';
// import csvParser from 'csv-parser';
// import * as csv from 'csv-parse/sync';
// const sampleProducts = [
//   {
//     sku_id: 'SKU00001',
//     product_name: 'Rejuvenation Artisan Sofa',
//     category: 'Furniture',
//     sub_category: 'Sofas',
//     brand: 'Rejuvenation',
//     price: 370.49,
//     material: 'Wood',
//     color: 'Black | Charcoal',
//     finish: 'Textured',
//     dimensions: '44x45x8 inches',
//     weight: '48.1 lbs',
//     style: 'Transitional',
//     description_text: 'Elegant design meets functionality in this Rejuvenation piece. Features textured finish and durable construction.'
//   },
//   {
//     sku_id: 'SKU00002',
//     product_name: 'Rejuvenation Signature Sofa',
//     category: 'Furniture',
//     sub_category: 'Sofas',
//     brand: 'Rejuvenation',
//     price: 202.17,
//     material: 'Glass | Wood',
//     color: 'Black | Blue',
//     finish: 'Matte',
//     dimensions: '46x53x26 inches',
//     weight: '133.3 lbs',
//     style: 'Bohemian',
//     description_text: 'Beautiful bohemian sofas crafted with premium materials. Perfect addition to any home.'
//   },
//   {
//     sku_id: 'SKU00015',
//     product_name: 'Williams Sonoma Custom Dining Table',
//     category: 'Furniture',
//     sub_category: 'Dining Tables',
//     brand: 'Williams Sonoma',
//     price: 28.43,
//     material: 'Rattan | Marble',
//     color: 'Ivory',
//     finish: 'Brushed',
//     dimensions: '42x62x26 inches',
//     weight: '35.3 lbs',
//     style: 'Coastal',
//     description_text: 'Contemporary design that elevates your space. Easy to maintain and built to last.'
//   },
//   {
//     sku_id: 'SKU00020',
//     product_name: 'Williams Sonoma Premium Dining Table',
//     category: 'Furniture',
//     sub_category: 'Dining Tables',
//     brand: 'Williams Sonoma',
//     price: 45.07,
//     material: 'Ceramic | Metal',
//     color: 'Navy',
//     finish: 'Polished',
//     dimensions: '64x41x11 inches',
//     weight: '99.5 lbs',
//     style: 'Transitional',
//     description_text: 'Beautiful transitional dining tables crafted with premium materials. Perfect addition to any home.'
//   },
//   {
//     sku_id: 'SKU00024',
//     product_name: 'West Elm Premium Chair',
//     category: 'Furniture',
//     sub_category: 'Chairs',
//     brand: 'West Elm',
//     price: 336.55,
//     material: 'Cotton',
//     color: 'Natural',
//     finish: 'Distressed',
//     dimensions: '22x42x20 inches',
//     weight: '65.2 lbs',
//     style: 'Art Deco',
//     description_text: 'Contemporary design that elevates your space. Easy to maintain and built to last.'
//   },
//   {
//     sku_id: 'SKU00027',
//     product_name: 'Rejuvenation Modern Chair',
//     category: 'Furniture',
//     sub_category: 'Chairs',
//     brand: 'Rejuvenation',
//     price: 174.78,
//     material: 'Velvet | Leather',
//     color: 'Walnut | Natural',
//     finish: 'Powder Coated',
//     dimensions: '26x69x28 inches',
//     weight: '123.2 lbs',
//     style: 'Bohemian',
//     description_text: 'Timeless furniture essential that combines style with practicality. Made from high-quality velvet.'
//   },
//   {
//     sku_id: 'SKU00032',
//     product_name: 'West Elm Custom Bed',
//     category: 'Furniture',
//     sub_category: 'Beds',
//     brand: 'West Elm',
//     price: 743.99,
//     material: 'Silk | Rattan',
//     color: 'Navy | Natural',
//     finish: 'Antique',
//     dimensions: '19x10x9 inches',
//     weight: '38.8 lbs',
//     style: 'Glam',
//     description_text: 'Timeless furniture essential that combines style with practicality. Made from high-quality silk.'
//   },
//   {
//     sku_id: 'SKU00035',
//     product_name: 'Pottery Barn Artisan Bed',
//     category: 'Furniture',
//     sub_category: 'Beds',
//     brand: 'Pottery Barn',
//     price: 312.29,
//     material: 'Velvet | Silk',
//     color: 'Green',
//     finish: 'Lacquered',
//     dimensions: '24x34x15 inches',
//     weight: '58.3 lbs',
//     style: 'Minimalist | Farmhouse',
//     description_text: 'Contemporary design that elevates your space. Easy to maintain and built to last.'
//   },
//   {
//     sku_id: 'SKU00044',
//     product_name: 'Williams Sonoma Custom Desk',
//     category: 'Furniture',
//     sub_category: 'Desks',
//     brand: 'Williams Sonoma',
//     price: 89.08,
//     material: 'Concrete',
//     color: 'Brown | Gray',
//     finish: 'Powder Coated',
//     dimensions: '67x13x8 inches',
//     weight: '108.9 lbs',
//     style: 'Farmhouse | Minimalist',
//     description_text: 'Timeless furniture essential that combines style with practicality. Made from high-quality concrete.'
//   },
//   {
//     sku_id: 'SKU00047',
//     product_name: 'Rejuvenation Modern Desk',
//     category: 'Furniture',
//     sub_category: 'Desks',
//     brand: 'Rejuvenation',
//     price: 78.56,
//     material: 'Linen | Leather',
//     color: 'Gray | Walnut',
//     finish: 'Antique',
//     dimensions: '59x77x11 inches',
//     weight: '103.2 lbs',
//     style: 'Coastal | Transitional',
//     description_text: 'Beautiful coastal desks crafted with premium materials. Perfect addition to any home.'
//   }
// ];

// const sampleReviews = [
//   { sku_id: 'SKU00001', full_name: 'Sarah M.', rating: 5, review_text: 'Excellent quality! This sofa is absolutely beautiful and incredibly comfortable. The textured finish adds so much character to my living room.' },
//   { sku_id: 'SKU00001', full_name: 'John D.', rating: 4, review_text: 'Great sofa, really like it. Took about 2 weeks for delivery but was worth the wait.' },
//   { sku_id: 'SKU00001', full_name: 'Emily R.', rating: 5, review_text: 'Perfect for my Transitional style home. The craftsmanship is outstanding!' },
  
//   { sku_id: 'SKU00002', full_name: 'Michael B.', rating: 5, review_text: 'Love the bohemian style. This boho sofa is my favorite piece in the house now!' },
//   { sku_id: 'SKU00002', full_name: 'Lisa T.', rating: 4, review_text: 'Beautiful color options. Mine arrived in perfect condition.' },
  
//   { sku_id: 'SKU00024', full_name: 'David R.', rating: 5, review_text: 'Premium chair, looks like it could be from a luxury boutique. Love the Art Deco style.' },
// ];

// export const seedDatabase = async () => {
//   try {    const seedProducts = async () => {
//       const productsFile = path.join(process.cwd(), '..', '..', 'dataset', 'Products.csv');
//       if (!fs.existsSync(productsFile)) {
//         console.warn('⚠️ Products.csv not found, using minimal fallback');
//         // fall back to one or two in code if needed
//         return;
//       }
      
//       const fileContent = fs.readFileSync(productsFile, 'utf-8');
//       const parsedProducts = csv.parse(fileContent, { columns: true, skip_empty_lines: true }) as any[];

//       console.log(`🌱 Seeding ${parsedProducts.length} products from CSV...`);
      
//       for (const p of parsedProducts) {
//         await pool.query(
//           `INSERT INTO products (sku_id, product_name, category, sub_category, brand, price, material, color, finish, dimensions, weight, style, description_text, image_url, launch_date)
//            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
//            ON CONFLICT (sku_id) DO UPDATE SET 
//             product_name = EXCLUDED.product_name,
//             price = EXCLUDED.price,
//             description_text = EXCLUDED.description_text`,
//           [
//             p.sku_id, p.product_name, p.category, p.sub_category, p.brand, 
//             parseFloat(p.price) || 0, p.material, p.color, p.finish, 
//             p.dimensions, p.weight, p.style, p.description_text, 
//             p.image_url, p.Launch_date || new Date().toISOString()
//           ]
//         );
//       }
//       console.log('✅ Products seeded');
//     };

//     await seedProducts();

//     // Parse and insert actual reviews from CSV
//     const parsedReviews: any[] = [];
//     const csvPath = path.join(process.cwd(), '..', '..', 'dataset', 'Reviews.csv');
    
//     console.log(`Parsing reviews from ${csvPath}...`);
    
//     if (fs.existsSync(csvPath)) {
//       await new Promise<void>((resolve, reject) => {
//         fs.createReadStream(csvPath)
//           .pipe(csvParser())
//           .on('data', (data) => parsedReviews.push(data))
//           .on('end', () => resolve())
//           .on('error', (err) => reject(err));
//       });
      
//       console.log(`✅ Loaded ${parsedReviews.length} reviews from CSV. Seeding to DB...`);

//       // Clear existing reviews
//       await pool.query('DELETE FROM reviews');

//       for (const review of parsedReviews) {
//         // Fallback IDs/text if missing
//         const customerIdentifier = review.customer_id || `CUST_${Math.random().toString(36).substr(2, 9)}`;
//         const rating = parseInt(review.rating) || 5;
//         const review_text = review.review_text || '';
//         const sku_id = review.sku_id;
//         const review_title = review.review_title || '';
//         const review_date = review.review_date || new Date().toISOString();

//         if (!sku_id || !review_text) continue;

//         // First get a customer ID (create if not exists)
//         // We'll use the CSV's customer_id to generate a unique indexable email
//         const customerRes = await pool.query(
//           `INSERT INTO customers (email, full_name, password_hash, role)
//            VALUES ($1, $2, $3, 'customer')
//            ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
//            RETURNING customer_id`,
//           [
//             `${customerIdentifier.toLowerCase()}@example.com`,
//             `Customer ${customerIdentifier}`,
//             'hashed_password'
//           ]
//         );

//         const customerId = customerRes.rows[0].customer_id;

//         await pool.query(
//           `INSERT INTO reviews (sku_id, customer_id, rating, review_text, review_title, review_date)
//            VALUES ($1, $2, $3, $4, $5, $6)`,
//           [sku_id, customerId, rating, review_text, review_title, review_date]
//         );
//       }
//     } else {
//       console.log(`⚠️ Warning: ${csvPath} not found. Skipping real reviews seeding.`);
//     }

//     console.log('✅ Reviews seeded');
//     console.log('✅ Sample data seeded successfully!');
//   } catch (error) {
//     console.error('⚠️ Error seeding database:', error);
//   }
// };


import pool from './database';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import * as csv from 'csv-parse/sync';

// Load AI insights for seeding
const loadModelInsights = () => {
  const projectRoot = process.cwd();
  const topReasonsPath = path.join(projectRoot, 'models', 'server', 'results', 'top_return_reasons.json');
  try {
    if (fs.existsSync(topReasonsPath)) {
      return JSON.parse(fs.readFileSync(topReasonsPath, 'utf-8'));
    }
  } catch (e) {}
  return {};
};

export const seedDatabase = async () => {
  try {
    /* =========================
       🌱 PRODUCTS SEEDING
    ========================== */
    const seedProducts = async () => {
      const productsFile = path.join(process.cwd(), '..', '..', 'dataset', 'Products.csv');

      if (!fs.existsSync(productsFile)) {
        console.warn('⚠️ Products.csv not found, skipping...');
        return;
      }

      const fileContent = fs.readFileSync(productsFile, 'utf-8');
      const parsedProducts = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      }) as any[];

      console.log(`🌱 Seeding ${parsedProducts.length} products...`);

      for (const p of parsedProducts) {
        const launchDate =
          p.Launch_date && !isNaN(Date.parse(p.Launch_date))
            ? new Date(p.Launch_date).toISOString()
            : new Date().toISOString();

        await pool.query(
          `INSERT INTO products 
          (sku_id, product_name, category, sub_category, brand, price, material, color, finish, dimensions, weight, style, description_text, image_url, launch_date)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
          ON CONFLICT (sku_id) DO UPDATE SET 
            product_name = EXCLUDED.product_name,
            price = EXCLUDED.price,
            description_text = EXCLUDED.description_text`,
          [
            p.sku_id,
            p.product_name,
            p.category,
            p.sub_category,
            p.brand,
            parseFloat(p.price) || 0,
            p.material,
            p.color,
            p.finish,
            p.dimensions,
            p.weight,
            p.style,
            p.description_text,
            p.image_url,
            launchDate,
          ]
        );
      }

      console.log('✅ Products seeded');
    };

    await seedProducts();

    /* =========================
       🌱 REVIEWS SEEDING
    ========================== */
    const parsedReviews: any[] = [];
    const csvPath = path.join(process.cwd(), '..', '..', 'dataset', 'Reviews.csv');

    console.log(`Parsing reviews from ${csvPath}...`);

    if (fs.existsSync(csvPath)) {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvPath)
          .pipe(csvParser())
          .on('data', (data) => parsedReviews.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      console.log(`✅ Loaded ${parsedReviews.length} reviews`);

      await pool.query('DELETE FROM reviews');

      for (const review of parsedReviews) {
        const sku_id = review.sku_id;
        const review_text = review.review_text?.trim();

        if (!sku_id || !review_text) continue;

        /* =========================
           ✅ FIX 1: CLEAN DATE PARSING
        ========================== */
        let review_date_val: string;
        if (review.review_date && review.review_date !== 'NULL' && review.review_date.trim() !== '') {
          const parsed = Date.parse(review.review_date);
          review_date_val = !isNaN(parsed) ? new Date(parsed).toISOString() : new Date().toISOString();
        } else {
          review_date_val = new Date().toISOString();
        }

        /* =========================
           ✅ FIX 2: DEBUG LOGGING
        ========================== */
        if (!review_date_val) {
          console.log('❌ Invalid review_date row:', review);
          continue;
        }

        const customerIdentifier =
          review.customer_id ||
          `CUST_${Math.random().toString(36).substring(2, 9)}`;

        const rating =
          parseInt(review.rating) >= 1 && parseInt(review.rating) <= 5
            ? parseInt(review.rating)
            : 5;

        const review_title =
          review.review_title && review.review_title.trim() !== ''
            ? review.review_title
            : 'No Title';

        /* =========================
           CREATE / UPSERT CUSTOMER
        ========================== */
        const lightingOptions = ['Bright/Natural', 'Moderate', 'Low/Dim', 'Mixed Lighting'];
        const styleOptions = ['Contemporary', 'Modern', 'Traditional', 'Transitional', 'Mid-Century Modern', 'Scandinavian', 'Minimalist', 'Maximalist'];
        const colorOptions = ['Neutral Tones', 'Warm Earth Tones', 'Cool Tones', 'Bold/Jewel Tones'];
        
        const randomLighting = lightingOptions[Math.floor(Math.random() * lightingOptions.length)];
        const randomStyle = styleOptions[Math.floor(Math.random() * styleOptions.length)];
        const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

        const customerRes = await pool.query(
          `INSERT INTO customers (external_id, email, full_name, password_hash, role, lighting_condition, preferred_styles, preferred_colors)
           VALUES ($1, $2, $3, $4, 'customer', $5, $6, $7)
           ON CONFLICT (email) DO UPDATE SET external_id = EXCLUDED.external_id
           RETURNING customer_id`,
          [
            customerIdentifier,
            `${customerIdentifier.toLowerCase()}@example.com`,
            `Customer ${customerIdentifier}`,
            'hashed_password',
            randomLighting,
            randomStyle,
            randomColor
          ]
        );

        const customerId = customerRes.rows[0].customer_id;

        /* =========================
           INSERT REVIEW
        ========================== */
        await pool.query(
          `INSERT INTO reviews 
          (sku_id, customer_id, rating, review_text, review_title, review_date)
          VALUES ($1,$2,$3,$4,$5,$6)`,
          [sku_id, customerId, rating, review_text, review_title, review_date_val]
        );
      }

      console.log('✅ Reviews seeded');

      /* =========================
         📦 ORDERS + RETURNS SEEDING FROM CSVs
      ========================== */
      console.log('🌱 Seeding orders & returns from real CSVs...');

      const ordersPath = path.join(process.cwd(), '..', '..', 'dataset', 'Orders.csv');
      const orderItemsPath = path.join(process.cwd(), '..', '..', 'dataset', 'Order_items.csv');
      const returnsPath = path.join(process.cwd(), '..', '..', 'dataset', 'Returns.csv');

      if (!fs.existsSync(ordersPath) || !fs.existsSync(orderItemsPath) || !fs.existsSync(returnsPath)) {
        console.warn('⚠️ Orders/Order_items/Returns CSVs not found, skipping...');
      } else {
        const rawOrders = csv.parse(fs.readFileSync(ordersPath, 'utf-8'), { columns: true, skip_empty_lines: true }) as any[];
        const rawItems  = csv.parse(fs.readFileSync(orderItemsPath, 'utf-8'), { columns: true, skip_empty_lines: true }) as any[];
        const rawReturns = csv.parse(fs.readFileSync(returnsPath, 'utf-8'), { columns: true, skip_empty_lines: true }) as any[];

        // Clear old synthetic data
        await pool.query('DELETE FROM returns');
        await pool.query('DELETE FROM order_items');
        await pool.query('DELETE FROM orders');

        // Map CSV customer_id (e.g. CUST00001) → DB UUID
        const customerIdMap: Record<string, string> = {};
        const custRows = await pool.query('SELECT customer_id, external_id FROM customers WHERE external_id IS NOT NULL');
        for (const r of custRows.rows) {
          customerIdMap[r.external_id] = r.customer_id;
        }

        // Map CSV order_id → DB UUID
        const orderIdMap: Record<string, string> = {};
        // Map CSV order_item_id → DB UUID
        const orderItemIdMap: Record<string, string> = {};

        // Seed Orders
        let ordersSeeded = 0;
        for (const o of rawOrders) {
          const custUUID = customerIdMap[o.customer_id];
          if (!custUUID) continue; // skip if customer not in DB
          const orderDate = o.order_date && !isNaN(Date.parse(o.order_date)) ? new Date(o.order_date).toISOString() : new Date().toISOString();
          const amount = parseFloat(o.total_amount) || 0;
          const payType = o.Payment_type || 'Credit Card';
          try {
            const res = await pool.query(
              `INSERT INTO orders (customer_id, order_date, total_amount, payment_type)
               VALUES ($1,$2,$3,$4) RETURNING order_id`,
              [custUUID, orderDate, amount, payType]
            );
            orderIdMap[o.order_id] = res.rows[0].order_id;
            ordersSeeded++;
          } catch (_) {}
        }
        console.log(`✅ Seeded ${ordersSeeded} orders`);

        // Seed Order Items
        let itemsSeeded = 0;
        for (const oi of rawItems) {
          const orderUUID = orderIdMap[oi.order_id];
          if (!orderUUID) continue;
          try {
            const res = await pool.query(
              `INSERT INTO order_items (order_id, sku_id, quantity, price_per_unit, discount)
               VALUES ($1,$2,$3,$4,$5) RETURNING order_item_id`,
              [orderUUID, oi.sku_id, parseInt(oi.quantity)||1, parseFloat(oi.price_per_unit)||0, parseFloat(oi.Discount)||0]
            );
            orderItemIdMap[oi.order_item_id] = res.rows[0].order_item_id;
            itemsSeeded++;
          } catch (_) {}
        }
        console.log(`✅ Seeded ${itemsSeeded} order items`);

        // Seed Returns
        let returnsSeeded = 0;
        for (const r of rawReturns) {
          const orderUUID = orderIdMap[r.order_id];
          const orderItemUUID = orderItemIdMap[r.order_item_id];
          const custUUID = customerIdMap[r.customer_id];
          if (!orderUUID || !orderItemUUID || !custUUID) continue;
          const retDate = r.return_date && !isNaN(Date.parse(r.return_date)) ? new Date(r.return_date).toISOString() : new Date().toISOString();
          try {
            await pool.query(
              `INSERT INTO returns (order_id, order_item_id, sku_id, customer_id, return_reason, return_note, return_date, return_status, refund_amount)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
              [orderUUID, orderItemUUID, r.sku_id, custUUID, r.return_reason, r.return_note||'', retDate, r.return_status||'completed', parseFloat(r.refund_amount)||0]
            );
            returnsSeeded++;
          } catch (_) {}
        }
        console.log(`✅ Seeded ${returnsSeeded} returns (real return rate: ~${((returnsSeeded/itemsSeeded)*100).toFixed(1)}%)`);
      }

    } else {
      console.warn('⚠️ Reviews.csv not found, skipping...');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};
