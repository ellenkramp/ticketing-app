import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("cancels an order", async () => {
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

  // cancel order

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it("emits an order canceled event", async () => {
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

  // cancel order

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
