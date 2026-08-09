# JUMPFIRST Next App

This app uses App Router with a service adapter architecture that can switch between mock data and API endpoints.

## Commands

~~~bash
npm run dev
npm run lint
npm run build
npm run test
npm run test:coverage
~~~

## Seeded Test Account

The app includes an in-memory seeded account for local testing:

- fullName: ADMIN
- username: admin
- email: namezazav5@gmail.com
- phone: 0829168692
- password: admin

Use email or phone for login and recovery forms.

## Service Adapter Mode

Set the adapter mode with environment variable:

~~~env
NEXT_PUBLIC_SERVICE_ADAPTER=mock
~~~

Supported values:

- mock (default): uses local mock adapters
- api: uses HTTP adapters that call /api/* routes

Adapter resolution entrypoint:

- src/lib/services/adapterFactory.ts

## API Endpoints

When NEXT_PUBLIC_SERVICE_ADAPTER=api, the app calls these endpoints:

- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session
- POST /api/auth/social
- GET /api/auth/social/callback/:provider
- POST /api/auth/recovery
- POST /api/auth/reset-password
- POST /api/auth/register
- POST /api/contact
- GET /api/courses
- GET /api/member/metrics

Protected page route:

- /member-dashboard (guarded by middleware.ts, requires valid jumpfirst_session cookie)

## Auth Environment Variables

For password and social auth session cookies:

~~~env
AUTH_BASE_URL=http://localhost:3000
AUTH_SESSION_SECRET=replace_with_at_least_32_characters
~~~

For Google OAuth:

~~~env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
~~~

For Facebook OAuth:

~~~env
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
~~~

For Apple OAuth (APPLE_CLIENT_SECRET is the generated JWT client secret):

~~~env
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...
~~~

## Recovery Delivery Environment Variables

Recovery API can deliver reset data through SMTP email or SMS gateway:

~~~env
RECOVERY_TOKEN_SECRET=replace_with_at_least_32_characters

SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=0
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=no-reply@your-domain.com

SMS_API_URL=https://your-sms-gateway.example/send
SMS_API_KEY=...
SMS_SENDER=JUMPFIRST
~~~

## API Contract

All API routes return a shared envelope type:

~~~ts
type ApiResponse<T> =
	| { success: true; data: T }
	| {
			success: false;
			error: {
				code: "network" | "validation" | "not-found" | "server" | "unknown";
				message: string;
				// message keys such as common.validationFields.email.format
				fieldErrors?: Record<string, string>;
			};
		};
~~~

### Success Example

~~~json
{
	"success": true,
	"data": {
		"success": true,
		"message": "Registration successful"
	}
}
~~~

### Validation Error Example

~~~json
{
	"success": false,
	"error": {
		"code": "validation",
		"message": "common.errors.validation",
		"fieldErrors": {
			"email": "common.validationFields.email.format",
			"password": "common.validationFields.password.min8"
		}
	}
}
~~~

## Form Error Handling

Form pages now support:

- top-level status message for success/failure
- field-level error rendering under each input
- fallback to translated generic errors when field-specific errors are absent

Main implementation files:

- src/lib/services/errors.ts
- src/lib/services/apiAdapters.ts
- src/components/forms/AuthForm.tsx
- src/components/forms/ContactForm.tsx
- src/components/forms/FormField.tsx
- src/components/forms/TextAreaField.tsx

## Validation Module

Form validation rules are centralized at:

- src/lib/validation/forms.ts

Used by API routes:

- src/app/api/auth/login/route.ts
- src/app/api/auth/register/route.ts
- src/app/api/contact/route.ts

## Tests

Validation unit tests live at:

- src/lib/validation/forms.test.ts
- src/app/api/routes.integration.test.ts

Run once:

~~~bash
npm run test
~~~

Run in watch mode:

~~~bash
npm run test:watch
~~~

Run with coverage:

~~~bash
npm run test:coverage
~~~

## CI

GitHub Actions workflow file:

- ../.github/workflows/ci.yml

Pipeline order:

1. npm ci
2. npm run test:coverage
3. npm run lint
4. npm run build
