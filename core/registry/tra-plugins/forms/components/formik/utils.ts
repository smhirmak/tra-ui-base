/* eslint-disable @typescript-eslint/no-explicit-any */

export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function formikErrorCheck(formik: any, id: string): string | undefined {
  const touched = getNestedValue(formik.touched, id);
  const error = getNestedValue(formik.errors, id);
  if (touched && error) {
    return typeof error === "object" && error.text ? error.text : error;
  }
  return undefined;
}
