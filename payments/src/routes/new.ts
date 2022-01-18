import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  BadRequestError,
  NotFoundError,
  requireAuth,
} from "@hamidtickets/common";

import { Order } from "../models/order";

let router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").notEmpty().withMessage("Token is required"),
    body("orderId").notEmpty().withMessage("orderId is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as createChargeRouter };
