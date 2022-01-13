import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@hamidtickets/common";
import { body } from "express-validator";

let router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("titleId")
      .notEmpty()
      .withMessage("ticketId must be defined")
      .custom((input: string) => {
        return mongoose.isValidObjectId(input);
      }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
