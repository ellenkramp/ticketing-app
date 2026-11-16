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
  nak(): void;
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
  protected ackWait = 5 * 1000;

  constructor(client: JetStreamClient) {
    this.client = client;
  }

  subscriptionOptions() {
    const opts = consumerOpts();
    opts.durable(this.queueGroupName);
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
          msg.nak();
        }
      }
    })().catch((err) => {
      console.error(`Listener failed for ${this.subject}`, err);
    });
  }

  wrapMessage(m: JsMsg): EventMessage {
    return {
      ack: () => m.ack(),
      nak: () => m.nak(),
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
