import {standValue} from 'asset/standardValue';
import * as yup from 'yup';
import {requireField, requireLength} from './format';
import I18Next from './I18Next';

const REGEX_EMAIL =
    /^(([^<>()[\]\\x.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const REGEX_PHONE = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{2})/;
const REGEX_PASSWORD = /^[aA-zZ0-9]*$/;

export const validateIsEmail = (email: string) => {
    return REGEX_EMAIL.test(email);
};

export const validateIsPhone = (phone: string) => {
    return REGEX_PHONE.test(phone);
};

export const validateIsNumber = (value: any) => {
    return /^[0-9]+$/.test(value);
};

export function validateIsLink(str: string) {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i',
    ); // fragment locator
    return !!pattern.test(str);
}

export const yupValidate = {
    username: () => {
        return yup
            .string()
            .required(requireField())
            .min(
                standValue.USERNAME_MIN_LENGTH,
                requireLength(
                    standValue.USERNAME_MIN_LENGTH,
                    standValue.USERNAME_MAX_LENGTH,
                ),
            );
    },
    password: (ref?: string) => {
        if (ref) {
            return yup
                .string()
                .required(requireField())
                .oneOf([yup.ref(ref), null], I18Next.t('alert.passNotMatch'));
        }
        return yup
            .string()
            .required(requireField())
            .min(
                standValue.PASSWORD_MIN_LENGTH,
                requireLength(
                    standValue.PASSWORD_MIN_LENGTH,
                    standValue.PASSWORD_MAX_LENGTH,
                ),
            )
            .matches(REGEX_PASSWORD, I18Next.t('alert.regexPass'));
    },
    email: () => {
        return yup
            .string()
            .required(requireField())
            .email(I18Next.t('alert.inValidEmail'));
    },
    phone: () => {
        return yup
            .string()
            .required(requireField())
            .matches(REGEX_PHONE, I18Next.t('alert.inValidPhone'));
    },
    default: () => {
        return yup.string();
    },
};

const ranges = [
    '(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])', // U+1F680 to U+1F6FF
];
export const checkIsSingleEmoji = (str: string) => {
    // sentence
    if (str.length > 4) {
        return false;
    }
    // one emoji
    if (str.length === 2) {
        return !!str.match(ranges.join('|'));
    }
    // two emoji
    if (str.length === 4) {
        const emoji0 = str[0].concat(str[1]);
        const emoji1 = str[2].concat(str[3]);
        return (
            !!emoji0.match(ranges.join('|')) && !!emoji1.match(ranges.join('|'))
        );
    }

    return false;
};

export const checkIsVideo = (fileName: string) => {
    const listElements = fileName.toLowerCase().split('.');
    for (let i = listElements.length - 1; i >= 0; i--) {
        if (
            listElements[i].includes('mp4') ||
            listElements[i].includes('mov')
        ) {
            return true;
        }
    }
    return false;
};

export const checkFileType = (fileName: string): 'image' | 'video' | null => {
    const listElements = fileName.toLowerCase().split('.');
    for (let i = listElements.length - 1; i >= 0; i--) {
        const element = listElements[i];
        if (element.includes('mp4') || element.includes('mov')) {
            return 'video';
        }
        if (
            element.includes('png') ||
            element.includes('jpg') ||
            element.includes('jpeg')
        ) {
            return 'image';
        }
    }
    return null;
};
