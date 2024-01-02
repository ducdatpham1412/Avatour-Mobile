import {StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleProp, ViewStyle} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  onPress(): void;
  touchableStyle?: StyleProp<ViewStyle>;
  size?: number;
}

const AnimatedTouch = Animated.createAnimatedComponent(StyleTouchable);

const IconLiked = ({onPress, touchableStyle, size = 40}: Props) => {
  const theme = useTheme();
  const aim = useRef(new Animated.Value(2)).current;

  useEffect(() => {
    Animated.spring(aim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <AnimatedTouch
      style={[{transform: [{scale: aim}]}, touchableStyle]}
      onPress={onPress}
      hitSlop={moderateScale(10)}>
      <AntDesign
        name="heart"
        style={[{color: theme.pink, fontSize: moderateScale(size)}]}
      />
    </AnimatedTouch>
  );
};

export default IconLiked;
