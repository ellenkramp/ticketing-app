import { OrderCreatedEvent, Listener, Subjects } from "@ekramp/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: OrderCreatedEvent["data"], msg: Message) => {
    // find ticket
    const ticket = await Ticket.findById(data.ticket.id);
    // if not Ticket, err
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // reserve ticket
    ticket.set({ orderId: data.id });

    // save
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });

    // ack
    msg.ack();
  };
}
