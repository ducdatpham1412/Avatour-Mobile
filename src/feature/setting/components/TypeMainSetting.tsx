import {FONT_WEIGHT_MEDIUM} from 'asset';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {isValidElement} from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface TypeMainSettingProps {
  icon: ImageSourcePropType | Element;
  title: I18Normalize;
  onPress(): void;
}

const TypeMainSetting = (props: TypeMainSettingProps) => {
  const {icon, title, onPress} = props;
  const theme = useTheme();

  return (
    <StyleTouchable customStyle={$container} onPress={onPress}>
      <View style={[$blur, {backgroundColor: theme.white}]} />

      <View
        style={[
          $iconBox,
          {
            borderColor: theme.p_600,
          },
        ]}>
        {isValidElement(icon) ? (
          icon
        ) : (
          <StyleImage source={icon} customStyle={$icon} />
        )}
      </View>

      <View style={[$cord, {borderTopColor: theme.p_600}]} />

      <StyleText i18Text={title} customStyle={$text} />
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  height: verticalScale(55),
  marginTop: verticalScale(16),
  flexDirection: 'row',
  alignItems: 'center',
};
const $blur: ViewStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: 100,
};
const $iconBox: ViewStyle = {
  width: moderateScale(45),
  height: moderateScale(45),
  borderRadius: 50,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  marginLeft: scale(8),
};
const $cord: ViewStyle = {
  width: scale(8),
  borderTopWidth: moderateScale(2),
  marginRight: scale(12),
};
const $text: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $icon: ImageStyle = {
  width: '70%',
  height: '70%',
};

export default TypeMainSetting;
