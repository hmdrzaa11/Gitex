import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

let router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("password is required"),
  ],
  validateRequest,
  (req: Request, res: Response) => {
    res.send({
      msg: "Hi There!",
    });
  }
);

export { router as signinRouter };
