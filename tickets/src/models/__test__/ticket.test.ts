import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "Cool",
    price: 50,
    userId: "123",
  });
  // save ticket
  await ticket.save();

  // fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the tickets we fetched

  firstInstance!.set({ price: 200 });
  secondInstance!.set({ price: 150 });

  // save first ticket

  await firstInstance!.save();

  // attempt to save second ticket
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("shouldnt");
});

it("increments version number on multiple saves", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "Cool New Ticket",
    price: 70,
    userId: "133",
  });
  // save ticket
  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
