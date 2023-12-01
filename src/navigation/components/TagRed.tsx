import Theme from 'asset/theme/Theme';
import {StyleText} from 'components/base';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {moderateScale} from 'utility/scale';

interface TagRedProps {
  value: number;
}

const TagRed = ({value}: TagRedProps) => {
  return (
    <View style={$newNotificationBox}>
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
  backgroundColor: Theme.common.red,
  top: 0,
  right: -moderateScale(6),
};
const $textNewMessages: TextStyle = {
  fontSize: moderateScale(10),
  color: 'white',
  fontFamily: undefined,
};

export default TagRed;
