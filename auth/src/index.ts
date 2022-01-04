import express from "express";
import { json } from "body-parser";

let app = express();

app.use(json());

app.get("/api/users/currentuser", (req, res) => {
  res.send({ msg: "Hi There" });
});

app.listen(3000, () => {
  console.log("Auth listening on 3000!!!");
});
