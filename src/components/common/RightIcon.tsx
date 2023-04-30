import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {moderateScale} from 'utility/scale';

interface Props {
  style?: StyleProp<TextStyle>;
}

const LeftIcon = ({style}: Props) => {
  return <Entypo name="chevron-thin-right" style={[$icon, style]} />;
};

const $icon: TextStyle = {
  fontSize: moderateScale(17),
};

export default LeftIcon;
