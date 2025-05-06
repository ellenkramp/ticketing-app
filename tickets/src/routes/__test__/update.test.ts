import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "fdas",
      price: 30,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "fdas",
      price: 30,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const body = {
    title: "heya",
    price: 10,
  };

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Boo",
      price: 10,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const body = {
    title: "heya",
    price: 10,
  };

  const cookie = global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(body)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket when provided valid inputs", async () => {
  const cookie = global.signin();
  const body = { price: 20, title: "Yada" };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(body)
    .expect(201);

  const newBody = { title: "new title", price: 30 };

  const ticketResponse = await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(newBody)
    .expect(200);

  expect(ticketResponse.body.title).toEqual(newBody.title);
  expect(ticketResponse.body.price).toEqual(newBody.price);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const body = { price: 20, title: "Yada" };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(body)
    .expect(201);

  const newBody = { title: "new title", price: 30 };

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send(newBody)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
