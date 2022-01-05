import express from "express";

let router = express.Router();

router.post("/api/users/signout", (req, res) => {
  res.send({
    msg: "Hi There!",
  });
});

export { router as signoutRouter };
