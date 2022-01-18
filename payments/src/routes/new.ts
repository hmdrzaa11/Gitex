import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
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
    let { token, orderId } = req.body;
    let order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Order is cancelled");
    res.send({ success: true });
  }
);

export { router as createChargeRouter };
