import { useField } from 'formik';
import { cn } from '@/lib/utils';
import TextField from '../text-field';

interface FormikTextFieldProps {
  name: string;
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  maxLength?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  textarea?: boolean;
  showRequiredIcon?: boolean;
  onChange?: (value: string) => void;
}

export function FormikTextField({
  name,
  label,
  labelClassName,
  placeholder,
  type = 'text',
  disabled,
  className,
  containerClassName,
  maxLength,
  startIcon,
  endIcon,
  textarea,
  showRequiredIcon,
  onChange,
}: FormikTextFieldProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      <TextField
        label={label}
        labelClassName={labelClassName}
        showRequiredIcon={showRequiredIcon}
        id={name}
        value={field.value ?? ''}
        onChange={(e) => {
          helpers.setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        onBlur={field.onBlur}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        startIcon={startIcon}
        endIcon={endIcon}
        textarea={textarea}
        error={!!(meta.touched && meta.error)}
        className={cn(className)}
      />
      {meta.touched && meta.error && (
        <span className="text-xs font-medium text-red-500">{meta.error}</span>
      )}
    </div>
  );
}
