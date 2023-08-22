import {StyleProp, ViewStyle} from 'react-native';

export interface IconSvgProps {
  style?: StyleProp<ViewStyle>;
  size?: number;
  tintColor?: string;
  tintColor2?: string;
}

export {default as ErrorIcon} from './ErrorIcon';
export {default as IconPaddingField} from './IconPaddingField';
export {default as IconTagStars} from './IconTagStars';
export {default as NotificationIcon} from './NotificationIcon';
export {default as QuestionIcon} from './QuestionIcon';
export {default as SuccessIcon} from './SuccessIcon';
