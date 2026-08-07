import { FormField } from "@/components/forms/FormField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import type { FormFieldSchema } from "@/lib/content/formSchemas";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { FormEvent } from "react";

type ContactFormProps = {
  ariaLabel: string;
  fields: FormFieldSchema[];
  submitLabel: string;
  fieldErrors?: Record<string, string>;
  isSubmitting?: boolean;
  statusMessage?: string;
  statusTone?: "success" | "error";
  onSubmit?: (formData: FormData) => Promise<void>;
};

export function ContactForm({
  ariaLabel,
  fields,
  submitLabel,
  fieldErrors,
  isSubmitting = false,
  statusMessage,
  statusTone,
  onSubmit,
}: ContactFormProps) {
  const { t } = useI18n();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onSubmit || isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    await onSubmit(formData);
  };

  return (
    <form className="contact-form" aria-label={ariaLabel} onSubmit={(event) => void handleSubmit(event)}>
      {fields.map((field) =>
        field.type === "textarea" ? (
          <TextAreaField
            key={`${field.name}-${field.type}-${field.placeholderKey}`}
            name={field.name}
            placeholder={t(field.placeholderKey)}
            rows={field.rows}
            required={field.required}
            disabled={isSubmitting}
            errorMessage={fieldErrors?.[field.name]}
          />
        ) : (
          <FormField
            key={`${field.name}-${field.type}-${field.placeholderKey}`}
            name={field.name}
            type={field.type}
            placeholder={t(field.placeholderKey)}
            required={field.required}
            disabled={isSubmitting}
            errorMessage={fieldErrors?.[field.name]}
          />
        )
      )}
      {statusMessage && statusTone ? <p className={`form-status ${statusTone}`}>{statusMessage}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {submitLabel}
      </button>
    </form>
  );
}
