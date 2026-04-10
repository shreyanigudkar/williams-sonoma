import axios, { AxiosInstance } from 'axios';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 10000,
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  login(email: string, password: string, role: string) {
    return this.client.post('/auth/login', { email, password, role });
  }

  signup(data: {
    email: string;
    password: string;
    fullName: string;
    ageGroup?: string;
    lifestyleTags?: string;
    preferredStyles?: string;
    preferredColors?: string;
    lightingCondition?: string;
  }) {
    return this.client.post('/auth/signup', data);
  }

  getPreferenceOptions() {
    return this.client.get('/auth/preference-options');
  }

  getMe() {
    return this.client.get('/auth/me');
  }

  // Catalog
  getProducts(filters?: {
    category?: string;
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.client.get('/catalog/products', { params: filters });
  }

  getProduct(skuId: string) {
    return this.client.get(`/catalog/product/${skuId}`);
  }

  getProductInsights(skuId: string) {
    return this.client.get(`/catalog/product/${skuId}/insights`);
  }

  getCategories() {
    return this.client.get('/catalog/categories');
  }

  // Customer
  getOrders() {
    return this.client.get('/customer/orders');
  }

  createOrder(data: { items: any[]; totalAmount: number; paymentType: string }) {
    return this.client.post('/customer/orders', data);
  }

  createReturn(data: {
    orderId: string;
    orderItemId: string;
    skuId: string;
    reason: string;
    note?: string;
  }) {
    return this.client.post('/customer/returns', data);
  }

  getSimilarReviews(skuId: string) {
    return this.client.get(`/customer/product/${skuId}/similar-reviews`);
  }

  // Manufacturer
  getManufacturerDashboard() {
    return this.client.get('/manufacturer/dashboard');
  }

  getManufacturerProducts() {
    return this.client.get('/manufacturer/products');
  }

  getProductDetail(skuId: string) {
    return this.client.get(`/manufacturer/product/${skuId}`);
  }

  updateDescription(skuId: string, description: string) {
    return this.client.put(`/manufacturer/product/${skuId}/description`, { description });
  }

  // Admin
  getStats() {
    return this.client.get('/admin/stats');
  }

  getCategories_admin() {
    return this.client.get('/admin/categories');
  }

  getManufacturers() {
    return this.client.get('/admin/manufacturers');
  }

  getTopIssues() {
    return this.client.get('/admin/top-issues');
  }
}

export default new ApiService();
