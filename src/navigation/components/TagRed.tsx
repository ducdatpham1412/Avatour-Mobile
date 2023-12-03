import {StyleText} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {moderateScale} from 'utility/scale';

interface TagRedProps {
  value: number;
}

const TagRed = ({value}: TagRedProps) => {
  const theme = useTheme();

  return (
    <View style={[$newNotificationBox, {backgroundColor: theme.p_900}]}>
      <StyleText originValue={value} customStyle={$textNewMessages} />
    </View>
  );
};

const $newNotificationBox: ViewStyle = {
  position: 'absolute',
  width: moderateScale(15),
  height: moderateScale(15),
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  right: -moderateScale(6),
};
const $textNewMessages: TextStyle = {
  fontSize: moderateScale(10),
  color: 'white',
  fontFamily: undefined,
};

export default TagRed;
