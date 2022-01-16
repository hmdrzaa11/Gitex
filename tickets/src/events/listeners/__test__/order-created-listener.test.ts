import mongoose from "mongoose";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus } from "@hamidtickets/common";
import { Message } from "node-nats-streaming";

let setup = async () => {
  //create an instance of the listener
  let listener = new OrderCreatedListener(natsWrapper.client);
  //create an save a ticket in DB
  let ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "asdf",
  });

  await ticket.save();

  //create the fake data object
  let data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "dsaf",
    expiresAt: "asdf",
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //create a fake msg
  //@ts-ignore
  let msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it("sets the orderId of ticket", async () => {
  let { data, msg, listener, ticket } = await setup();
  await listener.onMessage(data, msg);
  let updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  let { data, msg, listener, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  let { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  let argJSON = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];
  let ticketUpdatedData = JSON.parse(argJSON);
  expect(ticketUpdatedData.orderId).toEqual(data.id);
});
