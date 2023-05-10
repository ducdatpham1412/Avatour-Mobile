import {FONT_SIZE} from 'asset';
import {StyleIcon, StyleText} from 'components/base';
import React from 'react';
import {ImageSourcePropType, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';

interface IconTabBarProps {
  icon: ImageSourcePropType;
  title: I18Normalize;
}

const IconTabBar = ({icon, title}: IconTabBarProps) => {
  return (
    <View style={$titleView}>
      <StyleIcon source={icon} size={13} />
      <StyleText i18Text={title} customStyle={[$title]} />
    </View>
  );
};

const $titleView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f4,
  marginLeft: 4,
};

export default IconTabBar;
