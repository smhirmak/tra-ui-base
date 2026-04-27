/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormikErrorText } from './formik-error-text';
import { getNestedValue } from './utils';

interface FormikSwitchProps {
    id: string;
    formik: any;
    label?: string | React.ReactNode;
    disabled?: boolean;
    className?: string;
    containerClassName?: string;
    labelClassName?: string;
    labelSide?: 'left' | 'right';
    onChange?: (checked: boolean) => void;
}

export const FormikSwitch: React.FC<FormikSwitchProps> = ({
    id,
    formik,
    label,
    disabled,
    className,
    containerClassName,
    labelClassName,
    labelSide = 'left',
    onChange,
}) => (
    <div className={cn('flex flex-col text-start gap-4', containerClassName)}>
        {label && labelSide === 'left' && (
            <Label htmlFor={id} className={cn(labelClassName)}>
                {label}
            </Label>
        )}
        <div className="flex items-center gap-2">
            <Switch
                id={id}
                checked={getNestedValue(formik.values, id) ?? false}
                onCheckedChange={(checked) => {
                    formik.setFieldValue(id, checked);
                    onChange?.(checked);
                }}
                disabled={disabled}
                className={cn(className)}
            />
            {label && labelSide === 'right' && (
                <Label htmlFor={id} className={cn(labelClassName)}>
                    {label}
                </Label>
            )}
        </div>
        <FormikErrorText id={id} formik={formik} />
    </div>
);
