import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@ekramp/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  onMessage = async (data: TicketCreatedEvent["data"], msg: Message) => {
    const { title, price, id } = data;

    const ticket = Ticket.build({
      title,
      price,
      id,
    });

    await ticket.save();

    msg.ack();
  };
}
