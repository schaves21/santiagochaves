export default class TicketDTO {
  constructor(ticket) {
    this.id = ticket.id;
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.total;
    this.purchaser = ticket.purchaser;
    this.products = ticket.products;
  }
}
