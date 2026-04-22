import * as Yup from 'yup';

/**
 * Ortak Yup validasyon şemaları ve helper'ları.
 * Projeye özgü kuralları buraya ekleyin.
 */
export const Validations = {
  /** Zorunlu metin alanı */
  required: (label = 'Alan') =>
    Yup.string().trim().required(`${label} zorunludur.`),

  /** E-posta */
  email: (label = 'E-posta') =>
    Yup.string()
      .trim()
      .email('Geçerli bir e-posta adresi giriniz.')
      .required(`${label} zorunludur.`),

  /** Şifre — min 8 karakter */
  password: () =>
    Yup.string()
      .min(8, 'Şifre en az 8 karakter olmalıdır.')
      .required('Şifre zorunludur.'),

  /** Telefon — Türkiye formatı */
  phone: () =>
    Yup.string()
      .matches(/^(\+90|0)?[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz.')
      .required('Telefon zorunludur.'),

  /** TC Kimlik No */
  tcNo: () =>
    Yup.string()
      .matches(/^[1-9][0-9]{10}$/, 'Geçerli bir TC Kimlik No giriniz.')
      .required('TC Kimlik No zorunludur.'),

  /** Opsiyonel metin */
  optional: () => Yup.string().trim().optional(),

  /** Sayı — zorunlu */
  number: (label = 'Alan') =>
    Yup.number()
      .typeError(`${label} sayı olmalıdır.`)
      .required(`${label} zorunludur.`),

  /** Pozitif sayı */
  positiveNumber: (label = 'Alan') =>
    Yup.number()
      .typeError(`${label} sayı olmalıdır.`)
      .positive(`${label} pozitif olmalıdır.`)
      .required(`${label} zorunludur.`),
};
