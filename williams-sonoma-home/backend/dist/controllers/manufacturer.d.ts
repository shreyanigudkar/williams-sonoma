import { Request, Response } from 'express';
export declare const manufacturerController: {
    getDashboard(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getProductDetail(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateDescription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
