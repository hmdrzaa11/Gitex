import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

it("returns a 404 if ticket is not found", async () => {
  let ticketId = new mongoose.Types.ObjectId();
  await request(app).get(`/api/tickets/${ticketId}`).send().expect(404);
});

it("returns a ticket is ticket is found", async () => {
  let response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({ title: "concert", price: 120 })
    .expect(201);

  let ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
  expect(ticketResponse.body.title).toEqual("concert");
  expect(ticketResponse.body.price).toEqual(120);
});
