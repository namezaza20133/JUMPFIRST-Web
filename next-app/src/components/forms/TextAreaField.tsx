type TextAreaFieldProps = {
  name: string;
  placeholder: string;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  errorMessage?: string;
};

export function TextAreaField({
  name,
  placeholder,
  rows = 5,
  required = false,
  disabled = false,
  errorMessage,
}: TextAreaFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="form-field">
      <textarea
        name={name}
        rows={rows}
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
