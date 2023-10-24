import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {moderateScale} from 'utility/scale';

interface Props {
  open?: boolean;
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
}

const Eye = ({open, onPress, style}: Props) => {
  return (
    <Entypo
      name={open ? 'eye' : 'eye-with-line'}
      style={[
        {
          fontSize: moderateScale(20),
        },
        style,
      ]}
      onPress={onPress ? () => onPress?.() : undefined}
    />
  );
};

export default Eye;
