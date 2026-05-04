/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/lib/utils";
import Checkbox from "@/components/ui/checkbox";
import { FormikErrorText } from "./formik-error-text";
import { getNestedValue } from "./utils";

interface FormikCheckboxProps {
  id: string;
  formik: any;
  label?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  labelSide?: "left" | "right";
  onChange?: (value: any) => void;
  onlyParentOnChange?: boolean;
}

export const FormikCheckbox: React.FC<FormikCheckboxProps> = ({
  id,
  formik,
  label,
  disabled,
  className,
  containerClassName,
  labelClassName,
  labelSide = "right",
  onChange,
  onlyParentOnChange,
}) => (
  <div className={cn("flex gap-2 items-center", containerClassName)}>
    <Checkbox
      id={id}
      checked={getNestedValue(formik.values, id) ?? false}
      onChange={(checked) => {
        onChange?.(checked);
        if (!onlyParentOnChange) {
          formik.setFieldValue(id, checked);
        }
      }}
      disabled={disabled}
      className={cn("peer", className)}
      containerClassName={cn(containerClassName)}
      labelClassName={cn(labelClassName)}
      label={label}
      labelSide={labelSide}
    />
    <FormikErrorText id={id} formik={formik} />
  </div>
);
