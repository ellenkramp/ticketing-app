import { Listener, OrderCreatedEvent, Subjects } from "@ekramp/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  onMessage = async (data: OrderCreatedEvent["data"], msg: Message) => {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} milliseconds to process job`);
    await expirationQueue.add({ orderId: data.id }, { delay });
    msg.ack();
  };
}
