import { describe, expect, it } from "vitest";
import {
  validateContactPayload,
  validateLoginPayload,
  validateRegisterPayload,
} from "./forms";

describe("validateLoginPayload", () => {
  it("returns errors for missing values", () => {
    expect(
      validateLoginPayload({
        identifier: "",
        password: "",
      })
    ).toEqual({
      identifier: "common.validationFields.identifier.required",
      password: "common.validationFields.password.required",
    });
  });

  it("returns password length error for short password", () => {
    expect(
      validateLoginPayload({
        identifier: "user@example.com",
        password: "12345",
      })
    ).toEqual({
      password: "common.validationFields.password.min6",
    });
  });

  it("returns undefined for valid payload", () => {
    expect(
      validateLoginPayload({
        identifier: "user@example.com",
        password: "123456",
      })
    ).toBeUndefined();
  });
});

describe("validateRegisterPayload", () => {
  it("returns all required field errors", () => {
    expect(
      validateRegisterPayload({
        fullName: "",
        phone: "",
        email: "",
        username: "",
        password: "",
      })
    ).toEqual({
      fullName: "common.validationFields.fullName.required",
      phone: "common.validationFields.phone.required",
      email: "common.validationFields.email.required",
      username: "common.validationFields.username.required",
      password: "common.validationFields.password.required",
    });
  });

  it("returns format and minimum-length errors", () => {
    expect(
      validateRegisterPayload({
        fullName: "A",
        phone: "123",
        email: "bad-email",
        username: "*invalid*",
        password: "1234567",
      })
    ).toEqual({
      fullName: "common.validationFields.fullName.min2",
      phone: "common.validationFields.phone.format",
      email: "common.validationFields.email.format",
      username: "common.validationFields.username.format",
      password: "common.validationFields.password.min8",
    });
  });

  it("returns undefined for valid payload", () => {
    expect(
      validateRegisterPayload({
        fullName: "Jane Doe",
        phone: "+66 8123 4567",
        email: "jane@example.com",
        username: "jane.doe",
        password: "password123",
      })
    ).toBeUndefined();
  });
});

describe("validateContactPayload", () => {
  it("returns required errors", () => {
    expect(
      validateContactPayload({
        name: "",
        email: "",
        message: "",
      })
    ).toEqual({
      name: "common.validationFields.name.required",
      email: "common.validationFields.email.required",
      message: "common.validationFields.message.required",
    });
  });

  it("returns format and minimum-length errors", () => {
    expect(
      validateContactPayload({
        name: "A",
        email: "invalid",
        message: "short",
      })
    ).toEqual({
      name: "common.validationFields.name.min2",
      email: "common.validationFields.email.format",
      message: "common.validationFields.message.min10",
    });
  });

  it("returns undefined for valid payload", () => {
    expect(
      validateContactPayload({
        name: "John",
        email: "john@example.com",
        message: "This is a valid message.",
      })
    ).toBeUndefined();
  });
});
