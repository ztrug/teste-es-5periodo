import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { ListEmployeeDayAppointmentsUseCase } from "./list-employee-day-appointments";
import { Appointment } from "../entities/appointment";

let appointmentsRepository: InMemoryAppointmentsRepository;
let listEmployeeDayAppointmentsUseCase: ListEmployeeDayAppointmentsUseCase;

describe("List Employee Day Appointments Use Case", () => {
  beforeEach(() => {
    appointmentsRepository = new InMemoryAppointmentsRepository();
    listEmployeeDayAppointmentsUseCase = new ListEmployeeDayAppointmentsUseCase(
      appointmentsRepository
    );
  });

  it("should list only appointments from the requested employee, excluding other employees on the same day", async () => {
    const date = new Date(2025, 8, 30); // 30/09/2025
    
    // Criar agendamentos para diferentes funcionários no mesmo dia
    const appointment1 = new Appointment(
      "appointment-1",
      "service-1",
      "client-1",
      "employee-1", // Funcionário alvo
      new Date(2025, 8, 30, 10) // 30/09/2025 10:00
    );

    const appointment2 = new Appointment(
      "appointment-2",
      "service-2", 
      "client-2",
      "employee-2", // Outro funcionário
      new Date(2025, 8, 30, 11) // Mesmo dia
    );

    const appointment3 = new Appointment(
      "appointment-3",
      "service-3",
      "client-3", 
      "employee-1", // Mesmo funcionário
      new Date(2025, 8, 30, 14) // Mesmo dia
    );

    await appointmentsRepository.save(appointment1);
    await appointmentsRepository.save(appointment2);
    await appointmentsRepository.save(appointment3);

    const { appointments } = await listEmployeeDayAppointmentsUseCase.execute({
      employeeId: "employee-1",
      date,
    });

    // CORREÇÃO: Use 'employee' em vez de 'employeeId'
    expect(appointments).toHaveLength(2);
    expect(appointments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "appointment-1", employee: "employee-1" }),
        expect.objectContaining({ id: "appointment-3", employee: "employee-1" })
      ])
    );
    
    // CORREÇÃO: Use 'employee' em vez de 'employeeId'
    expect(appointments).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ employee: "employee-2" })
      ])
    );
  });

  it("should list only appointments from the requested day, excluding same employee appointments from other days", async () => {
    const targetDate = new Date(2025, 8, 30); // 30/09/2025
    
    // Criar agendamentos para o mesmo funcionário em dias diferentes
    const appointment1 = new Appointment(
      "appointment-1",
      "service-1",
      "client-1",
      "employee-1",
      new Date(2025, 8, 30, 10) // Dia alvo: 30/09/2025
    );

    const appointment2 = new Appointment(
      "appointment-2",
      "service-2",
      "client-2", 
      "employee-1", // Mesmo funcionário
      new Date(2025, 8, 29, 11) // Dia anterior: 29/09/2025
    );

    const appointment3 = new Appointment(
      "appointment-3",
      "service-3",
      "client-3",
      "employee-1", // Mesmo funcionário  
      new Date(2025, 9, 1, 14) // Dia seguinte: 01/10/2025
    );

    await appointmentsRepository.save(appointment1);
    await appointmentsRepository.save(appointment2);
    await appointmentsRepository.save(appointment3);

    // DEBUG: Verificar o que foi salvo
    console.log('=== DEBUG ===');
    console.log('Todos os appointments salvos:');
    appointmentsRepository.appointments.forEach(app => {
      console.log(`ID: ${app.id}, Employee: ${app.employee}, Date: ${app.date}`);
    });

    const { appointments } = await listEmployeeDayAppointmentsUseCase.execute({
      employeeId: "employee-1",
      date: targetDate,
    });

    console.log('Appointments encontrados:', appointments.length);
    appointments.forEach((app, index) => {
      console.log(`${index + 1}. ID: ${app.id}, Employee: ${app.employee}, Date: ${app.date}`);
    });
    console.log('=== FIM DEBUG ===');

    // CORREÇÃO: Use 'employee' em vez de 'employeeId'
    expect(appointments).toHaveLength(1);
    expect(appointments[0]).toEqual(
      expect.objectContaining({ 
        id: "appointment-1",
        employee: "employee-1", // ← CORRIGIDO
        date: new Date(2025, 8, 30, 10)
      })
    );
  });

  it("should return empty list when employee has no appointments on the requested day", async () => {
    const { appointments } = await listEmployeeDayAppointmentsUseCase.execute({
      employeeId: "non-existent-employee",
      date: new Date(2025, 8, 30),
    });

    expect(appointments).toHaveLength(0);
    expect(appointments).toEqual([]);
  });
});