import { useField, useFormikContext } from 'formik';

interface FormikDatePickerProps {
  name: string;
  label?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export function FormikDatePicker({
  name,
  label,
  disabled,
  min,
  max,
  className,
}: FormikDatePickerProps) {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

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
        type="date"
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => setFieldValue(name, e.target.value)}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
      />
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
