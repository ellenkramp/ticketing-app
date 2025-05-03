import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns ticket if ticket is found", async () => {
  const body = { price: 20, title: "Yada" };
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body)
    .expect(201);

  console.log(response.body.id);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(body.title);
  expect(ticketResponse.body.price).toEqual(body.price);
});
