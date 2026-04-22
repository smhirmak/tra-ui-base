import { useField } from 'formik';

interface Option {
  value: string | number;
  label: string;
}

interface FormikSelectProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Formik bağlantılı Select.
 *
 * @example
 * <FormikSelect name="role" label="Rol" options={[{ value: 'admin', label: 'Admin' }]} />
 */
export function FormikSelect({
  name,
  label,
  options,
  placeholder = 'Seçiniz...',
  disabled,
  className,
}: FormikSelectProps) {
  const [field, meta] = useField(name);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </label>
      )}
      <select
        {...field}
        id={name}
        disabled={disabled}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
