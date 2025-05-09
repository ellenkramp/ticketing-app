import { Subjects, Publisher, PaymentCreatedEvent } from "@ekramp/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
