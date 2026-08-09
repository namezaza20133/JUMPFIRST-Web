import { describe, expect, it } from "vitest";
import {
  validateContactPayload,
  validateLoginPayload,
  validateRecoveryPayload,
  validateResetPasswordPayload,
  validateRegisterPayload,
  validateSocialLoginPayload,
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

  it("does not enforce minimum length on login password", () => {
    expect(
      validateLoginPayload({
        identifier: "user@example.com",
        password: "12345",
      })
    ).toBeUndefined();
  });

  it("returns undefined for valid payload", () => {
    expect(
      validateLoginPayload({
        identifier: "user@example.com",
        password: "123456",
      })
    ).toBeUndefined();
  });

  it("returns identifier format error for invalid login id", () => {
    expect(
      validateLoginPayload({
        identifier: "not-valid-id",
        password: "123456",
      })
    ).toEqual({
      identifier: "common.validationFields.identifier.format",
    });
  });
});

describe("validateRecoveryPayload", () => {
  it("returns required error for empty identifier", () => {
    expect(
      validateRecoveryPayload({
        identifier: "",
      })
    ).toEqual({
      identifier: "common.validationFields.identifier.required",
    });
  });

  it("returns format error for invalid identifier", () => {
    expect(
      validateRecoveryPayload({
        identifier: "invalid",
      })
    ).toEqual({
      identifier: "common.validationFields.identifier.format",
    });
  });

  it("returns undefined for valid email or phone identifier", () => {
    expect(
      validateRecoveryPayload({
        identifier: "user@example.com",
      })
    ).toBeUndefined();

    expect(
      validateRecoveryPayload({
        identifier: "+66 8123 4567",
      })
    ).toBeUndefined();
  });
});

describe("validateSocialLoginPayload", () => {
  it("returns required error for missing provider", () => {
    expect(
      validateSocialLoginPayload({
        provider: "" as "google",
      })
    ).toEqual({
      provider: "common.validationFields.provider.required",
    });
  });

  it("returns unsupported error for invalid provider", () => {
    expect(
      validateSocialLoginPayload({
        provider: "line-messaging" as "google",
      })
    ).toEqual({
      provider: "common.validationFields.provider.unsupported",
    });
  });

  it("returns undefined for supported provider", () => {
    expect(
      validateSocialLoginPayload({
        provider: "google",
      })
    ).toBeUndefined();
  });
});

describe("validateResetPasswordPayload", () => {
  it("returns required errors for empty values", () => {
    expect(
      validateResetPasswordPayload({
        token: "",
        otpCode: "",
        password: "",
      })
    ).toEqual({
      token: "common.validationFields.token.required",
      otpCode: "common.validationFields.otpCode.required",
      password: "common.validationFields.password.required",
    });
  });

  it("returns min-length error for short password", () => {
    expect(
      validateResetPasswordPayload({
        token: "token-value",
        otpCode: "123456",
        password: "short",
      })
    ).toEqual({
      password: "common.validationFields.password.min8",
    });
  });

  it("returns format error for invalid otp", () => {
    expect(
      validateResetPasswordPayload({
        token: "token-value",
        otpCode: "12a4",
        password: "newpassword123",
      })
    ).toEqual({
      otpCode: "common.validationFields.otpCode.format",
    });
  });

  it("returns undefined for valid reset payload", () => {
    expect(
      validateResetPasswordPayload({
        token: "token-value",
        otpCode: "123456",
        password: "newpassword123",
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
