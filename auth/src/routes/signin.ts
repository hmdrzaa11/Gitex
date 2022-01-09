import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError, validateRequest } from "@hamidtickets/common";

import { User } from "../models/user";
import { Password } from "../services/password";

let router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    let { email, password } = req.body;
    let existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError("Invalid Credential");
    let passwordMatch = await Password.compare(existingUser.password, password);
    if (!passwordMatch) throw new BadRequestError("Invalid Credential");

    //Generate the JWT
    let userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    // and store it on session obj
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
