import {FONT_SIZE} from 'asset';
import {FONT_FAMILY} from 'asset/enum';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';

interface StyleTextProps extends TextProps {
  i18Text?: I18Normalize;
  i18Params?: Record<string, any>;
  originValue?: any;
  customStyle?: StyleProp<TextStyle>;
  children?: ReactNode;
}

const StyleText = (props: StyleTextProps) => {
  const {i18Text, i18Params, originValue, customStyle, children} = props;
  const {t} = useTranslation();
  const {black} = useTheme();

  let valueText;
  if (i18Text) {
    valueText = t(i18Text, i18Params || {});
  } else if (originValue !== undefined) {
    valueText = originValue;
  } else {
    valueText = '';
  }

  return (
    <Text style={[$textDefault, {color: black}, customStyle]} {...props}>
      {valueText}
      {children}
    </Text>
  );
};

const $textDefault: TextStyle = {
  fontSize: FONT_SIZE.f2,
  fontFamily: FONT_FAMILY.openSans,
};

export default StyleText;
