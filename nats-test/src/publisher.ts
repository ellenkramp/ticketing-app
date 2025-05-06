import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();
const clientId = randomBytes(4).toString("hex");

const client = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Publisher connected to NATS");

  client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const publisher = new TicketCreatedPublisher(client);
  try {
    await publisher.publish({
      id: "2123",
      title: "concert",
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // client.publish("ticket:created", data, () => {
  //   console.log("EVENT PUBLISHED", data);
  // });
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
