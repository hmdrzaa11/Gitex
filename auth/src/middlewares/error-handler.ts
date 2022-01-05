import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export let errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  //any other error needs to be logged and then send a generic message
  res.status(400).send({ errors: [{ message: "Something went wrong" }] });
};
