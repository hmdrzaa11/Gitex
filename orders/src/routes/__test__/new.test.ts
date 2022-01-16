import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if ticket dose not exist", async () => {
  let ticketId = mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if ticket dalready reserved", async () => {
  let ticket = Ticket.build({
    id: mongoose.Types.ObjectId(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  let order = Order.build({
    ticket,
    expiresAt: new Date(),
    userId: "asdf",
    status: OrderStatus.Created,
  });

  await order.save();

  //now let's make the request

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  let ticket = Ticket.build({
    id: mongoose.Types.ObjectId(),
    title: "Concert",
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  let ticket = Ticket.build({
    id: mongoose.Types.ObjectId(),
    title: "Concert",
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
