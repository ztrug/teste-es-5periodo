export class ConflictingScheduleError extends Error {
  constructor() {
    super("Já existe um agendamento nessa data.");
  }
}
