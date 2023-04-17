import {SESSION} from 'asset/enum';
import dayjs, {Dayjs} from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import vi from 'dayjs/locale/vi';
import en from 'dayjs/locale/en';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';
import I18Next from './I18Next';
import {registerTranslation} from 'react-native-paper-dates';

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

export const formatDayGroupBuying = (date: string) => {
  if (!date) {
    return '';
  }
  return dayjs(date).locale('jp').format('dddd, DD/MM/YYYY');
};

export const formatLocaleNumber = (value: string) => {
  if (!value) {
    return '';
  }
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
export const formatDDMMMMYY = (value: string | Dayjs) => {
  return dayjs(value).format('DD MMMM YYYY');
};
export const formatddddDDMMYYYY = (value: string | Dayjs) => {
  return dayjs(value).format('dddd, DD/MM/YYYY');
};
