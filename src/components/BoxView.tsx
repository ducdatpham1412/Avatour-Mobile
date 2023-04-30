import {BORDER_RADIUS} from 'asset';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {$styleDropShadow} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';
import {StyleTouchable} from './base';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children?: ReactNode;
}

const BoxView = ({containerStyle, onPress, children}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[
        $container,
        $styleDropShadow,
        {backgroundColor: theme.white, shadowColor: theme.gray_400},
        containerStyle,
      ]}
      onPress={onPress}
      disable={!onPress}
      disableOpacity={1}>
      {children}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  borderRadius: BORDER_RADIUS.f2,
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(12),
};

export default BoxView;
