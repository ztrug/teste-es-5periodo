import { expect, test, beforeEach } from "vitest";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { CreateAppointmentUseCase } from "./create-appointment";
import { PastDateSchedulingError } from "./errors/past-date-scheduling-error";
import { ConflictingScheduleError } from "./errors/conflicting-schedule-error";

let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;
let createAppointmentUseCase: CreateAppointmentUseCase;

beforeEach(() => {
  inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
  createAppointmentUseCase = new CreateAppointmentUseCase(
    inMemoryAppointmentsRepository
  );
});


test("Deve ser possível realizar um agendamento", () => {
  createAppointmentUseCase.execute({
    client: "Augusto César",
    date: new Date(2025, 9, 20),
    employee: "Maria José",
    service: "Corte de Cabelo",
  });

  const appointment = inMemoryAppointmentsRepository.appointments[0];
  expect(appointment.client).toBe("Augusto César");
});

test("Não deve ser possível realizar um agendamento em uma data passada", () => {
  expect(() =>
    createAppointmentUseCase.execute({
      client: "Augusto César",
      date: new Date(2020, 7, 20),
      employee: "Maria José",
      service: "Corte de Cabelo",
    })
  ).toThrow(PastDateSchedulingError);
});


test("Não deve ser possível realizar dois agendamentos na mesma data", () => {
  const date = new Date(2025, 9, 20);

  createAppointmentUseCase.execute({
    client: "Cliente 1",
    date,
    employee: "Maria José",
    service: "Corte de Cabelo",
  });

  expect(() =>
    createAppointmentUseCase.execute({
      client: "Cliente 2",
      date,
      employee: "João Silva",
      service: "Manicure",
    })
  ).toThrow(ConflictingScheduleError);
});