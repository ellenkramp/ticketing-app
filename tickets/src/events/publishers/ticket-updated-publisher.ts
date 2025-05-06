import { Publisher, Subjects, TicketUpdatedEvent } from "@ekramp/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
