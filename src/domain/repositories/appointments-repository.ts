import { Appointment } from "../entities/appointment";

export interface AppointmentsRepository {
  findByDate(date: Date): unknown;
  create(appointment: Appointment): void;
  findMany(): Appointment[];
}
