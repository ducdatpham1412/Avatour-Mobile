import {FONT_SIZE} from 'asset/standardValue';
import {StyleText} from 'components/base';
import {useTheme} from 'hook';
import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {View, ViewStyle} from 'react-native';
import {
  Platform,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {ms, s, vs} from 'utility/scale';

type Props = TextInputProps & {
  i18Placeholder?: I18Normalize;
  containerStyle?: StyleProp<ViewStyle>;
  isError?: boolean;
  textError?: I18Normalize;
};

const InputBox = (
  {i18Placeholder, containerStyle, isError, textError, ...rest}: Props,
  ref: any,
) => {
  const theme = useTheme();
  const {t} = useTranslation();

  if (isError !== undefined) {
    return (
      <View style={[$container, containerStyle]}>
        <TextInput
          ref={ref}
          placeholderTextColor={theme.gray_500}
          selectionColor={theme.p_900}
          {...rest}
          placeholder={i18Placeholder ? t(i18Placeholder) : rest.placeholder}
          style={[
            $input,
            {width: '100%', backgroundColor: theme.white, color: theme.black},
            rest.style,
          ]}
        />
        <StyleText
          i18Text={isError ? textError : 'common.null'}
          customStyle={[$textError, {color: theme.red}]}
          numberOfLines={2}
        />
      </View>
    );
  }

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={theme.gray_500}
      selectionColor={theme.p_900}
      {...rest}
      placeholder={i18Placeholder ? t(i18Placeholder) : rest.placeholder}
      style={[
        $input,
        {backgroundColor: theme.white, color: theme.black},
        rest.style,
      ]}
    />
  );
};

const $container: ViewStyle = {
  width: '80%',
  alignSelf: 'center',
};
const $input: TextStyle = {
  width: '80%',
  borderRadius: 100,
  fontSize: FONT_SIZE.f2,
  paddingTop: Platform.select({
    ios: vs(14),
    android: vs(8),
  }),
  paddingBottom: Platform.select({
    ios: vs(14),
    android: vs(8),
  }),
  paddingHorizontal: s(15),
  alignSelf: 'center',
};
const $textError: TextStyle = {
  fontSize: FONT_SIZE.f4,
  paddingHorizontal: s(15),
  height: ms(30),
};

export default forwardRef(InputBox);
