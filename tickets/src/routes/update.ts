import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@hamidtickets/common";
import { Ticket } from "../models/ticket";

let router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").notEmpty().withMessage("title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });

    await ticket.save();
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
