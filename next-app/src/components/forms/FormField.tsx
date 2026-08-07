type FormFieldProps = {
  name: string;
  type?: "text" | "email" | "password" | "tel";
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
};

export function FormField({
  name,
  type = "text",
  placeholder,
  required = false,
  disabled = false,
  errorMessage,
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="form-field">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={errorMessage ? "true" : "false"}
        aria-describedby={errorMessage ? errorId : undefined}
      />
      {errorMessage ? (
        <p id={errorId} className="field-error" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
