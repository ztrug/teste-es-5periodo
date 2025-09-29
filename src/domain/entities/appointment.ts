export class Appointment {
  id: string;
  service: string;
  client: string;
  employee: string;
  date: Date;

  constructor(
    id: string,
    service: string,
    client: string,
    employee: string,
    date: Date
  ) {
    this.id = id;
    this.service = service;
    this.client = client;
    this.employee = employee;
    this.date = date;
  }
}
