import * as Yup from 'yup';

const requiredErrorMessage = 'Bu alan zorunludur.';

export const exampleSchema = Yup.object().shape({
  email: Yup.string().email('Geçerli bir e-posta giriniz').required(requiredErrorMessage),
  name: Yup.string().required('Geçerli bir isim giriniz'),
  password: Yup.string().min(8, 'Şifre en az 8 karakter olmalıdır').required(requiredErrorMessage),
  age: Yup.number().min(18, 'Yaşınız en az 18 olmalıdır').required(requiredErrorMessage),
  beginDate: Yup.date().nullable().required(requiredErrorMessage),
  endDate: Yup.date()
    .nullable()
    .required(requiredErrorMessage)
    .when('beginDate', ([beginDate], schema) =>
      beginDate
        ? schema.min(beginDate, 'Bitiş tarihi başlangıç tarihinden büyük olmalıdır')
        : schema,
    ),
});