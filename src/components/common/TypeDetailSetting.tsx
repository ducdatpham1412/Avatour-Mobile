import {FONT_WEIGHT_MEDIUM} from 'asset';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {scale, verticalScale} from 'utility/scale';

interface TypeDetailSettingProps {
  title: I18Normalize;
  icon?: ReactNode;
  onPress?(): void;
}

const TypeDetailSetting = (props: TypeDetailSettingProps) => {
  const {title, icon, onPress} = props;
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[$container, {backgroundColor: theme.gray_100}]}
      onPress={onPress}>
      <StyleText i18Text={title} customStyle={$title} />
      <View style={$icon}>{icon}</View>
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  paddingVertical: verticalScale(12),
  paddingHorizontal: scale(12),
  marginTop: verticalScale(16),
  justifyContent: 'center',
  borderRadius: 100,
};
const $icon: ViewStyle = {
  position: 'absolute',
  right: scale(25),
};
const $title: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default TypeDetailSetting;
