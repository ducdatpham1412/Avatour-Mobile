import Images from 'asset/img/images';
import {StyleText} from 'components/base';
import {useTheme} from 'hook';
import LottieView from 'lottie-react-native';
import React, {ReactNode, useEffect, useRef, useState} from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale} from 'utility/scale';

type TextWaiting = {
  i18nText?: I18Normalize;
  style?: StyleProp<TextStyle>;
  appearDuration?: number;
};

interface Props {
  containerStyle?: StyleProp<ViewStyle>;
  size?: number;
  withMessage?: boolean;
  loadingCpn?: ReactNode;
  textWaiting?: TextWaiting;
}

type LoadingIconProps = {
  size?: number;
  loadingCpn?: ReactNode;
  withMessage?: boolean;
  // layout and textWaitingStyle is only used for loading withMessage = true
  layout?: 'horizontal' | 'vertical' | 'absolute';
  textWaiting?: TextWaiting;
};

type ThreeDotProps = {
  style?: StyleProp<TextStyle>;
};

const ThreeDot = ({style}: ThreeDotProps) => {
  const [dots, setDots] = useState([1]);
  const intervale = useRef<NodeJS.Timer>();

  useEffect(() => {
    intervale.current = setInterval(() => {
      setDots(pre => {
        if (pre.length === 1) {
          return [1, 1];
        }
        if (pre.length === 2) {
          return [1, 1, 1];
        }
        if (pre.length === 3) {
          return [];
        }
        return [1];
      });
    }, 500);

    return () => {
      clearInterval(intervale.current);
    };
  }, []);

  return (
    <StyleText
      customStyle={{
        width: moderateScale(18),
      }}>
      {dots.map((_, idx) => {
        return (
          <StyleText
            key={idx}
            originValue="."
            customStyle={[$textWaiting, style]}
          />
        );
      })}
    </StyleText>
  );
};

const LoadingWithMessage = ({
  size = 100,
  layout = 'absolute',
  loadingCpn,
  textWaiting,
}: Pick<
  LoadingIconProps,
  'size' | 'layout' | 'loadingCpn' | 'textWaiting'
>) => {
  const timeOut = useRef<NodeJS.Timeout>();
  const aim = useSharedValue(0);
  const opacityWaiting = useSharedValue(1);

  const loadingIconStyle = useAnimatedStyle(() => {
    if (layout === 'absolute') {
      const opacity = interpolate(aim.value, [0, 1], [1, 0]);
      return {
        opacity,
      };
    }

    return {};
  }, [layout]);

  const waitingBox = useAnimatedStyle(() => {
    const opacity = interpolate(aim.value, [0, 1], [0, 1]);
    return {
      opacity,
      position: layout === 'absolute' ? 'absolute' : 'relative',
    };
  }, [layout]);

  const waiting = useAnimatedStyle(() => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      opacity: opacityWaiting.value,
    };
  }, []);

  useEffect(() => {
    timeOut.current = setTimeout(() => {
      aim.value = withTiming(
        1,
        {
          duration: 600,
        },
        () => {
          opacityWaiting.value = withRepeat(
            withTiming(0.7, {
              duration: 800,
            }),
            0,
          );
        },
      );
    }, textWaiting?.appearDuration ?? 5000);

    return () => clearTimeout(timeOut.current);
  }, [aim, opacityWaiting, textWaiting?.appearDuration]);

  return (
    <View
      style={[
        $loading,
        {
          flexDirection: layout === 'horizontal' ? 'row' : 'column',
        },
      ]}>
      <Animated.View style={loadingIconStyle}>
        {loadingCpn ?? (
          <LottieView
            source={Images.images.loadingTravel}
            style={{
              width: moderateScale(size),
              height: moderateScale(size),
            }}
            autoPlay
            loop
            speed={0.65}
          />
        )}
      </Animated.View>

      <Animated.View style={waitingBox}>
        <Animated.View style={waiting}>
          <StyleText
            i18Text={textWaiting?.i18nText ?? 'alert.waitingMinute'}
            customStyle={[$textWaiting, textWaiting?.style]}
          />
          <ThreeDot style={textWaiting?.style} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export const LoadingIcon = ({
  size = 100,
  withMessage = false,
  loadingCpn,
  layout,
  textWaiting,
}: LoadingIconProps) => {
  if (!withMessage) {
    return (
      loadingCpn ?? (
        <LottieView
          source={Images.images.loadingTravel}
          style={{width: moderateScale(size), height: moderateScale(size)}}
          autoPlay
          loop
          speed={0.65}
        />
      )
    );
  }

  return (
    <LoadingWithMessage
      size={size}
      layout={layout}
      loadingCpn={loadingCpn}
      textWaiting={textWaiting}
    />
  );
};

const LoadingScreen = (props: Props) => {
  const {
    containerStyle,
    size = 150,
    withMessage,
    loadingCpn,
    textWaiting,
  } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        $container,
        {
          backgroundColor: theme.white_opacity(0.9),
        },
        containerStyle,
      ]}>
      <LoadingIcon
        size={size}
        withMessage={withMessage}
        layout="vertical"
        loadingCpn={loadingCpn}
        textWaiting={{
          appearDuration: 3000,
          ...textWaiting,
        }}
      />
    </View>
  );
};

const $container: StyleProp<ViewStyle> = [
  StyleSheet.absoluteFillObject,
  {
    alignItems: 'center',
    justifyContent: 'center',
  },
];
const $loading: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
};
const $textWaiting: TextStyle = {
  fontWeight: 'bold',
};

export default LoadingScreen;
