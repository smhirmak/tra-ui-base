/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { formikErrorCheck } from './utils';

interface FormikErrorTextProps {
    id: string;
    formik: any;
}

export const FormikErrorText: React.FC<FormikErrorTextProps> = ({ id, formik }) => {
    const errorMessage = formikErrorCheck(formik, id);

    return errorMessage
        ? <span className="text-xs font-medium text-red-500">{errorMessage}</span>
        : <span className="text-xs font-medium text-red-500">&nbsp;</span>;
};
