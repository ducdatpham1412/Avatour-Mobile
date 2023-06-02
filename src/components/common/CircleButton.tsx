import {StyleTouchable} from 'components/base';
import {StyleTouchableProps} from 'components/base/StyleTouchable';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {moderateScale} from 'utility/scale';

interface Props extends StyleTouchableProps {
  containerStyle?: StyleProp<ViewStyle>;
  onPress?(): void;
  icon: ReactNode;
}

const CircleButton = ({containerStyle, onPress, icon, ...rest}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {backgroundColor: theme.gray_200},
        containerStyle,
      ]}
      onPress={onPress}
      hitSlop={10}
      {...rest}>
      {icon}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  padding: moderateScale(5),
  borderRadius: 20,
};

export default CircleButton;
