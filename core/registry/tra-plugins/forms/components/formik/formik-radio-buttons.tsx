import { useField } from 'formik';

interface Option {
  value: string | number;
  label: string;
}

interface FormikRadioButtonsProps {
  name: string;
  label?: string;
  options: Option[];
  disabled?: boolean;
  className?: string;
}

export function FormikRadioButtons({
  name,
  label,
  options,
  disabled,
  className,
}: FormikRadioButtonsProps) {
  const [field, meta] = useField(name);

  return (
    <div className={className}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <input
              type="radio"
              name={field.name}
              value={opt.value}
              checked={field.value === opt.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
              className="h-4 w-4 accent-primary disabled:cursor-not-allowed"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
}
