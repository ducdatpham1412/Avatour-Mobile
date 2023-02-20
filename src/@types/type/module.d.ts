import {I18Normalize} from 'utility/I18Next';

declare module 'i18next' {
  interface TFunction {
    (key: I18Normalize): string;
  }
}
