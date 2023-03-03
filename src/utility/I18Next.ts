import en from 'asset/language/en';
import vi from 'asset/language/vi';
import I18Next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {logger} from './assistant';

I18Next.use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: {
        translation: en,
      },
      vi: {
        translation: vi,
      },
    },
    lng: I18Next.language,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    nsSeparator: false,
  })
  .catch(logger);

type ResourceLanguage = typeof en & typeof vi;
export type I18Normalize = RecursiveKeyOf<ResourceLanguage>;

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<
  TValue,
  Text extends string,
> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text;

export default I18Next;
