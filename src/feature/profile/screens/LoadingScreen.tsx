import Images from 'asset/img/images';
import {useTheme} from 'hook';
import LottieView from 'lottie-react-native';
import React from 'react';
import {StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {moderateScale} from 'utility/scale';

interface Props {
  hasLogo?: boolean;
  opacityBackground?: number;
}

export const LoadingIcon = () => {
  return (
    <LottieView
      source={Images.images.loadingPlane}
      style={$iconFly}
      autoPlay
      loop
      speed={1}
    />
  );
};

const LoadingScreen = (props: Props) => {
  const {hasLogo = true, opacityBackground = 0.9} = props;
  const theme = useTheme();

  return (
    <View
      style={[
        $container,
        {
          backgroundColor: theme.background,
          opacity: opacityBackground,
        },
      ]}>
      {hasLogo && <LoadingIcon />}
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
const $iconFly: TextStyle = {
  width: moderateScale(70),
  height: moderateScale(70),
};

export default LoadingScreen;
