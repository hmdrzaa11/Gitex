import express from "express";
import { json } from "body-parser";

let app = express();

app.use(json());

app.listen(3000, () => {
  console.log("Auth listening on 3000");
});
