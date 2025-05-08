import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { OrderCanceledEvent } from "@ekramp/common";
import mongoose from "mongoose";
import { OrderCanceledListener } from "../order-canceled-listener";

const setup = async () => {
  // create instance of the listener
  const listener = new OrderCanceledListener(natsWrapper.client);
  // create and save ticket
  const ticket = Ticket.build({
    title: "Hola",
    price: 50,
    userId: "faf67",
  });

  const orderId = new mongoose.Types.ObjectId().toHexString();
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCanceledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, ticket, orderId, listener };
};

it("updates the ticket, publishes and event and acks the message", async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
