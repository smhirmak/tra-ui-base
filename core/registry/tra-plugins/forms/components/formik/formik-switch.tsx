import { useField } from 'formik';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface FormikSwitchProps {
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
 * Formik bağlantılı Switch (MSI UI Kit).
 *
 * @example
 * <FormikSwitch name="isActive" label="Aktif" />
 */
export function FormikSwitch({
    name,
    label,
    disabled,
    className,
    containerClassName,
    labelClassName,
    labelSide = 'right',
    onChange,
}: FormikSwitchProps) {
    const [field, meta, helpers] = useField(name);

    return (
        <div className={cn('flex flex-col gap-1.5', containerClassName)}>
            <div className="flex items-center gap-2">
                {label && labelSide === 'left' && (
                    <Label htmlFor={name} className={cn(labelClassName)}>
                        {label}
                    </Label>
                )}
                <Switch
                    id={name}
                    checked={field.value ?? false}
                    onCheckedChange={(checked) => {
                        helpers.setValue(checked);
                        helpers.setTouched(true);
                        onChange?.(checked);
                    }}
                    disabled={disabled}
                    className={cn(className)}
                />
                {label && labelSide === 'right' && (
                    <Label htmlFor={name} className={cn(labelClassName)}>
                        {label}
                    </Label>
                )}
            </div>
            {meta.touched && meta.error && (
                <span className="text-xs font-medium text-red-500">{meta.error}</span>
            )}
        </div>
    );
}
