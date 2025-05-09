import {
  Listener,
  NotFoundError,
  OrderCanceledEvent,
  OrderStatus,
  Subjects,
} from "@ekramp/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCanceledListener extends Listener<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCanceledEvent["data"], msg: Message) => {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new NotFoundError();
    }

    order.set({ status: OrderStatus.Canceled });

    await order.save();

    msg.ack();
  };
}
