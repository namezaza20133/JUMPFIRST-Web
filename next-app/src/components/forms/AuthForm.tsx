import { FormField } from "@/components/forms/FormField";
import type { FormFieldSchema } from "@/lib/content/formSchemas";
import { useI18n } from "@/lib/i18n/I18nProvider";
import type { FormEvent } from "react";

type AuthFormProps = {
  ariaLabel: string;
  title: string;
  submitLabel: string;
  fields: FormFieldSchema[];
  fieldErrors?: Record<string, string>;
  isSubmitting?: boolean;
  statusMessage?: string;
  statusTone?: "success" | "error";
  onSubmit?: (formData: FormData) => Promise<void>;
};

export function AuthForm({
  ariaLabel,
  title,
  submitLabel,
  fields,
  fieldErrors,
  isSubmitting = false,
  statusMessage,
  statusTone,
  onSubmit,
}: AuthFormProps) {
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
    <form className="contact-form auth-form" aria-label={ariaLabel} onSubmit={(event) => void handleSubmit(event)}>
      <h2>{title}</h2>
      {fields.map((field) => (
        <FormField
          key={`${field.name}-${field.type}-${field.placeholderKey}`}
          name={field.name}
          type={field.type === "textarea" ? "text" : field.type}
          placeholder={t(field.placeholderKey)}
          required={field.required}
          disabled={isSubmitting}
          errorMessage={fieldErrors?.[field.name]}
        />
      ))}
      {statusMessage && statusTone ? <p className={`form-status ${statusTone}`}>{statusMessage}</p> : null}
      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {submitLabel}
      </button>
    </form>
  );
}
