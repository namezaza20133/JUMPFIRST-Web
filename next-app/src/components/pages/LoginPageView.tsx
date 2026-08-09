"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormField } from "@/components/forms/FormField";
import { loginFormSchema } from "@/lib/content/formSchemas";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { authService } from "@/lib/services/authService";
import {
  getFirstFieldErrorMessage,
  getServiceErrorMessageKey,
  getTranslatedFieldErrors,
} from "@/lib/services/errors";

export function LoginPageView() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const [statusTone, setStatusTone] = useState<"success" | "error" | undefined>(undefined);

  useEffect(() => {
    const socialError = searchParams.get("socialError");

    if (!socialError) {
      return;
    }

    const socialErrorMessageKey =
      socialError === "unsupported_provider"
        ? "login.socialErrorUnsupportedProvider"
        : socialError === "missing_oauth_params"
          ? "login.socialErrorMissingParams"
          : socialError === "invalid_oauth_state"
            ? "login.socialErrorInvalidState"
            : socialError === "oauth_exchange_failed"
              ? "login.socialErrorExchangeFailed"
              : "login.socialError";

    setStatusTone("error");
    setStatusMessage(t(socialErrorMessageKey));
  }, [searchParams, t]);

  const handleSocialLogin = async (provider: "google" | "line") => {
    setIsSubmitting(true);
    setFieldErrors(undefined);
    setStatusMessage(undefined);
    setStatusTone(undefined);

    try {
      const result = await authService.socialLogin({ provider });

      if (result.success) {
        if (result.redirectUrl) {
          window.location.assign(result.redirectUrl);
          return;
        }

        setStatusTone("success");
        setStatusMessage(result.message ?? t("login.socialSuccess"));
      } else {
        setStatusTone("error");
        setStatusMessage(result.message ?? t("login.socialError"));
      }
    } catch (error) {
      setStatusTone("error");
      setStatusMessage(t(getServiceErrorMessageKey(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setFieldErrors(undefined);
    setStatusMessage(undefined);
    setStatusTone(undefined);

    try {
      const result = await authService.login({
        identifier: String(formData.get("identifier") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      if (result.success) {
        setStatusTone("success");
        setFieldErrors(undefined);
        setStatusMessage(t("login.submitSuccess"));
        window.dispatchEvent(new Event("auth:changed"));
        router.refresh();
        router.push("/member-dashboard");
      } else {
        setStatusTone("error");
        setStatusMessage(t("login.submitError"));
      }
    } catch (error) {
      const translatedFieldErrors = getTranslatedFieldErrors(error, t);
      const fieldMessage = translatedFieldErrors
        ? Object.values(translatedFieldErrors)[0]
        : getFirstFieldErrorMessage(error);

      setStatusTone("error");
      setFieldErrors(translatedFieldErrors);
      setStatusMessage(fieldMessage ?? t(getServiceErrorMessageKey(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-main">
      <section className="section">
        <div className="container auth-center-wrap">
          <form
            className="auth-shell login-auth-card"
            aria-label={t("login.formTitle")}
            onSubmit={(event) => {
              event.preventDefault();
              if (isSubmitting) {
                return;
              }

              const formData = new FormData(event.currentTarget);
              void handleSubmit(formData);
            }}
          >
            <div className="login-partition partition-credentials">
              <h1 className="login-card-title">{t("login.formTitle")}</h1>
              {loginFormSchema.map((field) => (
                <FormField
                  key={`${field.name}-${field.type}-${field.placeholderKey}`}
                  name={field.name}
                  type={
                    field.name === "password"
                      ? isPasswordVisible
                        ? "text"
                        : "password"
                      : field.type === "textarea"
                        ? "text"
                        : field.type
                  }
                  placeholder={t(field.placeholderKey)}
                  required={field.required}
                  disabled={isSubmitting}
                  errorMessage={fieldErrors?.[field.name]}
                  endAction={
                    field.name === "password" ? (
                      <button
                        type="button"
                        className="input-action-btn"
                        aria-label={
                          isPasswordVisible ? t("login.hidePasswordAriaLabel") : t("login.showPasswordAriaLabel")
                        }
                        onClick={() => setIsPasswordVisible((current) => !current)}
                        disabled={isSubmitting}
                      >
                        {isPasswordVisible ? (
                          <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
                            <path
                              fill="currentColor"
                              d="M3.53 2.47 2.47 3.53 6 7.06C4.06 8.38 2.53 10.07 1.5 12c2.16 4.06 6 7 10.5 7 1.91 0 3.72-.53 5.27-1.46l3.2 3.19 1.06-1.06L3.53 2.47Zm8.47 4.03A5.5 5.5 0 0 1 17.5 12c0 .67-.12 1.3-.35 1.89l-3.56-3.56A2.48 2.48 0 0 0 12 9.5c-.3 0-.58.05-.85.15L8.6 7.1A5.4 5.4 0 0 1 12 6.5Zm-8.7 5.5a11.65 11.65 0 0 1 3.84-3.8l1.63 1.63A2.5 2.5 0 0 0 12 13.06l2.76 2.76c-.84.43-1.78.68-2.76.68-3.68 0-6.79-2.27-8.7-5.5Z"
                            />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
                            <path
                              fill="currentColor"
                              d="M12 5c4.5 0 8.34 2.94 10.5 7-2.16 4.06-6 7-10.5 7S3.66 16.06 1.5 12C3.66 7.94 7.5 5 12 5Zm0 2c-3.56 0-6.65 2.03-8.47 5 1.82 2.97 4.91 5 8.47 5s6.65-2.03 8.47-5c-1.82-2.97-4.91-5-8.47-5Zm0 2.5A2.5 2.5 0 1 1 12 14.5 2.5 2.5 0 0 1 12 9.5Z"
                            />
                          </svg>
                        )}
                      </button>
                    ) : undefined
                  }
                />
              ))}

              {statusMessage && statusTone ? <p className={`form-status ${statusTone}`}>{statusMessage}</p> : null}

              <button className="btn btn-primary auth-main-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("login.submitting") : t("login.submit")}
              </button>

              <Link className="auth-inline-link" href="/recovery">
                {t("login.forgetPassword")}
              </Link>
            </div>

            <div className="login-partition partition-alt-login" aria-label={t("login.altLoginTitle")}>
              <p className="partition-title">{t("login.altLoginTitle")}</p>
              <div className="alt-login-grid">
                <button
                  type="button"
                  className="btn btn-outline auth-alt-btn"
                  onClick={() => void handleSocialLogin("google")}
                  disabled={isSubmitting}
                >
                  <span className="social-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
                      <path
                        fill="currentColor"
                        d="M21.81 10.04h-9.78v3.95h5.62a4.82 4.82 0 0 1-2.09 3.17v2.63h3.39c1.99-1.83 3.14-4.54 3.14-7.75 0-.67-.06-1.33-.18-1.96Z"
                      />
                      <path
                        fill="currentColor"
                        d="M12.03 22c2.84 0 5.22-.94 6.96-2.56l-3.39-2.63c-.94.63-2.14 1-3.57 1-2.74 0-5.06-1.85-5.89-4.34H2.63v2.72A10.5 10.5 0 0 0 12.03 22Z"
                      />
                      <path
                        fill="currentColor"
                        d="M6.14 13.47a6.29 6.29 0 0 1 0-3.94V6.81H2.63a10.5 10.5 0 0 0 0 9.38l3.51-2.72Z"
                      />
                      <path
                        fill="currentColor"
                        d="M12.03 6.19c1.54 0 2.92.53 4.01 1.56l3.01-3.01A10.07 10.07 0 0 0 12.03 2a10.5 10.5 0 0 0-9.4 4.81l3.51 2.72c.83-2.49 3.15-4.34 5.89-4.34Z"
                      />
                    </svg>
                  </span>
                  {t("login.socialGoogle")}
                </button>
                <button
                  type="button"
                  className="btn btn-outline auth-alt-btn"
                  onClick={() => void handleSocialLogin("line")}
                  disabled={isSubmitting}
                >
                  <span className="social-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" role="img" aria-hidden="true" focusable="false">
                      <path
                        fill="currentColor"
                        d="M20.61 10.86c0-4.6-4.61-8.35-10.28-8.35S.05 6.26.05 10.86c0 4.12 3.66 7.57 8.6 8.22.34.07.8.22.92.5.11.26.07.67.03.94 0 0-.12.73-.15.89-.05.26-.23 1.02.9.55 1.13-.48 6.1-3.59 8.32-6.14h-.01c1.53-1.68 2.25-3.39 2.25-4.96ZM7.4 12.86H5.37a.27.27 0 0 1-.27-.27V8.63c0-.15.12-.27.27-.27h.54c.15 0 .27.12.27.27v3.42H7.4c.15 0 .27.12.27.27v.27c0 .15-.12.27-.27.27Zm1.62-.27a.27.27 0 0 1-.27.27h-.54a.27.27 0 0 1-.27-.27V8.63c0-.15.12-.27.27-.27h.54c.15 0 .27.12.27.27v3.96Zm4.4 0a.27.27 0 0 1-.27.27h-.54a.27.27 0 0 1-.22-.12l-2.08-2.84v2.69a.27.27 0 0 1-.27.27h-.54a.27.27 0 0 1-.27-.27V8.63c0-.15.12-.27.27-.27h.54c.09 0 .17.04.22.11l2.08 2.84V8.63c0-.15.12-.27.27-.27h.54c.15 0 .27.12.27.27v3.96Zm3.63-3.42h-2.03v.67h2.03c.15 0 .27.12.27.27v.27c0 .15-.12.27-.27.27h-2.03v.67h2.03c.15 0 .27.12.27.27v.27c0 .15-.12.27-.27.27h-2.84a.27.27 0 0 1-.27-.27V8.63c0-.15.12-.27.27-.27h2.84c.15 0 .27.12.27.27v.27c0 .15-.12.27-.27.27Z"
                      />
                    </svg>
                  </span>
                  {t("login.socialLine")}
                </button>
              </div>
            </div>

            <div className="login-partition partition-register">
              <p className="partition-title">{t("login.noAccount")}</p>
              <Link className="btn btn-secondary auth-main-btn" href="/register">
                {t("login.register")}
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
