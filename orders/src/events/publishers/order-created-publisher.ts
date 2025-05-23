import { Publisher, OrderCreatedEvent, Subjects } from "@ekramp/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
