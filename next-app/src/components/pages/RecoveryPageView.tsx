"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { FormField } from "@/components/forms/FormField";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { authService } from "@/lib/services/authService";
import {
  getFirstFieldErrorMessage,
  getServiceErrorMessageKey,
  getTranslatedFieldErrors,
} from "@/lib/services/errors";

export function RecoveryPageView() {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      const result = await authService.recoverPassword({
        identifier: String(formData.get("identifier") ?? ""),
      });

      if (result.success) {
        setStatusTone("success");
        setStatusMessage(t("login.recoverySubmitSuccess"));
      } else {
        setStatusTone("error");
        setStatusMessage(result.message ?? t("login.recoverySubmitError"));
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
          <form className="contact-form auth-form recovery-card" aria-label={t("login.recoveryTitle")} onSubmit={handleSubmit}>
            <h1 className="login-card-title">{t("login.recoveryTitle")}</h1>
            <p className="recovery-description">{t("login.recoveryDesc")}</p>

            <FormField
              name="identifier"
              type="text"
              placeholder={t("login.identifierPlaceholder")}
              required
              disabled={isSubmitting}
              errorMessage={fieldErrors?.identifier}
            />

            {statusMessage && statusTone ? <p className={`form-status ${statusTone}`}>{statusMessage}</p> : null}

            <button className="btn btn-primary auth-main-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("login.recoverySubmitting") : t("login.recoverySubmit")}
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