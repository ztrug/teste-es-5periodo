import { Appointment } from "../entities/appointment";
import { AppointmentsRepository } from "../repositories/appointments-repository";
import { PastDateSchedulingError } from "./errors/past-date-scheduling-error";
import { ConflictingScheduleError } from "./errors/conflicting-schedule-error";

type CreateAppointmentUseCaseRequest = {
  service: string;
  client: string;
  employee: string;
  date: Date;
};

type CreateAppointmentUseCaseResponse = {
  appointment: Appointment;
};

export class CreateAppointmentUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  execute(
    request: CreateAppointmentUseCaseRequest
  ): CreateAppointmentUseCaseResponse {
    const dateNow = new Date();

    if (request.date < dateNow) {
      throw new PastDateSchedulingError();
    }

    // 🔎 Verifica se já existe agendamento no mesmo horário
    const existingAppointment =
      this.appointmentsRepository.findByDate(request.date);

    if (existingAppointment) {
      throw new ConflictingScheduleError();
    }

    const appointment = new Appointment(
      crypto.randomUUID(), // gera ID único
      request.service,
      request.client,
      request.employee,
      request.date
    );

    this.appointmentsRepository.create(appointment);

    return {
      appointment,
    };
  }
}
