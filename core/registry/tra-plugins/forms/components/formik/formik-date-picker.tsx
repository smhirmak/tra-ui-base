import { useField } from 'formik';
import { cn } from '@/lib/utils';
import DatePicker from '@/components/date-picker';
import Label from '@/components/label';
import type { DayPickerProps } from 'react-day-picker';

interface FormikDatePickerProps {
  name: string;
  label?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  mode?: DayPickerProps['mode'];
  showRequiredIcon?: boolean;
  showCompleteButton?: boolean;
  onBlur?: () => void;
}

export function FormikDatePicker({
  name,
  label,
  disabled,
  minDate,
  maxDate,
  className,
  mode = 'single',
  showRequiredIcon,
  onBlur,
}: FormikDatePickerProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {showRequiredIcon && <span className="text-red-500"> *</span>}
        </Label>
      )}
      <DatePicker
        mode={mode}
        value={field.value ?? ''}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        error={!!(meta.touched && meta.error)}
        onChange={(val) => {
          if (mode === 'range') {
            helpers.setValue(val);
          } else {
            const d = val instanceof Date && !Number.isNaN(val.getTime())
              ? new Date(Date.UTC(val.getFullYear(), val.getMonth(), val.getDate()))
              : null;
            helpers.setValue(d);
          }
          helpers.setTouched(true);
        }}
        onBlur={onBlur}
      />
      {meta.touched && meta.error && (
        <span className="text-xs font-medium text-red-500">{meta.error}</span>
      )}
    </div>
  );
}
