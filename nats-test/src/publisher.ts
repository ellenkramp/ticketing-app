import nats from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();
const clientId = randomBytes(4).toString("hex");

const client = nats.connect("ticketing", clientId, {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Publisher connected to NATS");

  client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  client.publish("ticket:created", data, () => {
    console.log("EVENT PUBLISHED", data);
  });
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
