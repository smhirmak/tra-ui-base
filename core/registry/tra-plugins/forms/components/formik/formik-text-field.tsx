import { useField } from 'formik';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormikTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  maxLength?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  textarea?: boolean;
  rows?: number;
  showRequiredIcon?: boolean;
  onChange?: (value: string) => void;
}

/**
 * Formik bağlantılı Input (MSI UI Kit).
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
  containerClassName,
  maxLength,
  startIcon,
  endIcon,
  textarea,
  rows,
  showRequiredIcon,
  onChange,
}: FormikTextFieldProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {showRequiredIcon && <span className="text-red-500"> *</span>}
        </Label>
      )}
      <Input
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
        rows={rows}
        error={!!(meta.touched && meta.error)}
        className={cn(className)}
      />
      {meta.touched && meta.error && (
        <span className="text-xs font-medium text-red-500">{meta.error}</span>
      )}
    </div>
  );
}
