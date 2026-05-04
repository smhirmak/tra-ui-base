/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/lib/utils";
import Select from "@/components/ui/select";
import { FormikErrorText } from "./formik-error-text";
import { getNestedValue } from "./utils";

interface ISelectOption {
  content: string | React.ReactNode;
  value: number | string | boolean;
}

interface FormikSelectProps {
  id: string;
  formik: any;
  label?: string;
  options: ISelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  selectClassName?: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  showRequiredIcon?: boolean;
  onChange?: (value: any) => void;
  onlyParentOnChange?: boolean;
  hideErrorText?: boolean;
  defaultValue?: string | number | string[] | number[];
}

export const FormikSelect: React.FC<FormikSelectProps> = ({
  id,
  formik,
  label,
  options,
  placeholder = "Seçiniz...",
  disabled,
  className,
  selectClassName,
  isMulti = false,
  isSearchable = false,
  showRequiredIcon,
  onChange,
  onlyParentOnChange,
  hideErrorText,
  defaultValue,
}) => (
  <div className={cn(className)}>
    <Select
      id={id}
      label={label}
      showRequiredIcon={showRequiredIcon}
      value={
        getNestedValue(formik.values, id) !== undefined &&
        getNestedValue(formik.values, id) !== ""
          ? getNestedValue(formik.values, id)
          : (defaultValue ?? "")
      }
      onChange={(value: any) => {
        if (onlyParentOnChange) {
          onChange?.(value);
        } else {
          if (!disabled) formik.setFieldValue(id, value);
          onChange?.(value);
        }
      }}
      defaultValue={defaultValue}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      isSearchable={isSearchable}
      disabled={disabled}
      error={Boolean(
        getNestedValue(formik.touched, id) && getNestedValue(formik.errors, id),
      )}
      className={selectClassName}
    />
    {!hideErrorText && <FormikErrorText id={id} formik={formik} />}
  </div>
);
