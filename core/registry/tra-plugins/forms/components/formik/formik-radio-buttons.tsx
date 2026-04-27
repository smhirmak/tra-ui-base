/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-buttons';
import { Label } from '@/components/ui/label';
import { FormikErrorText } from './formik-error-text';
import { getNestedValue } from './utils';

interface FormikRadioButtonsProps {
  id: string;
  formik: any;
  options?: { value: string | boolean; label?: string }[];
  defaultValue?: string | boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (value: any) => void;
  onlyParentOnChange?: boolean;
  hideErrorText?: boolean;
}

export const FormikRadioButtons: React.FC<FormikRadioButtonsProps> = ({
  id,
  formik,
  options,
  defaultValue,
  disabled,
  className,
  onChange,
  onlyParentOnChange,
  hideErrorText = false,
}) => (
  <div className="flex flex-col">
    <RadioGroup
      defaultValue={defaultValue as any}
      value={getNestedValue(formik.values, id) ?? ''}
      className={cn(className)}
      disabled={disabled}
      onValueChange={(selected: string) => {
        if (onlyParentOnChange) {
          onChange?.(selected);
        } else {
          onChange?.(selected);
          formik.setFieldValue(id, selected);
        }
      }}
    >
      {options?.map((option) => (
        <div className="flex items-center space-x-2" key={String(option.value)}>
          <RadioGroupItem value={option.value as any} id={String(option.value)} />
          {option?.label && <Label htmlFor={String(option.value)}>{option.label}</Label>}
        </div>
      ))}
    </RadioGroup>
    {!hideErrorText && <FormikErrorText id={id} formik={formik} />}
  </div>
);
