import { useField } from 'formik';
import { cn } from '@/lib/utils';
import Select, { type ISelectOption } from '@/components/select';

interface FormikSelectOption {
  value: string | number;
  label: string;
}

interface FormikSelectProps {
  name: string;
  label?: string;
  options: FormikSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  showRequiredIcon?: boolean;
  onChange?: (value: unknown) => void;
}

export function FormikSelect({
  name,
  label,
  options,
  placeholder = 'Seçiniz...',
  disabled,
  className,
  isMulti = false,
  isSearchable = false,
  showRequiredIcon,
  onChange,
}: FormikSelectProps) {
  const [field, meta, helpers] = useField(name);

  // MSI Select ISelectOption uses `content` field instead of `label`
  const msiOptions: ISelectOption[] = options.map((o) => ({
    value: o.value,
    content: o.label,
  }));

  return (
    <div className={cn(className)}>
      <Select
        id={name}
        label={label}
        showRequiredIcon={showRequiredIcon}
        value={field.value ?? ''}
        onChange={(value) => {
          helpers.setValue(value);
          helpers.setTouched(true);
          onChange?.(value);
        }}
        placeHolder={placeholder}
        options={msiOptions}
        isMulti={isMulti}
        isSearchable={isSearchable}
        disabled={disabled}
        error={!!(meta.touched && meta.error)}
      />
      {meta.touched && meta.error && (
        <span className="text-xs font-medium text-red-500">{meta.error}</span>
      )}
    </div>
  );
}
