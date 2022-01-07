import request from "supertest";
import { app } from "../../app";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "asdf@asdf.com", password: "asdf" })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "asdf.com", password: "asdf" })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "asdf.com", password: "a" })
    .expect(400);
});

it("returns a 400 with an missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ password: "asdf" })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "asdf@asdf.com" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "asdf@asdf.com", password: "asdf" })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({ email: "asdf@asdf.com", password: "asdf" })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  let response = await request(app)
    .post("/api/users/signup")
    .send({ email: "asdf@asdf.com", password: "asdf" })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
