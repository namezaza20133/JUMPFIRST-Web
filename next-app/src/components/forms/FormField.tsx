import type { ReactNode } from "react";

type FormFieldProps = {
  name: string;
  type?: "text" | "email" | "password" | "tel";
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  endAction?: ReactNode;
};

export function FormField({
  name,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  errorMessage,
  endAction,
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="form-field">
      <div className={endAction ? "input-with-action" : undefined}>
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorMessage ? errorId : undefined}
        />
        {endAction}
      </div>
      {errorMessage ? (
        <p id={errorId} className="field-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
