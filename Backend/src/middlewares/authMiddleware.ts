import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try{

        const authheader = req.headers.authorization;
        
        if(!authheader || !authheader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        
        const token = authheader.split(' ')[1];
        
        const decode  = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

        (req as any).user = decode as JwtPayload; 
        next();
    }catch(err) {
        console.error(err);
        res.status(403).json({ message: 'Invalid token' });
        return;
    }

}