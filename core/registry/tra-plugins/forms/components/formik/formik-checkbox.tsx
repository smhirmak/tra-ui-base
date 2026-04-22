import { useField } from 'formik';

interface FormikCheckboxProps {
  name: string;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function FormikCheckbox({ name, label, disabled, className }: FormikCheckboxProps) {
  const [field, meta] = useField({ name, type: 'checkbox' });

  return (
    <div className={className}>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          {...field}
          type="checkbox"
          disabled={disabled}
          className="h-4 w-4 rounded border-neutral-300 accent-primary disabled:cursor-not-allowed"
        />
        {label}
      </label>
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
