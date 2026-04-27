/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { cn } from '@/lib/utils';
import DatePicker from '@/components/date-picker';
import Label from '@/components/label';
import type { DayPickerProps } from 'react-day-picker';
import { FormikErrorText } from './formik-error-text';
import { getNestedValue } from './utils';

interface FormikDatePickerProps {
  id: string;
  formik: any;
  label?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  containerClassName?: string;
  mode?: DayPickerProps['mode'];
  showRequiredIcon?: boolean;
  showCompleteButton?: boolean;
  showClearButton?: boolean;
  onBlur?: () => void;
}

export const FormikDatePicker: React.FC<FormikDatePickerProps> = ({
  id,
  formik,
  label,
  disabled,
  minDate,
  maxDate,
  containerClassName,
  mode = 'single',
  showRequiredIcon,
  showCompleteButton,
  showClearButton = false,
  onBlur,
}) => (
  <div className={cn(containerClassName, 'flex flex-col text-start gap-1.5')}>
    {label && (
      <Label htmlFor={id}>
        {label}
        {showRequiredIcon && <span className="text-red-500"> *</span>}
      </Label>
    )}
    <DatePicker
      mode={mode}
      disabled={disabled}
      value={getNestedValue(formik.values, id) ?? ''}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(e: any) => {
        if (!disabled) {
          if (mode === 'range') {
            formik.setFieldValue(id, e);
            return;
          }
          const cleanedDate = e instanceof Date && !Number.isNaN(e.getTime())
            ? new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()))
            : null;
          formik.setFieldValue(id, cleanedDate);
        }
      }}
      error={Boolean(getNestedValue(formik.touched, id) && getNestedValue(formik.errors, id))}
      showCompleteButton={showCompleteButton}
      showClearButton={showClearButton}
      onBlur={onBlur}
    />
    <FormikErrorText id={id} formik={formik} />
  </div>
);
