import {StyleProp, ViewStyle} from 'react-native';

export interface IconSvgProps {
  style?: StyleProp<ViewStyle>;
  size?: number;
  tintColor?: string;
  tintColor2?: string;
}

export {default as ErrorIcon} from './ErrorIcon';
export {default as IconClock} from './IconClock';
export {default as IconClose} from './IconClose';
export {default as IconEdit} from './IconEdit';
export {default as IconLocation} from './IconLocation';
export {default as IconPaddingField} from './IconPaddingField';
export {default as IconPrice} from './IconPrice';
export {default as IconTagStars} from './IconTagStars';
export {default as IconTour} from './IconTour';
export {default as NotificationIcon} from './NotificationIcon';
export {default as QuestionIcon} from './QuestionIcon';
export {default as SuccessIcon} from './SuccessIcon';
