import express from "express";

let router = express.Router();

router.post("/api/users/signin", (req, res) => {
  res.send({
    msg: "Hi There!",
  });
});

export { router as signinRouter };
