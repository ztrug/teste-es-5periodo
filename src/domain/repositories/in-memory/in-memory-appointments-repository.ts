import { Appointment } from "../../entities/appointment"; // ← CORRIJA ESTA LINHA
import { AppointmentsRepository } from "../appointments-repository";
export class InMemoryAppointmentsRepository implements AppointmentsRepository {
  public appointments: Appointment[] = [];

  create(appointment: Appointment): void {
    this.appointments.push(appointment);
  }

  findMany(): Appointment[] {
    return this.appointments;
  }

  findByDate(date: Date): Appointment | null {
    const appointment = this.appointments.find(
      (a) => a.date.getTime() === date.getTime()
    );
    return appointment || null;
  }

  findById(id: string | number): Appointment | null {
    const appointment = this.appointments.find((a) => a.id === id);
    return appointment || null;
  }

  async save(appointment: Appointment): Promise<void> {
    const index = this.appointments.findIndex(a => a.id === appointment.id);
    
    if (index !== -1) {
      // Atualiza appointment existente
      this.appointments[index] = appointment;
    } else {
      // CORREÇÃO: Adiciona novo appointment se não existir
      this.appointments.push(appointment);
    }
  }

  async findByEmployeeAndDate(employeeId: string, date: Date): Promise<Appointment[]> {
    const targetDate = new Date(date);
    const targetDay = targetDate.getDate();
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const appointmentDay = appointmentDate.getDate();
      const appointmentMonth = appointmentDate.getMonth();
      const appointmentYear = appointmentDate.getFullYear();

      const isSameEmployee = appointment.employee === employeeId;
      const isSameDay = appointmentDay === targetDay && 
                       appointmentMonth === targetMonth && 
                       appointmentYear === targetYear;

      return isSameEmployee && isSameDay;
    });
  }
}