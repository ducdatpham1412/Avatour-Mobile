import Theme from 'asset/theme/Theme';
import {StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  onPress(): void;
  customStyle?: StyleProp<TextStyle>;
  touchableStyle?: StyleProp<ViewStyle>;
}

const AnimatedTouch = Animated.createAnimatedComponent(StyleTouchable);

const IconNotLiked = ({onPress, customStyle, touchableStyle}: Props) => {
  const theme = useTheme();
  const aim = useRef(new Animated.Value(0)).current;

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
        name="hearto"
        style={[styles.heartNotLikeIcon, {color: theme.gray_600}, customStyle]}
      />
    </AnimatedTouch>
  );
};

const styles = ScaledSheet.create({
  heartNotLikeIcon: {
    fontSize: '40@ms',
    color: Theme.common.white,
  },
});

export default IconNotLiked;
