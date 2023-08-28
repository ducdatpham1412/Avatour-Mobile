import {verticalMargin} from 'asset/metrics';
import React from 'react';
import {View, ViewStyle} from 'react-native';

const Separator = () => {
  return <View style={$separator} />;
};

const $separator: ViewStyle = {
  marginTop: verticalMargin,
};

export default Separator;
