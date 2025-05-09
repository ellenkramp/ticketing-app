import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
  NotFoundError,
} from "@ekramp/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCanceledPublisher } from "../publishers/order-canceled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  onMessage = async (data: ExpirationCompleteEvent["data"], msg: Message) => {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Canceled });

    await order.save();

    await new OrderCanceledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id },
    });

    msg.ack();
  };
}
