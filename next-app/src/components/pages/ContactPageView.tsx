"use client";

import { useState } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageIntro } from "@/components/sections/PageIntro";
import { contactFormSchema } from "@/lib/content/formSchemas";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { contactService } from "@/lib/services/contactService";
import {
  getFirstFieldErrorMessage,
  getServiceErrorMessageKey,
  getTranslatedFieldErrors,
} from "@/lib/services/errors";

export function ContactPageView() {
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
      const result = await contactService.submitContact({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
      });

      if (result.success) {
        setStatusTone("success");
        setFieldErrors(undefined);
        setStatusMessage(t("contact.submitSuccess"));
      } else {
        setStatusTone("error");
        setStatusMessage(t("contact.submitError"));
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
        <div className="container contact-wrap">
          <PageIntro
            eyebrow={t("contact.eyebrow")}
            title={t("contact.title")}
            description={t("contact.desc")}
          />

          <ContactForm
            ariaLabel={t("contact.formAria")}
            fields={contactFormSchema}
            submitLabel={isSubmitting ? t("contact.submitting") : t("contact.submit")}
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
