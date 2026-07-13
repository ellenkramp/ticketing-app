import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
} from "nats";
import { Subjects } from "@ekramp/common";

const STREAM_SUBJECTS = Object.values(Subjects);

const normalizeUrl = (url: string) =>
  url.replace(/^http:\/\//, "nats://").replace(/^https:\/\//, "tls://");

class NatsWrapper {
  private _client?: JetStreamClient;
  private _jsm?: JetStreamManager;
  private _nc?: NatsConnection;
  private _streamName = "ticketing";

  get client() {
    if (!this._client) {
      throw new Error("cannot access nats client before connecting");
    }
    return this._client;
  }

  get jsm() {
    if (!this._jsm) {
      throw new Error("cannot access nats jetstream manager before connecting");
    }
    return this._jsm;
  }

  get streamName() {
    return this._streamName;
  }

  async connect(streamName: string, clientId: string, url: string) {
    this._streamName = streamName;
    this._nc = await connect({
      servers: normalizeUrl(url),
      name: clientId,
    });

    this._nc.closed.then(() => {
      console.log("NATS CONNECTION CLOSED");
      process.exit();
    });

    this._jsm = await this._nc.jetstreamManager();

    try {
      await this._jsm.streams.info(streamName);
    } catch {
      await this._jsm.streams.add({
        name: streamName,
        subjects: STREAM_SUBJECTS,
      });
    }

    this._client = this._nc.jetstream();
    console.log("Connected to NATS JetStream");
  }

  close() {
    return this._nc?.drain();
  }
}

export const natsWrapper = new NatsWrapper();
