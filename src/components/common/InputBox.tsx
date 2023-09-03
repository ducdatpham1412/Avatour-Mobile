import {FONT_SIZE} from 'asset/standardValue';
import {AppInput, StyleText} from 'components/base';
import {useTheme} from 'hook';
import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Platform,
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {I18Normalize} from 'utility/I18Next';
import {scale, verticalScale} from 'utility/scale';

type Props = TextInputProps & {
  i18Placeholder?: I18Normalize;
  containerStyle?: StyleProp<ViewStyle>;
  isError?: boolean;
  textError?: I18Normalize;
  width?: ViewStyle['width'];
};

interface ErrorTextProps {
  text: I18Normalize;
}

const ErrorText = ({text}: ErrorTextProps) => {
  const theme = useTheme();
  //   const aim = useSharedValue(0);
  const viewStyle = useAnimatedStyle(() => {
    return {
      width: '100%',
      //   height: aim.value,
    };
  });

  return (
    <Animated.View style={viewStyle}>
      <StyleText
        i18Text={text}
        customStyle={[$textError, {color: theme.red}]}
        onTextLayout={e => {
          //   const totalHeight =
          //     e.nativeEvent.lines.reduce(
          //       (pre, current) => pre + current.height,
          //       0,
          //     ) + moderateScale(2);
          //   console.log('total height is: ', totalHeight);
          //   aim.value = withTiming(totalHeight, {
          //     duration: 300,
          //   });
        }}
      />
    </Animated.View>
  );
};

const InputBox = (
  {i18Placeholder, containerStyle, isError, textError, width, ...rest}: Props,
  ref: any,
) => {
  const theme = useTheme();
  const {t} = useTranslation();

  if (isError !== undefined) {
    return (
      <View style={[$container, {width: width ?? '80%'}, containerStyle]}>
        <AppInput
          ref={ref}
          {...rest}
          placeholder={i18Placeholder ? t(i18Placeholder) : rest.placeholder}
          style={[
            $input,
            {width: '100%', backgroundColor: theme.white, color: theme.black},
            rest.style,
          ]}
        />
        {isError && textError && <ErrorText text={textError} />}
      </View>
    );
  }

  return (
    <AppInput
      ref={ref}
      placeholderTextColor={theme.gray_500}
      selectionColor={theme.p_900}
      {...rest}
      placeholder={i18Placeholder ? t(i18Placeholder) : rest.placeholder}
      style={[
        $input,
        {
          width: width ?? '80%',
          backgroundColor: theme.white,
          color: theme.black,
        },
        rest.style,
      ]}
    />
  );
};

const $container: ViewStyle = {
  alignSelf: 'center',
};
const $input: TextStyle = {
  width: '80%',
  borderRadius: 100,
  paddingTop: Platform.select({
    ios: verticalScale(12),
    android: verticalScale(8),
  }),
  paddingBottom: Platform.select({
    ios: verticalScale(12),
    android: verticalScale(8),
  }),
  paddingHorizontal: scale(12),
};
const $textError: TextStyle = {
  fontSize: FONT_SIZE.f4,
  paddingHorizontal: scale(15),
};

export default forwardRef(InputBox);
