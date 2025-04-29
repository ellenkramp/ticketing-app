import request from "supertest";
import { app } from "../../app";

it("fails when an email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "helloWorld12345",
    })
    .expect(400);
});

it("fails when an incorrect password is provided", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "helloWorld12345",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "helloWorld1235",
    })
    .expect(400);
});

it("responds with a cookie with valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "helloWorld12345",
    })
    .expect(201);

  const response = await request(app).post("/api/users/signin").send({
    email: "test@test.com",
    password: "helloWorld12345",
  });

  expect(response.get("Set-Cookie")).toBeDefined();
});
