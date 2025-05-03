import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.statusCode).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.statusCode).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const body = {
    title: "",
    price: 10,
  };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body)
    .expect(400);

  const body2 = {
    price: 10,
  };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body2)
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  const body = {
    title: "asdf",
    price: -10,
  };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body)
    .expect(400);

  const body2 = {
    title: "asdf",
  };

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body2)
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const body = {
    title: "asdf",
    price: 20,
  };
  // add check to make sure ticket saved
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body)
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
});
