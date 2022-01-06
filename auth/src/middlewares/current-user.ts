import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

interface UserPayload {
  id: string;
  email: string;
}

export let currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  //here we extract userData
  try {
    let payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (error) {}

  //if we get any kind of error we go to the next middle
  next();
};
