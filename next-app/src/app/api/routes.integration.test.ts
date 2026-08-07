import { describe, expect, it } from "vitest";
import { POST as loginPost } from "./auth/login/route";
import { POST as registerPost } from "./auth/register/route";
import { POST as contactPost } from "./contact/route";
import { GET as coursesGet } from "./courses/route";
import { GET as memberMetricsGet } from "./member/metrics/route";

describe("API route contracts", () => {
  it("POST /api/auth/login returns 422 envelope for invalid payload", async () => {
    const response = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: "", password: "123" }),
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
            "password": "common.validationFields.password.min6",
          },
          "message": "common.errors.validation",
        },
        "success": false,
      }
    `);
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
