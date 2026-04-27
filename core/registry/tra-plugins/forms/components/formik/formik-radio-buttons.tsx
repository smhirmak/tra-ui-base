import { useField } from 'formik';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Option {
  value: string;
  label?: string;
}

interface FormikRadioButtonsProps {
  name: string;
  label?: string;
  options: Option[];
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
}

/**
 * Formik bağlantılı RadioGroup (MSI UI Kit).
 *
 * @example
 * <FormikRadioButtons name="type" options={[{ value: 'a', label: 'A' }]} />
 */
export function FormikRadioButtons({
  name,
  label,
  options,
  disabled,
  className,
  onChange,
}: FormikRadioButtonsProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {label}
        </span>
      )}
      <RadioGroup
        value={field.value ?? ''}
        disabled={disabled}
        onValueChange={(val) => {
          helpers.setValue(val);
          helpers.setTouched(true);
          onChange?.(val);
        }}
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center space-x-2">
            <RadioGroupItem value={opt.value} id={`${name}-${opt.value}`} />
            {opt.label && (
              <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
            )}
          </div>
        ))}
      </RadioGroup>
      {meta.touched && meta.error && (
        <span className="text-xs font-medium text-red-500">{meta.error}</span>
      )}
    </div>
  );
}
