import { Request, Response } from 'express';
export declare const catalogController: {
    getProducts(req: Request, res: Response): Promise<void>;
    getProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProductInsights(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCategories(req: Request, res: Response): Promise<void>;
};
