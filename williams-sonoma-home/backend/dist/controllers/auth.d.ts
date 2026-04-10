import { Request, Response } from 'express';
export declare const authController: {
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    signup(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPreferenceOptions(req: Request, res: Response): Promise<void>;
};
