import Images from 'asset/img/images';
import {useTheme} from 'hook';
import LottieView from 'lottie-react-native';
import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {moderateScale} from 'utility/scale';

interface Props {
  hasLogo?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  size?: number;
}

interface LoadingIconProps {
  size?: number;
}

export const LoadingIcon = ({size = 100}: LoadingIconProps) => {
  return (
    <LottieView
      source={Images.images.loadingTravel}
      style={{width: moderateScale(size), height: moderateScale(size)}}
      autoPlay
      loop
      speed={0.65}
    />
  );
};

const LoadingScreen = ({hasLogo = true, containerStyle, size = 150}: Props) => {
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
      {hasLogo && <LoadingIcon size={size} />}
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

export default LoadingScreen;
