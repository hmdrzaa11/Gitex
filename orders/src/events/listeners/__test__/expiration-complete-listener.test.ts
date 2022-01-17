import mongoose from "mongoose";
import { ExpirationCompleteEvent, OrderStatus } from "@hamidtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

let setup = async () => {
  let listener = new ExpirationCompleteListener(natsWrapper.client);
  let ticket = await Ticket.build({
    title: "concert",
    price: 120,
    id: mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  let order = Order.build({
    userId: "asdf",
    expiresAt: new Date(),
    status: OrderStatus.Created,
    ticket,
  });

  await order.save();

  let data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  let msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, ticket, order, listener };
};

it("updates the order status to cancelled", async () => {
  let { listener, msg, data } = await setup();
  await listener.onMessage(data, msg);
  let updatedOrder = await Order.findById(data.orderId);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
it("emits an orderCancelled event", async () => {
  let { listener, msg, data } = await setup();
  await listener.onMessage(data, msg);
  let eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(eventData.id).toEqual(data.orderId);
});
it("acks the message", async () => {
  let { listener, msg, data } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
