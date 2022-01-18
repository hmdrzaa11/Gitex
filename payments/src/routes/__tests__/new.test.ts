import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/order";
import { OrderStatus } from "@hamidtickets/common";

it("returns a 404 when purchasing an order that not exists", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({ orderId: mongoose.Types.ObjectId().toHexString(), token: "asdf" })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not exists", async () => {
  let order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: "asdf",
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin())
    .send({ orderId: order.id, token: "asdf" })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  let userId = mongoose.Types.ObjectId().toHexString();
  let order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Cancelled,
    userId,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signin(userId))
    .send({
      token: "asdf",
      orderId: order.id,
    })
    .expect(400);
});
