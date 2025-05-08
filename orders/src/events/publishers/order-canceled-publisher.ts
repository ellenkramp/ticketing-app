import { Publisher, Subjects, OrderCanceledEvent } from "@ekramp/common";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  readonly subject = Subjects.OrderCanceled;
}
