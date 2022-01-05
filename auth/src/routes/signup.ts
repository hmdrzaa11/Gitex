import express from "express";

let router = express.Router();

router.post("/api/users/signup", (req, res) => {
  res.send({
    msg: "Hi There!",
  });
});

export { router as signupRouter };
