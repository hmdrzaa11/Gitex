import { Listener, OrderCreatedEvent, Subjects } from "@hamidtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    let order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userdId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
