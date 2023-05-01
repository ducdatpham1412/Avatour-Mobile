import {StyleProp, ViewStyle} from 'react-native';

export interface IconSvgProps {
  style?: StyleProp<ViewStyle>;
  size?: number;
  tintColor?: string;
  tintColor2?: string;
}

export {default as ErrorIcon} from './ErrorIcon';
export {default as SuccessIcon} from './SuccessIcon';
