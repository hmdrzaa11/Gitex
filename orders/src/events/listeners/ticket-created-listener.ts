import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@hamidtickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    let { id, title, price } = data;
    let ticket = Ticket.build({
      title,
      price,
      id,
    });
    await ticket.save();

    //ack the message
    msg.ack();
  }
}
