import {
  connect,
  NatsConnection,
  JetStreamClient,
  JetStreamManager,
} from "nats";
import { Subjects } from "./subjects";

const STREAM_SUBJECTS: string[] = Object.values(Subjects);

const normalizeUrl = (url: string) =>
  url.replace(/^http:\/\//, "nats://").replace(/^https:\/\//, "tls://");

const isNotFound = (err: unknown) =>
  (err as { code?: string } | undefined)?.code === "404";

export class NatsWrapper {
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

    this._nc.closed().then(() => {
      console.log("NATS CONNECTION CLOSED");
      process.exit();
    });

    this._jsm = await this._nc.jetstreamManager();
    await this.ensureStream(this._jsm, streamName);

    this._client = this._nc.jetstream();
    console.log("Connected to NATS JetStream");
  }

  // Creates the stream if it is missing, and binds any subjects added to
  // `Subjects` since the stream was first created.
  private async ensureStream(jsm: JetStreamManager, streamName: string) {
    let existing: string[];
    try {
      const info = await jsm.streams.info(streamName);
      existing = info.config.subjects ?? [];
    } catch (err) {
      if (!isNotFound(err)) {
        throw err;
      }
      await jsm.streams.add({ name: streamName, subjects: STREAM_SUBJECTS });
      return;
    }

    const missing = STREAM_SUBJECTS.filter((s) => !existing.includes(s));
    if (missing.length > 0) {
      await jsm.streams.update(streamName, {
        subjects: [...existing, ...missing],
      });
    }
  }

  close() {
    return this._nc?.drain();
  }
}
