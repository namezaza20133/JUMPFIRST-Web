"use client";

import { useState } from "react";
import { AuthForm } from "@/components/forms/AuthForm";
import { PageIntro } from "@/components/sections/PageIntro";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState<string | undefined>(undefined);
  const [statusTone, setStatusTone] = useState<"success" | "error" | undefined>(undefined);

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
        <div className="container section-grid">
          <PageIntro
            eyebrow={t("login.eyebrow")}
            title={t("login.title")}
            description={t("login.desc")}
          />

          <AuthForm
            ariaLabel={t("login.formTitle")}
            title={t("login.formTitle")}
            submitLabel={isSubmitting ? t("login.submitting") : t("login.submit")}
            fields={loginFormSchema}
            fieldErrors={fieldErrors}
            isSubmitting={isSubmitting}
            statusMessage={statusMessage}
            statusTone={statusTone}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </main>
  );
}
