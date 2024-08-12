import jwt, { Secret } from 'jsonwebtoken'
import { Request,Response,NextFunction } from "express";
import User from '../database/models/User';


export interface AuthRequest extends Request{
    userId?: string;
    user?: {
        role: string;
    };
}

export const verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ error: "Token not provided" });
    }
    try {
        const secret: Secret | undefined = process.env.JWT_SECRET_KEY;
        if (!secret) {
            throw new Error("JWT secret key is not defined");            
        }
        const decoded = jwt.verify(token.split(" ")[1], secret) as { userId: string };
        console.log("decoded: ", decoded);
        console.log("id ", decoded.userId);
        console.log("token : ", token);
        // Définir l'ID de l'utilisateur dans la demande
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(400).json({ error: "Invalid token" });
    }
};


export const authorizeRole = (requiredRoles:string) => {
    return async (req:AuthRequest, res:Response, next:NextFunction)=>{
    const user = await User.findById(req.userId);
    if(user?.role !== requiredRoles){
        return res.status(400).json({error: "You do not have permission to perform this action"})
    }
    next()   
}
}
