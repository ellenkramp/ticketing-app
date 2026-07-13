import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@ekramp/common";
import { EventMessage as Message } from "@ekramp/common";
import { expirationQueue } from "../../../queues/expiration-queue";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: "507f1f77bcf86cd799439011",
    version: 0,
    status: OrderStatus.Created,
    userId: "user123",
    expiresAt: new Date(Date.now() + 15 * 1000).toISOString(),
    ticket: {
      id: "507f1f77bcf86cd799439012",
      price: 20,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("enqueues an expiration job with a delay", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(expirationQueue.add).toHaveBeenCalledWith(
    { orderId: data.id },
    expect.objectContaining({ delay: expect.any(Number) })
  );
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
