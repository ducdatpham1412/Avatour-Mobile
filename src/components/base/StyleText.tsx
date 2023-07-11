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
  mode?: 'html' | 'text';
}

type ElementText = {
  type: 'normal' | 'bold';
  text: string;
};

const detectHtmlText = (text: string) => {
  const res: ElementText[] = [];
  const split = text.split('<b>');
  split.forEach(tx => {
    if (tx.includes('</b>')) {
      const temp = tx.split('</b>');
      res.push({
        type: 'bold',
        text: temp[0],
      });
      res.push({
        type: 'normal',
        text: temp[1] ?? '',
      });
    } else {
      res.push({
        type: 'normal',
        text: tx,
      });
    }
  });

  return res;
};

const StyleText = (props: StyleTextProps) => {
  const {
    i18Text,
    i18Params,
    originValue,
    customStyle,
    children,
    mode = 'text',
  } = props;
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

  if (mode === 'text') {
    return (
      <Text style={[$textDefault, {color: black}, customStyle]} {...props}>
        {valueText}
        {children}
      </Text>
    );
  }

  const listTexts = detectHtmlText(valueText);
  return (
    <Text style={[$textDefault, {color: black}, customStyle]} {...props}>
      {listTexts.map(tx => {
        if (tx.type === 'normal') {
          return (
            <Text
              style={[$textDefault, {color: black}, customStyle]}
              {...props}>
              {tx.text}
            </Text>
          );
        }
        return (
          <Text
            style={[
              $textDefault,
              {color: black},
              customStyle,
              {fontWeight: 'bold'},
            ]}
            {...props}>
            {tx.text}
          </Text>
        );
      })}
      {children}
    </Text>
  );
};

const $textDefault: TextStyle = {
  fontSize: FONT_SIZE.f2,
  fontFamily: FONT_FAMILY.openSans,
};

export default StyleText;
