import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

const createTicket = () => {
  const body = { price: 20, title: "Yada" };
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(body);
};

it("can fetch a list of tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toBe(3);
});
