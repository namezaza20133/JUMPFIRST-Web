import { describe, expect, it } from "vitest";
import { POST as loginPost } from "./auth/login/route";
import { POST as logoutPost } from "./auth/logout/route";
import { POST as recoveryPost } from "./auth/recovery/route";
import { POST as resetPasswordPost } from "./auth/reset-password/route";
import { POST as registerPost } from "./auth/register/route";
import { GET as sessionGet } from "./auth/session/route";
import { POST as socialPost } from "./auth/social/route";
import { POST as contactPost } from "./contact/route";
import { GET as coursesGet } from "./courses/route";
import { GET as memberMetricsGet } from "./member/metrics/route";
import { createRecoveryToken } from "@/lib/server/recovery";

function extractCookieValue(setCookieHeader: string | null, cookieName: string): string | undefined {
  if (!setCookieHeader) {
    return undefined;
  }

  const cookieToken = setCookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!cookieToken) {
    return undefined;
  }

  return cookieToken.slice(`${cookieName}=`.length);
}

describe("API route contracts", () => {
  it("POST /api/auth/login returns 422 envelope for invalid payload", async () => {
    const response = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: "", password: "" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchInlineSnapshot(`
      {
        "error": {
          "code": "validation",
          "fieldErrors": {
            "identifier": "common.validationFields.identifier.required",
            "password": "common.validationFields.password.required",
          },
          "message": "common.errors.validation",
        },
        "success": false,
      }
    `);
  });

  it("POST /api/auth/login returns 422 envelope for invalid credentials", async () => {
    const response = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: "namezazav5@gmail.com", password: "wrong" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchObject({
      success: false,
      error: {
        code: "validation",
        fieldErrors: {
          password: "common.validationFields.password.invalidCredentials",
        },
      },
    });
  });

  it("POST /api/auth/login returns 200 success envelope for seeded sample account", async () => {
    const response = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: "namezazav5@gmail.com", password: "admin" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
  });

  it("GET /api/auth/session returns authenticated true after successful login", async () => {
    const loginResponse = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: "namezazav5@gmail.com", password: "admin" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const sessionCookie = extractCookieValue(loginResponse.headers.get("set-cookie"), "jumpfirst_session");

    expect(sessionCookie).toBeTruthy();

    const sessionResponse = await sessionGet(
      new Request("http://localhost/api/auth/session", {
        method: "GET",
        headers: {
          cookie: `jumpfirst_session=${sessionCookie}`,
        },
      })
    );

    const payload = await sessionResponse.json();

    expect(sessionResponse.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        authenticated: true,
        user: {
          username: "admin",
          email: "namezazav5@gmail.com",
          provider: "password",
        },
      },
    });
  });

  it("POST /api/auth/login returns identifier format error", async () => {
    const response = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: "not-valid-id", password: "123456" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchObject({
      success: false,
      error: {
        code: "validation",
        fieldErrors: {
          identifier: "common.validationFields.identifier.format",
        },
      },
    });
  });

  it("POST /api/auth/recovery returns 422 envelope for invalid payload", async () => {
    const response = await recoveryPost(
      new Request("http://localhost/api/auth/recovery", {
        method: "POST",
        body: JSON.stringify({ identifier: "invalid" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchObject({
      success: false,
      error: {
        code: "validation",
        fieldErrors: {
          identifier: "common.validationFields.identifier.format",
        },
      },
    });
  });

  it("POST /api/auth/recovery returns 200 success envelope for valid payload", async () => {
    const response = await recoveryPost(
      new Request("http://localhost/api/auth/recovery", {
        method: "POST",
        body: JSON.stringify({ identifier: "jane@example.com" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
  });

  it("POST /api/auth/reset-password returns 422 envelope for invalid token", async () => {
    const response = await resetPasswordPost(
      new Request("http://localhost/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: "bad-token", otpCode: "123456", password: "newpassword123" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchObject({
      success: false,
      error: {
        code: "validation",
        fieldErrors: {
          token: "common.validationFields.token.invalid",
        },
      },
    });
  });

  it("POST /api/auth/reset-password returns 422 envelope for invalid otp", async () => {
    const token = await createRecoveryToken("namezazav5@gmail.com", "123456");

    const response = await resetPasswordPost(
      new Request("http://localhost/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, otpCode: "999999", password: "newpassword123" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchObject({
      success: false,
      error: {
        code: "validation",
        fieldErrors: {
          otpCode: "common.validationFields.otpCode.invalid",
        },
      },
    });
  });

  it("POST /api/auth/reset-password returns 200 success envelope for valid payload", async () => {
    const token = await createRecoveryToken("namezazav5@gmail.com", "123456");

    const response = await resetPasswordPost(
      new Request("http://localhost/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, otpCode: "123456", password: "newpassword123" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
  });

  it("POST /api/auth/logout returns 200 success envelope", async () => {
    const response = await logoutPost();
    const payload = await response.json();
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
    expect(setCookie).toContain("jumpfirst_session=");
    expect(setCookie).toContain("Max-Age=0");
  });

  it("POST /api/auth/social returns 422 envelope for invalid provider", async () => {
    const response = await socialPost(
      new Request("http://localhost/api/auth/social", {
        method: "POST",
        body: JSON.stringify({ provider: "line-messaging" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchObject({
      success: false,
      error: {
        code: "validation",
        fieldErrors: {
          provider: "common.validationFields.provider.unsupported",
        },
      },
    });
  });

  it("POST /api/auth/social returns 200 success envelope for valid provider", async () => {
    const response = await socialPost(
      new Request("http://localhost/api/auth/social", {
        method: "POST",
        body: JSON.stringify({ provider: "google" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
  });

  it("POST /api/auth/social returns 200 success envelope for facebook provider", async () => {
    const response = await socialPost(
      new Request("http://localhost/api/auth/social", {
        method: "POST",
        body: JSON.stringify({ provider: "facebook" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
  });

  it("POST /api/auth/social returns 200 success envelope for apple provider", async () => {
    const response = await socialPost(
      new Request("http://localhost/api/auth/social", {
        method: "POST",
        body: JSON.stringify({ provider: "apple" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
  });

  it("POST /api/auth/social returns 200 success envelope for line provider", async () => {
    const response = await socialPost(
      new Request("http://localhost/api/auth/social", {
        method: "POST",
        body: JSON.stringify({ provider: "line" }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
  });

  it("POST /api/auth/register returns 422 envelope for invalid payload", async () => {
    const response = await registerPost(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: "A",
          phone: "123",
          email: "invalid",
          username: "*invalid*",
          password: "1234567",
        }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchInlineSnapshot(`
      {
        "error": {
          "code": "validation",
          "fieldErrors": {
            "email": "common.validationFields.email.format",
            "fullName": "common.validationFields.fullName.min2",
            "password": "common.validationFields.password.min8",
            "phone": "common.validationFields.phone.format",
            "username": "common.validationFields.username.format",
          },
          "message": "common.errors.validation",
        },
        "success": false,
      }
    `);
  });

  it("POST /api/auth/register returns 200 success envelope for valid payload", async () => {
    const response = await registerPost(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: "Jane Doe",
          phone: "+66 8123 4567",
          email: "jane@example.com",
          username: "jane.doe",
          password: "password123",
        }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      success: true,
      data: {
        success: true,
      },
    });
  });

  it("POST /api/contact returns 422 envelope for invalid payload", async () => {
    const response = await contactPost(
      new Request("http://localhost/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: "A",
          email: "invalid",
          message: "short",
        }),
        headers: { "Content-Type": "application/json" },
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(422);
    expect(payload).toMatchInlineSnapshot(`
      {
        "error": {
          "code": "validation",
          "fieldErrors": {
            "email": "common.validationFields.email.format",
            "message": "common.validationFields.message.min10",
            "name": "common.validationFields.name.min2",
          },
          "message": "common.errors.validation",
        },
        "success": false,
      }
    `);
  });

  it("GET /api/courses returns success envelope with list", async () => {
    const response = await coursesGet();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(Array.isArray(payload.data)).toBe(true);
    expect(payload.data.length).toBeGreaterThan(0);
  });

  it("GET /api/member/metrics returns success envelope with list", async () => {
    const response = await memberMetricsGet();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(Array.isArray(payload.data)).toBe(true);
    expect(payload.data.length).toBeGreaterThan(0);
  });
});
