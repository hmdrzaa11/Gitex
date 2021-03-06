import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  OrderStatus,
} from "@hamidtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    let delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add(
      { orderId: data.id },
      {
        delay: delay,
      }
    );
    msg.ack();
  }
}
