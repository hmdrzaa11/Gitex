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
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    let charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });
    let payment = Payment.build({
      orderId: orderId,
      stripeId: charge.id,
    });
    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });
    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
