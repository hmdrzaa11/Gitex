import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  //create a ticket
  let ticket = Ticket.build({
    id: mongoose.Types.ObjectId(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  //make a request to create an order
  let user = signin();
  let { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to fetch the order
  let repsonse = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);
  expect(repsonse.body.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  //create a ticket
  let ticket = Ticket.build({
    id: mongoose.Types.ObjectId(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  //make a request to create an order
  let user = signin();
  let { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to fetch the order
  let repsonse = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", signin())
    .send()
    .expect(401);
});
