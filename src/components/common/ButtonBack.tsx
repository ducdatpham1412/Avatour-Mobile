import {StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, scale} from 'utility/scale';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  onPress?(): void;
}

const ButtonBack = ({containerStyle, onPress, iconStyle}: Props) => {
  const {white, black} = useTheme();

  return (
    <StyleTouchable
      customStyle={[$container, {backgroundColor: white}, containerStyle]}
      onPress={onPress}>
      <MaterialIcons
        name="arrow-back"
        style={[$iconX, {color: black}, iconStyle]}
      />
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  position: 'absolute',
  padding: scale(4),
  borderRadius: 50,
};
const $iconX: TextStyle = {
  fontSize: moderateScale(23),
};

export default ButtonBack;
