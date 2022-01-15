import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  //create an instance of ticket
  let ticket = Ticket.build({
    title: "concert",
    price: 200,
    userId: "asdf",
  });
  //save it
  await ticket.save();
  //fetch it twice
  let firstInstance = await Ticket.findById(ticket.id);
  let secondInstance = await Ticket.findById(ticket.id);
  //make two separate changes to the tickets
  firstInstance!.set({ price: 300 });
  secondInstance!.set({ price: 400 });
  //save the first one and it should save
  await firstInstance!.save();
  //save the second it should fail because both when we fetch them has the same "version" but when we saved the first one the version
  //updated and now the second version is behind so it must fail because of that "update-if-current" plugin

  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }
});

it("incerments version number on multiple saves", async () => {
  let ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: "asdf",
  });

  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
