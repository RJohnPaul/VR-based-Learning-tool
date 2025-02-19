import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token; 

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET as string;
    if (!secretKey) {
      throw new Error("JWT secret key is missing in environment variables");
    }

    const decoded = jwt.verify(token, secretKey) as { userId: string; email: string };
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authenticateUser;
