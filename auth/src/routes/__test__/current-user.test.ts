import request from "supertest";
import { app } from "../../app";

it("returns the current user", async () => {
  let cookie = await signin();
  let response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser.email).toEqual("asdf@asdf.com");
});

it("responds with null if you're not authenticated", async () => {
  let response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toBeNull();
});
