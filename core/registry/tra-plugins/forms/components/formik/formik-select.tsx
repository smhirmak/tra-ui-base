import { useField } from 'formik';
import { cn } from '@/lib/utils';
import MsiSelect, { type ISelectOption } from '@/components/ui/msi-select';

interface FormikSelectProps {
  name: string;
  label?: string;
  options: ISelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  showRequiredIcon?: boolean;
  hideClearOption?: boolean;
  onChange?: (value: unknown) => void;
}

/**
 * Formik bağlantılı Select (MSI UI Kit MsiSelect).
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
  isMulti = false,
  isSearchable = false,
  showRequiredIcon,
  hideClearOption,
  onChange,
}: FormikSelectProps) {
  const [field, meta, helpers] = useField(name);

  return (
    <div className={cn(className)}>
      <MsiSelect
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
        options={options}
        isMulti={isMulti}
        isSearchable={isSearchable}
        disabled={disabled}
        error={!!(meta.touched && meta.error)}
        hideClearOption={hideClearOption}
      />
      {meta.touched && meta.error && (
        <span className="text-xs font-medium text-red-500">{meta.error}</span>
      )}
    </div>
  );
}
