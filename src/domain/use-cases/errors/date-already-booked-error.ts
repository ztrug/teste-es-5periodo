export class DateAlreadyBookedError extends Error {
  constructor() {
    super("This date is already booked"); // ← Esta deve ser a mensagem
    this.name = "DateAlreadyBookedError";
  }
}