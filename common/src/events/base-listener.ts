import {
  JetStreamClient,
  consumerOpts,
  createInbox,
  StringCodec,
  JsMsg,
} from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export interface EventMessage {
  ack(): void;
  nak(delayMs?: number): void;
  getData(): string | Buffer;
}

const sc = StringCodec();

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage: (
    data: T["data"],
    msg: EventMessage
  ) => void | Promise<void>;
  protected client: JetStreamClient;
  protected ackWait = 30 * 1000;
  protected maxDeliver = 10;
  protected maxRetryDelay = 30 * 1000;

  constructor(client: JetStreamClient) {
    this.client = client;
  }

  // One durable consumer per (service, subject). A consumer has a single
  // filter subject, so listeners in the same service cannot share one.
  get durableName() {
    return `${this.queueGroupName}-${this.subject.replace(
      /[^A-Za-z0-9_-]/g,
      "-"
    )}`;
  }

  // Exponential backoff: 1s, 2s, 4s ... capped at maxRetryDelay.
  retryDelay(deliveryCount: number) {
    return Math.min(1000 * 2 ** (deliveryCount - 1), this.maxRetryDelay);
  }

  subscriptionOptions() {
    const opts = consumerOpts();
    opts.durable(this.durableName);
    opts.maxDeliver(this.maxDeliver);
    opts.manualAck();
    opts.ackExplicit();
    opts.ackWait(this.ackWait);
    opts.deliverTo(createInbox());
    opts.deliverAll();
    opts.queue(this.queueGroupName);
    return opts;
  }

  listen() {
    (async () => {
      const sub = await this.client.subscribe(
        this.subject,
        this.subscriptionOptions()
      );

      for await (const m of sub) {
        console.log(
          `Message received: ${this.subject} / ${this.queueGroupName}`
        );
        const msg = this.wrapMessage(m);
        try {
          await this.onMessage(this.parseMessage(msg), msg);
        } catch (err) {
          console.error(
            `Error processing ${this.subject} / ${this.queueGroupName}`,
            err
          );
          const attempt = m.info.deliveryCount;
          if (attempt >= this.maxDeliver) {
            console.error(
              `Giving up on ${this.subject} / ${this.queueGroupName} after ${attempt} attempts (stream seq ${m.seq})`
            );
            m.term();
          } else {
            msg.nak(this.retryDelay(attempt));
          }
        }
      }
    })().catch((err) => {
      console.error(`Listener failed for ${this.subject}`, err);
    });
  }

  wrapMessage(m: JsMsg): EventMessage {
    return {
      ack: () => m.ack(),
      nak: (delayMs?: number) => m.nak(delayMs),
      getData: () => sc.decode(m.data),
    };
  }

  parseMessage(msg: EventMessage) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
