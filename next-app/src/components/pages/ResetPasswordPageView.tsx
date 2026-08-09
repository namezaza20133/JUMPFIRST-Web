"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormField } from "@/components/forms/FormField";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { authService } from "@/lib/services/authService";
import {
  getFirstFieldErrorMessage,
  getServiceErrorMessageKey,
  getTranslatedFieldErrors,
} from "@/lib/services/errors";

export function ResetPasswordPageView() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const [statusTone, setStatusTone] = useState<"success" | "error" | undefined>(undefined);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors(undefined);
    setStatusMessage(undefined);
    setStatusTone(undefined);

    try {
      const formData = new FormData(event.currentTarget);
      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");
      const otpCode = String(formData.get("otpCode") ?? "");

      if (!token) {
        setStatusTone("error");
        setStatusMessage(t("login.resetMissingToken"));
        return;
      }

      if (password !== confirmPassword) {
        setStatusTone("error");
        setFieldErrors({
          confirmPassword: t("login.resetConfirmMismatch"),
        });
        setStatusMessage(t("login.resetConfirmMismatch"));
        return;
      }

      const result = await authService.resetPassword({
        token,
        otpCode,
        password,
      });

      if (result.success) {
        setStatusTone("success");
        setStatusMessage(t("login.resetSubmitSuccess"));
      } else {
        setStatusTone("error");
        setStatusMessage(result.message ?? t("login.resetSubmitError"));
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
          <form className="contact-form auth-form recovery-card" aria-label={t("login.resetTitle")} onSubmit={handleSubmit}>
            <h1 className="login-card-title">{t("login.resetTitle")}</h1>
            <p className="recovery-description">{t("login.resetDesc")}</p>

            <FormField
              name="otpCode"
              type="text"
              placeholder={t("login.resetOtpPlaceholder")}
              required
              disabled={isSubmitting}
              errorMessage={fieldErrors?.otpCode}
            />

            <FormField
              name="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder={t("login.resetPasswordPlaceholder")}
              required
              disabled={isSubmitting}
              errorMessage={fieldErrors?.password}
              endAction={
                <button
                  type="button"
                  className="input-action-btn"
                  aria-label={isPasswordVisible ? t("login.hidePasswordAriaLabel") : t("login.showPasswordAriaLabel")}
                  onClick={() => setIsPasswordVisible((current) => !current)}
                  disabled={isSubmitting}
                >
                  {isPasswordVisible ? t("login.hidePassword") : t("login.showPassword")}
                </button>
              }
            />

            <FormField
              name="confirmPassword"
              type={isConfirmVisible ? "text" : "password"}
              placeholder={t("login.resetConfirmPasswordPlaceholder")}
              required
              disabled={isSubmitting}
              errorMessage={fieldErrors?.confirmPassword}
              endAction={
                <button
                  type="button"
                  className="input-action-btn"
                  aria-label={isConfirmVisible ? t("login.hidePasswordAriaLabel") : t("login.showPasswordAriaLabel")}
                  onClick={() => setIsConfirmVisible((current) => !current)}
                  disabled={isSubmitting}
                >
                  {isConfirmVisible ? t("login.hidePassword") : t("login.showPassword")}
                </button>
              }
            />

            {statusMessage && statusTone ? <p className={`form-status ${statusTone}`}>{statusMessage}</p> : null}

            <button className="btn btn-primary auth-main-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("login.resetSubmitting") : t("login.resetSubmit")}
            </button>

            <Link className="auth-inline-link" href="/login">
              {t("login.backToLogin")}
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
