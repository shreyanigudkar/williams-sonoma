import jwt from 'jsonwebtoken';
export declare const generateToken: (userId: string, role: string) => string;
export declare const verifyToken: (token: string) => {
    userId: string;
    role: string;
};
export declare const decodeToken: (token: string) => string | jwt.JwtPayload | null;
