import { useField } from 'formik';
// UI Kit'ten import edin: import { TextField } from "@/components/ui/text-field"
// Bu component UI Kit'e bağlıdır — npx msi-ui-cli add text-field ile kurun

interface FormikTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Formik bağlantılı TextField.
 * Hata mesajı ve touched durumunu otomatik yönetir.
 *
 * @example
 * <FormikTextField name="email" label="E-posta" type="email" />
 */
export function FormikTextField({
  name,
  label,
  placeholder,
  type = 'text',
  disabled,
  className,
}: FormikTextFieldProps) {
  const [field, meta] = useField(name);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
      />
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
