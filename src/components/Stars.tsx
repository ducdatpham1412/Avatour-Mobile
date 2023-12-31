import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale, scale} from 'utility/scale';
import {StyleTouchable} from './base';

interface Props {
  value: number;
  onChangeValue?: (v: number) => void;
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
  numberStars?: number;
}

interface ItemStarProps {
  size: number;
  onPress: () => void;
  isSelected: boolean;
}

const ItemStar = ({size, onPress, isSelected}: ItemStarProps) => {
  const theme = useTheme();

  const touchScale = useSharedValue(1);
  const touchStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: touchScale.value}],
    };
  }, []);

  return (
    <Animated.View style={touchStyle}>
      <StyleTouchable
        onPress={() => {
          touchScale.value = withSequence(withTiming(1.7), withTiming(1));
          onPress();
        }}>
        <AntDesign
          name={isSelected ? 'star' : 'staro'}
          style={{
            color: theme.orange,
            fontSize: moderateScale(size),
          }}
        />
      </StyleTouchable>
    </Animated.View>
  );
};

const Stars = ({
  value,
  onChangeValue,
  size = 17,
  numberStars = 5,
  containerStyle,
}: Props) => {
  const theme = useTheme();
  const arrayStars = Array.from({length: numberStars});

  return (
    <View style={[$container, containerStyle]}>
      {arrayStars.map((_, index) => {
        const isSelect = index + 1 <= value;

        if (onChangeValue) {
          return (
            <ItemStar
              size={size}
              onPress={() => onChangeValue(index + 1)}
              isSelected={isSelect}
              key={index}
            />
          );
        }

        return (
          <AntDesign
            key={index}
            name={isSelect ? 'star' : 'staro'}
            style={{color: theme.orange, fontSize: moderateScale(size)}}
          />
        );
      })}
    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: scale(8),
};

export default Stars;
