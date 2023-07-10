import {StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {moderateScale} from 'utility/scale';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  onPress?(): void;
  size?: number;
}

const ButtonX = ({containerStyle, onPress, iconStyle, size = 10}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {backgroundColor: theme.gray_200},
        containerStyle,
      ]}
      onPress={onPress}
      hitSlop={10}>
      <Feather
        name="x"
        style={[
          {color: theme.black},
          iconStyle,
          {fontSize: moderateScale(size)},
        ]}
      />
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  position: 'absolute',
  top: moderateScale(5),
  right: moderateScale(5),
  padding: moderateScale(5),
  borderRadius: 20,
};

export default ButtonX;
