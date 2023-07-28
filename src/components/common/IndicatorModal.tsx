import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
}

const IndicatorModal = ({containerStyle}: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[$container, {backgroundColor: theme.gray_400}, containerStyle]}
    />
  );
};

const $container: ViewStyle = {
  position: 'absolute',
  width: scale(50),
  height: moderateScale(4),
  top: verticalScale(4.5),
  alignSelf: 'center',
  borderRadius: 10,
};

export default IndicatorModal;
