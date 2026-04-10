import { Request, Response } from 'express';
export declare const adminController: {
    getStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getCategories(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getManufacturers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getTopIssues(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
};
