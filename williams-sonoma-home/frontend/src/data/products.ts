// Sample products from dataset - extracted from Products.csv
export const catalogProducts = [
  {
    skuId: 'SKU00001',
    name: 'Rejuvenation Artisan Sofa',
    brand: 'Rejuvenation',
    price: 370.49,
    category: 'Furniture',
    subCategory: 'Sofas',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.5,
    ratingCount: 128,
    tags: ['Comfortable', 'Elegant', 'Textured'],
    material: 'Wood',
    color: 'Black | Charcoal',
    style: 'Transitional',
    description: 'Elegant design meets functionality in this Rejuvenation piece. Features textured finish and durable construction.',
    dimensions: '44x45x8 inches',
    weight: '48.1 lbs'
  },
  {
    skuId: 'SKU00002',
    name: 'Rejuvenation Signature Sofa',
    brand: 'Rejuvenation',
    price: 202.17,
    category: 'Furniture',
    subCategory: 'Sofas',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.7,
    ratingCount: 95,
    tags: ['Bohemian', 'Premium', 'Cozy'],
    material: 'Glass | Wood',
    color: 'Black | Blue',
    style: 'Bohemian',
    description: 'Beautiful bohemian sofas crafted with premium materials. Perfect addition to any home.',
    dimensions: '46x53x26 inches',
    weight: '133.3 lbs'
  },
  {
    skuId: 'SKU00015',
    name: 'Williams Sonoma Custom Dining Table',
    brand: 'Williams Sonoma',
    price: 28.43,
    category: 'Furniture',
    subCategory: 'Dining Tables',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.6,
    ratingCount: 156,
    tags: ['Coastal', 'Modern', 'Sleek'],
    material: 'Rattan | Marble',
    color: 'Ivory',
    style: 'Coastal',
    description: 'Contemporary design that elevates your space. Easy to maintain and built to last.',
    dimensions: '42x62x26 inches',
    weight: '35.3 lbs'
  },
  {
    skuId: 'SKU00020',
    name: 'Williams Sonoma Premium Dining Table',
    brand: 'Williams Sonoma',
    price: 45.07,
    category: 'Furniture',
    subCategory: 'Dining Tables',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.4,
    ratingCount: 73,
    tags: ['Transitional', 'Elegant', 'Spacious'],
    material: 'Ceramic | Metal',
    color: 'Navy',
    style: 'Transitional',
    description: 'Beautiful transitional dining tables crafted with premium materials. Perfect addition to any home.',
    dimensions: '64x41x11 inches',
    weight: '99.5 lbs'
  },
  {
    skuId: 'SKU00024',
    name: 'West Elm Premium Chair',
    brand: 'West Elm',
    price: 336.55,
    category: 'Furniture',
    subCategory: 'Chairs',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.8,
    ratingCount: 214,
    tags: ['Art Deco', 'Luxury', 'Comfortable'],
    material: 'Cotton',
    color: 'Natural',
    style: 'Art Deco',
    description: 'Contemporary design that elevates your space. Easy to maintain and built to last.',
    dimensions: '22x42x20 inches',
    weight: '65.2 lbs'
  },
  {
    skuId: 'SKU00027',
    name: 'Rejuvenation Modern Chair',
    brand: 'Rejuvenation',
    price: 174.78,
    category: 'Furniture',
    subCategory: 'Chairs',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.5,
    ratingCount: 89,
    tags: ['Bohemian', 'Modern', 'Velvet'],
    material: 'Velvet | Leather',
    color: 'Walnut | Natural',
    style: 'Bohemian',
    description: 'Timeless furniture essential that combines style with practicality. Made from high-quality velvet.',
    dimensions: '26x69x28 inches',
    weight: '123.2 lbs'
  },
  {
    skuId: 'SKU00032',
    name: 'West Elm Custom Bed',
    brand: 'West Elm',
    price: 743.99,
    category: 'Furniture',
    subCategory: 'Beds',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.9,
    ratingCount: 301,
    tags: ['Glam', 'Luxury', 'Premium'],
    material: 'Silk | Rattan',
    color: 'Navy | Natural',
    style: 'Glam',
    description: 'Timeless furniture essential that combines style with practicality. Made from high-quality silk.',
    dimensions: '19x10x9 inches',
    weight: '38.8 lbs'
  },
  {
    skuId: 'SKU00035',
    name: 'Pottery Barn Artisan Bed',
    brand: 'Pottery Barn',
    price: 312.29,
    category: 'Furniture',
    subCategory: 'Beds',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.6,
    ratingCount: 142,
    tags: ['Minimalist', 'Farmhouse', 'Green'],
    material: 'Velvet | Silk',
    color: 'Green',
    style: 'Minimalist | Farmhouse',
    description: 'Contemporary design that elevates your space. Easy to maintain and built to last.',
    dimensions: '24x34x15 inches',
    weight: '58.3 lbs'
  },
  {
    skuId: 'SKU00044',
    name: 'Williams Sonoma Custom Desk',
    brand: 'Williams Sonoma',
    price: 89.08,
    category: 'Furniture',
    subCategory: 'Desks',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.3,
    ratingCount: 64,
    tags: ['Farmhouse', 'Minimalist', 'Concrete'],
    material: 'Concrete',
    color: 'Brown | Gray',
    style: 'Farmhouse | Minimalist',
    description: 'Timeless furniture essential that combines style with practicality. Made from high-quality concrete.',
    dimensions: '67x13x8 inches',
    weight: '108.9 lbs'
  },
  {
    skuId: 'SKU00047',
    name: 'Rejuvenation Modern Desk',
    brand: 'Rejuvenation',
    price: 78.56,
    category: 'Furniture',
    subCategory: 'Desks',
    imageUrl: '/furniture-placeholder.png',
    rating: 4.5,
    ratingCount: 87,
    tags: ['Coastal', 'Transitional', 'Stylish'],
    material: 'Linen | Leather',
    color: 'Gray | Walnut',
    style: 'Coastal | Transitional',
    description: 'Beautiful coastal desks crafted with premium materials. Perfect addition to any home.',
    dimensions: '59x77x11 inches',
    weight: '103.2 lbs'
  }
];

export interface Product {
  skuId: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  subCategory: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  tags: string[];
  material: string;
  color: string;
  style: string;
  description: string;
  dimensions: string;
  weight: string;
}
