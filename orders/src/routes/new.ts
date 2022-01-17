import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@hamidtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

let router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .withMessage("ticketId must be defined")
      .custom((input: string) => {
        return mongoose.isValidObjectId(input);
      }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //find the ticket that user is trying to purchase in our replica database of tickets
    let { ticketId } = req.body;
    let ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();
    //make sure that ticket is not reserved (means its not tie to an order and if it dose that order must have a cancelled status)
    let isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket is already reserved");
    //calculate an expiration date for ticket
    let expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    //build the order and save it into DB
    let order = Order.build({
      userId: req.currentUser!.id,
      expiresAt: expiration,
      ticket,
      status: OrderStatus.Created,
    });

    await order.save();
    //Emit an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
