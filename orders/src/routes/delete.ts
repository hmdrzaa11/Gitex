import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@hamidtickets/common";
import { Order, OrderStatus } from "../models/order";

let router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    let { orderId } = req.params;
    let order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    order.status = OrderStatus.Cancelled;
    await order.save();
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
