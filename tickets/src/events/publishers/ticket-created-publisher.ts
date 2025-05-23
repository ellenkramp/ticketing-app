import { Publisher, Subjects, TicketCreatedEvent } from "@ekramp/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
