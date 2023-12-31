import {SESSION} from 'asset/enum';
import dayjs, {Dayjs} from 'dayjs';
import en from 'dayjs/locale/en';
import vi from 'dayjs/locale/vi';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {registerTranslation} from 'react-native-paper-dates';
import I18Next from './I18Next';
import {validateIsNumber} from './validate';

dayjs.extend(relativeTime);
dayjs.locale(vi);
dayjs.extend(utc);
dayjs.extend(isToday);

export const requireField = () => {
  return () => I18Next.t('alert.require');
};

export const requireLength = (min: number, max: number) => {
  return () => I18Next.t('alert.minLength', {min, max});
};

export const formatUTCDate = (date: string | Date | Dayjs = new Date()) => {
  return dayjs(date).utc().format();
};

export const getDateTimeNow = () => {
  return formatUTCDate(dayjs());
};

export const formatDateDayMonthYear = (date: string | Date) => {
  return dayjs(date).locale('en').format('DD - MM - YYYY');
};

export const formatFromNow = (date: Date | string) => {
  const now = dayjs();
  let diff = now.diff(date, 'second');
  if (diff < 60) {
    return `${diff}s`;
  }
  diff = now.diff(date, 'minute');
  if (diff < 60) {
    return `${diff}m`;
  }
  diff = now.diff(date, 'hour');
  if (diff < 24) {
    return `${diff}h`;
  }
  diff = now.diff(date, 'day');
  if (diff < 30) {
    return `${diff}d`;
  }
  diff = now.diff(date, 'month');
  return `${diff}month`;
};

export const checkIsToday = (date: string | Date) => {
  return dayjs(date).isToday();
};

export const formatDateMessage = (date: string | Date) => {
  if (checkIsToday(date)) {
    return dayjs(date).locale('en').format('HH:mm');
  }
  return dayjs(date).locale('en').format('MMM DD, HH:mm');
};

export const isTimeBefore = (day1: Date | string, day2: Date | string) => {
  return dayjs(day1).isBefore(day2);
};

export const isTimeAfter = (day1: Date | string, day2: Date | string) => {
  return dayjs(day1).isAfter(day2);
};

export const isTimeEqual = (day1: Date | string, day2: Date | string) => {
  return dayjs(day1).isSame(day2);
};

export const formatDateChatTag = (date: Date | string) => {
  if (dayjs(date).isToday()) {
    return dayjs(date).locale('en').format('HH:mm');
  }
  const now = dayjs();
  if (now.isSame(date, 'week')) {
    return dayjs(date).format('ddd');
  }
  return dayjs(date).format('DD MMM');
};

export const formatLocaleNumber = (value: string | number) => {
  if (
    value === undefined ||
    value === '' ||
    !validateIsNumber(value, {isDecimal: true})
  ) {
    return '';
  }
  if (String(value).includes('.')) {
    const temp = String(value).split('.');
    return `${temp[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${temp[1]}`;
  }
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatNormalNumberFromLocale = (value: string) => {
  if (!value) {
    return '';
  }
  return String(value).replace(/,/g, '');
};

export const formatDayFromNow = (date: Date | string) => {
  return dayjs(date).diff(new Date(), 'day');
};

export const getSessionOfDay = () => {
  const hour = dayjs().hour();
  if (hour >= 5 && hour < 12) {
    return SESSION.morning;
  }
  if (hour >= 12 && hour < 18) {
    return SESSION.afternoon;
  }
  return SESSION.evening;
};

export const addDate = (
  date: Dayjs | string,
  params: {
    value: number;
    unit: dayjs.ManipulateType;
  },
) => {
  return dayjs(date).add(params.value, params.unit).utc().format();
};

export const LanguageProvider = ({children}: any) => {
  const translation = useTranslation();
  const {language} = translation[1];

  useEffect(() => {
    switch (language) {
      case 'vi':
        dayjs.locale(vi);
        break;
      case 'en':
        dayjs.locale(en);
        break;
      default:
        dayjs.locale(vi);
        break;
    }
    registerTranslation('en', {
      save: 'Save',
      selectSingle: 'Select date',
      selectMultiple: 'Select dates',
      selectRange: 'Select period',
      notAccordingToDateFormat: inputFormat =>
        `Date format must be ${inputFormat}`,
      mustBeHigherThan: date => `Must be later then ${date}`,
      mustBeLowerThan: date => `Must be earlier then ${date}`,
      mustBeBetween: (startDate, endDate) =>
        `Must be between ${startDate} - ${endDate}`,
      dateIsDisabled: 'Day is not allowed',
      previous: 'Previous',
      next: 'Next',
      typeInDate: 'Type in date',
      pickDateFromCalendar: 'Pick date from calendar',
      close: 'Close',
    });
  }, [language]);

  return children;
};

export const formatDDMMMM = (value: string | Dayjs) => {
  return dayjs(value).format('DD MMMM');
};
export const formatDDMMYYYY = (value: string | Dayjs) => {
  return dayjs(value).format('DD/MM/YYYY');
};
export const formatddddDDMMYYYY = (value: string | Dayjs) => {
  return dayjs(value).format('dddd, DD/MM/YYYY');
};
export const formathhmmddddDDMMYYYY = (value: string | Dayjs) => {
  return dayjs(value).format('H:mm dddd, DD/MM/YYYY');
};

type FormatMoneyOptions = {
  unit: 'vnd';
};
export const formatMoney = (value: number, options?: FormatMoneyOptions) => {
  if (options?.unit === 'vnd') {
    return `${formatLocaleNumber(String(value || '0'))}d`;
  }
  return `${formatLocaleNumber(String(value || '0'))}d`;
};
export const formatPhone = (phone: string) => `(+84) ${phone}`;

export const formatInputNumber = (
  value: string | number,
  params?: {isDecimal: boolean},
) => {
  if (value === '') {
    return '';
  }

  value = String(value);
  const lastCharacter = value[value.length - 1];
  if (lastCharacter === ',' || lastCharacter === '.') {
    if (!params?.isDecimal) {
      return null;
    }
    const temp = value.slice(0, -1);
    if (temp.includes('.')) {
      return null;
    }
    value = `${temp}.`;
  } else if (!validateIsNumber(lastCharacter)) {
    return null;
  }

  //   const temp = formatNormalNumberFromLocale(value);
  //   if (validateIsNumber(temp, {isDecimal: true})) {
  //     return temp;
  //   }
  //   return null;

  return formatNormalNumberFromLocale(value);
};

export const formatHours = (value: number) => {
  const hours = Math.trunc(value);
  const minutes = Math.round((value - hours) * 100);

  let text = value?.toFixed(2);
  if (hours < 10) {
    text = `0${text}`;
  }
  text = text?.replace('.', ':');

  return {
    hours,
    minutes,
    text,
  };
};
