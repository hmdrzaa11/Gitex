import request from "supertest";
import { app } from "../../app";

it("fails when an email dose not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "asdf@asdf.com", password: "asdf" })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  //create an account first
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "asdf@asdf.com",
      password: "asdf",
    })
    .expect(201);

  //signin
  await request(app)
    .post("/api/users/signin")
    .send({ email: "asdf@asdf.com", password: "asdfd" })
    .expect(400);
});

it("response with a cookie when valid credential is provided", async () => {
  //create an account first
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "asdf@asdf.com",
      password: "asdf",
    })
    .expect(201);

  //signin
  let response = await request(app)
    .post("/api/users/signin")
    .send({ email: "asdf@asdf.com", password: "asdf" })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
