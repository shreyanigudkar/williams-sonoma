export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'manufacturer' | 'admin';
}

export interface Product {
  skuId: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  tags: string[];
  category: string;
}

export interface ProductDetail extends Product {
  description: string;
  specifications: {
    material: string;
    color: string;
    finish: string;
    dimensions: string;
    weight: string;
    style: string;
  };
}

export interface Order {
  orderId: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  itemCount: number;
}

export interface OrderItem {
  skuId: string;
  quantity: number;
  pricePerUnit: number;
  productName: string;
}

export interface Review {
  reviewId: string;
  author: string;
  rating: number;
  title: string;
  text: string;
  date: string;
}

export interface BuyerInsight {
  initials: string;
  matchPercentage: number;
  context: string;
  rating: number;
  excerpt: string;
}

export interface ProductInsight {
  buyersLikeYou: BuyerInsight[];
  returnReasons: string[];
  highlights: {
    pros: string[];
    cons: string[];
  };
  suggestedRewrite: string | null;
  originalDescription: string | null;
}

export interface PriorityAction {
  level: 'critical' | 'high' | 'medium' | 'low';
  productName: string;
  issue: string;
  revenueAtRisk: string;
  urgencyScore: number;
}
