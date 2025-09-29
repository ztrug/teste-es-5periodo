import { Appointment } from "../entities/appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";

export class AppointmentNotFoundError extends Error {
  constructor() {
    super("Appointment not found");
  }
}

export class AppointmentDateUnavailableError extends Error {
  constructor() {
    super("Appointment date is already occupied");
  }
}

interface EditAppointmentRequest {
  appointmentId: string;
  newDate: Date;
}

export class EditAppointmentUseCase {
  constructor(private appointmentsRepository: InMemoryAppointmentsRepository) {}

  async execute({ appointmentId, newDate }: EditAppointmentRequest) {
    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    const dateConflict = await this.appointmentsRepository.findByDate(newDate);
    if (dateConflict && dateConflict.id !== appointmentId) {
      throw new AppointmentDateUnavailableError();
    }

    appointment.date = newDate;
    await this.appointmentsRepository.save(appointment);

    return appointment;
  }
}
