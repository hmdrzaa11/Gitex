import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Order } from "../../../models/order";
import { OrderCancelledEvent, OrderStatus } from "@hamidtickets/common";
import { Message } from "node-nats-streaming";

let setup = async () => {
  let listener = new OrderCancelledListener(natsWrapper.client);
  let order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: "asdf",
    version: 0,
  });

  await order.save();

  let data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: order.version + 1,
    ticket: { id: "asdf" },
  };

  //@ts-ignore
  let msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updates the status of the order", async () => {
  let { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  let updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acks the message ", async () => {
  let { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
