import { TicketCreatedEvent } from "@hamidtickets/common";
import mongoose from "mongoose";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

let setup = () => {
  //create an instance of the listener
  let listener = new TicketCreatedListener(natsWrapper.client);
  //create a fake "data" object
  let data: TicketCreatedEvent["data"] = {
    version: 0,
    id: mongoose.Types.ObjectId(),
    title: "concert",
    price: 10,
    userId: mongoose.Types.ObjectId(),
  };
  //create a fake "msg" object
  //@ts-ignore
  let msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  let { listener, data, msg } = setup();
  //call the "onMessage" fn with the data + msg object
  await listener.onMessage(data, msg);
  //write assertion to make sure ticket is saved
  let ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  let { listener, data, msg } = setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
