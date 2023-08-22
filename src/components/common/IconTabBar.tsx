import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {StyleIcon, StyleText} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {
  ImageSourcePropType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {I18Normalize} from 'utility/I18Next';

interface IconTabBarProps {
  icon: ImageSourcePropType;
  title: I18Normalize;
  titleStyle?: StyleProp<ViewStyle>;
}

const IconTabBar = ({icon, title, titleStyle}: IconTabBarProps) => {
  const {black} = useTheme();
  return (
    <View style={$titleView}>
      <StyleIcon source={icon} size={13.5} customStyle={{tintColor: black}} />
      <StyleText i18Text={title} customStyle={[$title, titleStyle]} />
    </View>
  );
};

const $titleView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginLeft: 4,
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default IconTabBar;
