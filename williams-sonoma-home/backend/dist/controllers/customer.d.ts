import { Request, Response } from 'express';
export declare const customerController: {
    getOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    createReturn(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSimilarReviews(req: Request, res: Response): Promise<void>;
};
