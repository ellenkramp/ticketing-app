import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("fetches an order by Id for the correct user", async () => {
  // create ticket
  const ticket = Ticket.build({
    title: "My Ticket",
    price: 300,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  // build order with ticket

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // request Order

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error for an incorrect user", async () => {
  // create ticket
  const ticket = Ticket.build({
    title: "My Ticket",
    price: 300,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();
  // build order with ticket

  const user = global.signin();
  const user2 = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // request Order

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user2)
    .expect(401);
});
