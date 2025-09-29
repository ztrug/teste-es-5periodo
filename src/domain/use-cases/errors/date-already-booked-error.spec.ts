import { describe, it, expect } from "vitest";
import { DateAlreadyBookedError } from "./date-already-booked-error";

describe("DateAlreadyBookedError", () => {
  it("should create error with correct message", () => {
    const error = new DateAlreadyBookedError();
    expect(error.message).toBe("This date is already booked");
  });

  it("should be an instance of Error", () => {
    const error = new DateAlreadyBookedError();
    expect(error).toBeInstanceOf(Error);
  });
});