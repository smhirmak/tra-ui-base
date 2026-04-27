import { useField } from 'formik';
import { cn } from '@/lib/utils';
import Checkbox from '@/components/checkbox';

interface FormikCheckboxProps {
  name: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  labelSide?: 'left' | 'right';
  onChange?: (checked: boolean) => void;
}

/**
 * Formik bağlantılı Checkbox (MSI UI Kit).
 *
 * @example
 * <FormikCheckbox name="agree" label="Kabul ediyorum" />
 */
export function FormikCheckbox({
  name,
  label,
  disabled,
  className,
  containerClassName,
  labelClassName,
  labelSide = 'right',
  onChange,
}: FormikCheckboxProps) {
  const [field, meta, helpers] = useField({ name, type: 'checkbox' });

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={name}
          checked={field.value ?? false}
          onChange={(checked) => {
            helpers.setValue(checked);
            helpers.setTouched(true);
            onChange?.(checked as boolean);
          }}
          disabled={disabled}
          className={cn(className)}
          label={label}
          labelSide={labelSide}
          labelClassName={cn(labelClassName)}
        />
      </div>
      {meta.touched && meta.error && (
        <span className="text-xs font-medium text-red-500">{meta.error}</span>
      )}
    </div>
  );
}
