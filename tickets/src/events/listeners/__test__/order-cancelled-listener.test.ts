import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
import { OrderCancelledEvent } from "@hamidtickets/common";
import { Message } from "node-nats-streaming";

let setup = async () => {
  let listener = new OrderCancelledListener(natsWrapper.client);
  let orderId = mongoose.Types.ObjectId().toHexString();
  let ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "asdf",
  });

  ticket.orderId = orderId;

  await ticket.save();

  let data: OrderCancelledEvent["data"] = {
    id: orderId,
    ticket: {
      id: ticket.id,
    },
    version: 0,
  };

  //@ts-ignore
  let msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, msg, data, orderId };
};

it("updates the ticket, publishes an event and acks the message", async () => {
  let { msg, data, ticket, orderId, listener } = await setup();
  await listener.onMessage(data, msg);

  let updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
