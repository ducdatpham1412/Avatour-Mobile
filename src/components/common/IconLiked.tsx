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

const IconLiked = ({onPress, customStyle, touchableStyle}: Props) => {
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
        style={[styles.heartIcon, {color: theme.pink}, customStyle]}
      />
    </AnimatedTouch>
  );
};

const styles = ScaledSheet.create({
  heartIcon: {
    fontSize: '40@ms',
  },
});

export default IconLiked;
