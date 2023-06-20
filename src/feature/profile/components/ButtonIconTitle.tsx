import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Animated,
  StyleProp,
  TextStyle,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {borderWidthTiny} from 'utility/assistant';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  icon?: ReactNode;
  title: I18Normalize;
  titleFontWeight?: TextStyle['fontWeight'];
  titleStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

interface Refs {
  slug: () => void;
}

const ButtonIconTitle = (
  {
    icon,
    title,
    titleStyle,
    titleFontWeight = FONT_WEIGHT_MEDIUM,
    containerStyle,
    buttonStyle,
    onPress,
  }: Props,
  ref: ForwardedRef<Refs>,
) => {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1));
  const translateX = useRef(new Animated.Value(0));

  useImperativeHandle(
    ref,
    () => ({
      slug: () => {
        Vibration.vibrate();
        Animated.timing(scale.current, {
          toValue: 1.5,
          useNativeDriver: true,
          duration: 100,
        }).start(() => {
          Animated.sequence([
            Animated.timing(translateX.current, {
              toValue: 10,
              duration: 60,
              useNativeDriver: true,
            }),
            Animated.timing(translateX.current, {
              toValue: -10,
              duration: 60,
              useNativeDriver: true,
            }),
            Animated.timing(translateX.current, {
              toValue: 10,
              duration: 60,
              useNativeDriver: true,
            }),
            Animated.timing(translateX.current, {
              toValue: 0,
              duration: 60,
              useNativeDriver: true,
            }),
          ]).start(() => {
            Animated.timing(scale.current, {
              toValue: 1,
              useNativeDriver: true,
              duration: 100,
            }).start();
          });
        });
      },
    }),
    [],
  );

  return (
    <View style={[$container, containerStyle]}>
      <Animated.View
        style={{
          transform: [{scale: scale.current}, {translateX: translateX.current}],
        }}>
        <StyleTouchable
          customStyle={[$body, {borderColor: theme.gray_500}, buttonStyle]}
          onPress={onPress}
          disable={!onPress}
          disableOpacity={1}>
          {icon ?? (
            <AntDesign name="plus" style={[$icon, {color: theme.blue}]} />
          )}
          <StyleText
            i18Text={title}
            customStyle={[
              $title,
              {color: theme.black, fontWeight: titleFontWeight},
              titleStyle,
            ]}
          />
        </StyleTouchable>
      </Animated.View>
    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
};
const $body: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: borderWidthTiny,
  paddingHorizontal: scale(12),
  paddingVertical: verticalScale(6),
  borderRadius: BORDER_RADIUS.f4,
};
const $icon: TextStyle = {
  fontSize: moderateScale(15),
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginLeft: scale(8),
};

export default forwardRef(ButtonIconTitle);
