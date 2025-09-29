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
      editAppointmentUseCase.execute({ 
        appointmentId: "non-existent-id", 
        newDate: new Date() 
      })
    ).rejects.toBeInstanceOf(AppointmentNotFoundError);
  });

  it("should not be able to update an appointment to a date that is already occupied", async () => {
    const date = new Date(2025, 8, 30, 10);
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

    await expect(
      editAppointmentUseCase.execute({ 
        appointmentId: appointment2.id, 
        newDate: date 
      })
    ).rejects.toBeInstanceOf(AppointmentDateUnavailableError);
  });

  // TESTES CORRIGIDOS - o use case retorna o appointment diretamente
  it("should be able to update an appointment to an available date", async () => {
    const originalDate = new Date(2025, 8, 30, 10);
    const newDate = new Date(2025, 8, 30, 14);
    
    const appointment = new Appointment(
      "appointment-1",
      "service-1",
      "client-1",
      "employee-1",
      originalDate
    );

    await appointmentsRepository.save(appointment);

    const result = await editAppointmentUseCase.execute({
      appointmentId: appointment.id,
      newDate: newDate
    });

    // CORREÇÃO: result é o appointment, não result.appointment
    expect(result.date).toEqual(newDate);
    expect(result.id).toBe(appointment.id);
  });

  it("should be able to update an appointment to the same date", async () => {
    const date = new Date(2025, 8, 30, 10);
    
    const appointment = new Appointment(
      "appointment-1",
      "service-1",
      "client-1",
      "employee-1",
      date
    );

    await appointmentsRepository.save(appointment);

    const result = await editAppointmentUseCase.execute({
      appointmentId: appointment.id,
      newDate: date // Mesma data
    });

    // CORREÇÃO: result é o appointment
    expect(result.date).toEqual(date);
  });

  it("should handle case where appointment to check is the same being edited", async () => {
    const date = new Date(2025, 8, 30, 10);
    
    const appointment = new Appointment(
      "appointment-1", 
      "service-1",
      "client-1",
      "employee-1",
      date
    );

    await appointmentsRepository.save(appointment);

    const result = await editAppointmentUseCase.execute({
      appointmentId: appointment.id,
      newDate: date
    });

    // CORREÇÃO: result é o appointment
    expect(result.date).toEqual(date);
  });
});