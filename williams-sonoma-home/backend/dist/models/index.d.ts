export declare const customerModel: {
    findById(customerId: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    create(data: any): Promise<any>;
    getEmbedding(customerId: string): Promise<any>;
};
export declare const productModel: {
    findBySku(skuId: string): Promise<any>;
    search(filters: {
        category?: string;
        search?: string;
        sort?: string;
        limit: number;
        offset: number;
    }): Promise<any[]>;
    getCategories(): Promise<any[]>;
    count(): Promise<number>;
};
export declare const orderModel: {
    create(customerId: string, items: any[], totalAmount: number, paymentType: string): Promise<any>;
    getCustomerOrders(customerId: string): Promise<any[]>;
    getOrderDetails(orderId: string): Promise<any[]>;
};
export declare const returnModel: {
    create(customerId: string, orderId: string, orderItemId: string, skuId: string, reason: string, note: string): Promise<any>;
    getCustomerReturns(customerId: string): Promise<any[]>;
};
export declare const reviewModel: {
    getProductReviews(skuId: string, limit?: number): Promise<any[]>;
    getAverageRating(skuId: string): Promise<any>;
    create(skuId: string, customerId: string, rating: number, reviewText: string, reviewTitle: string): Promise<any>;
};
