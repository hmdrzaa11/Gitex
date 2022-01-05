import express from "express";

let router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  res.send({
    msg: "Hi There!",
  });
});

export { router as currentUserRouter };
