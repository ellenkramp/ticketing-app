import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "helloWorld12345",
    })
    .expect(201);

  expect(signupResponse.get("Set-Cookie")).toBeDefined();

  const signoutResponse = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  const cookie = signoutResponse.get("Set-Cookie");

  if (!cookie) {
    throw new Error("Expected cookie but got undefined.");
  }

  expect(cookie[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
