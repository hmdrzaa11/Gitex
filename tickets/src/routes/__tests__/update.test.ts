import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if provided id dose not exists", async () => {
  let id = new mongoose.Types.ObjectId();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signin())
    .send({ title: "asdf", price: 120 })
    .expect(404);
});

it("returns a 401 if user is not authenticated", async () => {
  let id = new mongoose.Types.ObjectId();
  await request(app)
    .put(`/api/tickets/${id}`)

    .send({ title: "asdf", price: 120 })
    .expect(401);
});

it("returns a 401 if the user dose not own the ticket", async () => {
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "asdf", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", signin())
    .send({ title: "asdf", price: 200 })
    .expect(401);
});

it("returns a 400 if user provides an invalid title or price", async () => {
  let cookie = signin();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdf", price: 10 })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "asdf", price: -10 })
    .expect(400);
});

it("updates the ticket with provided inputs", async () => {
  let cookie = signin();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdf", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(200);

  let ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);
  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});

it("publishes an event after updating the ticket", async () => {
  let cookie = signin();
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "asdf", price: 10 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 100 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
