/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/lib/utils";
import Label from "@/components/ui/label";
import Input from "@/components/ui/input";
import { FormikErrorText } from "./formik-error-text";
import { getNestedValue } from "./utils";

interface FormikTextFieldProps {
  id: string;
  formik: any;
  label?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  maxLength?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  textarea?: boolean;
  showRequiredIcon?: boolean;
  onChange?: (value: string) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  autoFocus?: boolean;
  defaultValue?: string | number;
}

export const FormikTextField: React.FC<FormikTextFieldProps> = ({
  id,
  formik,
  label,
  placeholder,
  type = "text",
  disabled,
  className,
  containerClassName,
  maxLength,
  startIcon,
  endIcon,
  textarea,
  showRequiredIcon,
  onChange,
  onKeyDown,
  autoFocus,
  defaultValue,
}) => (
  <div className={cn(containerClassName, "flex flex-col text-start gap-1.5")}>
    {label && (
      <Label htmlFor={id}>
        {label}
        {showRequiredIcon && <span className="text-red-500"> *</span>}
      </Label>
    )}
    <Input
      id={id}
      value={getNestedValue(formik.values, id) ?? defaultValue ?? ""}
      onChange={(e) => {
        if (!disabled) {
          formik.setFieldValue(id, e.target.value);
          onChange?.(e.target.value);
        }
      }}
      onBlur={formik.handleBlur}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      startIcon={startIcon}
      endIcon={endIcon}
      textarea={textarea}
      autoFocus={autoFocus}
      error={Boolean(
        getNestedValue(formik.touched, id) && getNestedValue(formik.errors, id),
      )}
      className={cn(className)}
      onKeyDown={onKeyDown}
    />
    <FormikErrorText id={id} formik={formik} />
  </div>
);
