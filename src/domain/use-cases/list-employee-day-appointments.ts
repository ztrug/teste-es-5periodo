import { Appointment } from "../entities/appointment";

export interface ListEmployeeDayAppointmentsRequest {
  employeeId: string;
  date: Date;
}

export interface ListEmployeeDayAppointmentsResponse {
  appointments: Appointment[];
}

export interface AppointmentsRepository {
  findByEmployeeAndDate(employeeId: string, date: Date): Promise<Appointment[]>;
  // ... outros métodos
}

export class ListEmployeeDayAppointmentsUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute({
    employeeId,
    date,
  }: ListEmployeeDayAppointmentsRequest): Promise<ListEmployeeDayAppointmentsResponse> {
    const appointments = await this.appointmentsRepository.findByEmployeeAndDate(
      employeeId,
      date
    );

    return { appointments };
  }
}