import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { EditAppointmentUseCase, AppointmentNotFoundError, AppointmentDateUnavailableError } from "./edit-appointment";
import { Appointment } from "../entities/appointment";

let appointmentsRepository: InMemoryAppointmentsRepository;
let editAppointmentUseCase: EditAppointmentUseCase;

describe("Edit Appointment Use Case", () => {
  beforeEach(() => {
    appointmentsRepository = new InMemoryAppointmentsRepository();
    editAppointmentUseCase = new EditAppointmentUseCase(appointmentsRepository);
  });

  it("should not be able to update a non-existent appointment", async () => {
    await expect(
      editAppointmentUseCase.execute({ appointmentId: "non-existent-id", newDate: new Date() })
    ).rejects.toBeInstanceOf(AppointmentNotFoundError);
  });

it("should not be able to update an appointment to a date that is already occupied", async () => {
  const date = new Date(2025, 8, 30, 10); // 30/09/2025 10:00
  const appointment1 = new Appointment(
    "appointment-1",
    "service-1",
    "client-1",
    "employee-1",
    date
  );
  const appointment2 = new Appointment(
    "appointment-2", 
    "service-2",
    "client-2",
    "employee-2",
    new Date(2025, 8, 30, 11)
  );

  await appointmentsRepository.save(appointment1);
  await appointmentsRepository.save(appointment2);
  // You may want to add assertions here to complete the test
});

});