import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@hamidtickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

let setup = async () => {
  //create a listener
  let listener = new TicketUpdatedListener(natsWrapper.client);
  //create and save a ticket to Ticket model directly
  let ticket = Ticket.build({
    id: mongoose.Types.ObjectId(),
    title: "concert",
    price: 20,
  });

  await ticket.save();
  //create a fake data object
  let data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "Eminem concert",
    price: 30,
    userId: "asdf",
  };
  //create a fake msg  obhect

  //@ts-ignore
  let msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg, ticket };
};

it("finds, updates and saves a ticket", async () => {
  let { msg, data, listener, ticket } = await setup();
  await listener.onMessage(data, msg);

  //refetch the ticket from DB and check for updates
  let updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  let { msg, data, listener, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version", async () => {
  let { msg, data, listener, ticket } = await setup();
  data.version = 20;
  try {
    await listener.onMessage(data, msg);
  } catch (error) {
    expect(msg.ack).not.toHaveBeenCalled();
    return;
  }
});
