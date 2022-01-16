import { Listener, OrderCreatedEvent, Subjects } from "@hamidtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

import { Ticket } from "../../models/ticket";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    //find the ticket that order reserving
    let {
      ticket: { id },
    } = data;
    let ticket = await Ticket.findById(id);
    //if no ticket throw error
    if (!ticket) throw new Error("ticket not found");
    //mark the ticket as reserved by setting its orderId
    ticket.set({ orderId: data.id });
    //save the ticket
    await ticket.save();

    //publish an event when
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    //ack the message
    msg.ack();
  }
}
