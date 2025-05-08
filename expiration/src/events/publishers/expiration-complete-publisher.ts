import { Publisher, Subjects, ExpirationCompleteEvent } from "@ekramp/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
