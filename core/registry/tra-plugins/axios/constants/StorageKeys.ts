/**
 * LocalStorage key sabitleri.
 * Tüm localStorage erişimleri bu sabitler üzerinden yapılmalıdır.
 * Key değiştirmek isterseniz sadece burayı güncellemeniz yeterlidir.
 */
const StorageKeys = {
  ACCESS_TOKEN: "access_token",
  USER: "user",
} as const;

export default StorageKeys;
