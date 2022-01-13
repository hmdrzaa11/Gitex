import express, { Request, Response } from "express";

let router = express.Router();

router.get("/api/orders/:orderId", async (req: Request, res: Response) => {
  res.send({});
});

export { router as showOrderRouter };
