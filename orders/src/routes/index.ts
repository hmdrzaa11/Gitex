import express, { Request, Response } from "express";
import { requireAuth } from "@hamidtickets/common";
import { Order } from "../models/order";

let router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  let orders = await Order.find({ userId: req.currentUser!.id }).populate(
    "ticket"
  );
  res.send(orders);
});

export { router as indexOrderRouter };
