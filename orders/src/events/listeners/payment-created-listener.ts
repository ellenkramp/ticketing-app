import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  OrderStatus,
  EventMessage as Message,
} from "@ekramp/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  onMessage = async (data: PaymentCreatedEvent["data"], msg: Message) => {
    const order = await Order.findById(data.orderId);

    if (!order) {
      // Ack missing orders to avoid poison-message redelivery loops
      msg.ack();
      return;
    }

    order.set({ status: OrderStatus.Complete });

    await order.save();
    msg.ack();
  };
}
