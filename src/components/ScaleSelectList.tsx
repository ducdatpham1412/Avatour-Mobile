import {ReactElement, useRef} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useUpdateEffect} from 'react-use';
import {scale} from 'utility/scale';
import {StyleTouchable} from './base';

type ScaleSelect<T> = {
  icon: ReactElement;
  value: T;
};

interface Props<T = any> {
  data: ScaleSelect<T>[];
  value: T | undefined;
  onChangeValue?: (value: T | undefined) => void;
  containerStyle?: StyleProp<ViewStyle>;
  maxScale?: number;
}

interface ItemSelectedProps<T = any> {
  item: ScaleSelect<T>;
  onPress: () => void;
  maxScale: number;
  isSelected: boolean;
}

const ItemSelected = ({
  item,
  onPress,
  maxScale,
  isSelected,
}: ItemSelectedProps) => {
  const layOuted = useRef(false);
  const rootSize = useSharedValue(0);
  const aim = useSharedValue(0);

  const style = useAnimatedStyle(() => {
    const opacity = interpolate(aim.value, [0, 1], [0.5, 1]);
    const width = interpolate(
      aim.value,
      [0, 1],
      [rootSize.value, rootSize.value * maxScale],
    );

    return {
      opacity,
      width: width || undefined,
      height: rootSize.value * maxScale || undefined,
    };
  }, [maxScale]);

  const iconStyle = useAnimatedStyle(() => {
    const txScale = interpolate(aim.value, [0, 1], [1, maxScale]);

    return {
      transform: [{scale: txScale}],
    };
  }, []);

  useUpdateEffect(() => {
    aim.value = withTiming(isSelected ? 1 : 0);
  }, [aim, isSelected]);

  return (
    <Animated.View
      style={[$item, style]}
      onLayout={e => {
        if (!layOuted.current) {
          rootSize.value = e.nativeEvent.layout.width;
          if (isSelected) {
            aim.value = withTiming(1);
          }
          layOuted.current = true;
        }
      }}>
      <Animated.View style={iconStyle}>
        <StyleTouchable onPress={onPress}>{item.icon}</StyleTouchable>
      </Animated.View>
    </Animated.View>
  );
};

const ScaleSelectList = ({
  data,
  value,
  onChangeValue,
  containerStyle,
  maxScale = 1.6,
}: Props) => (
  <View style={[$container, containerStyle]}>
    <View style={$body}>
      {data.map(item => {
        const isSelected = item.value === value;

        return (
          <ItemSelected
            key={item.value}
            item={item}
            onPress={() => onChangeValue?.(item.value)}
            maxScale={maxScale}
            isSelected={isSelected}
          />
        );
      })}
    </View>
  </View>
);

const $container: ViewStyle = {
  flexDirection: 'row',
};
const $body: ViewStyle = {
  flexDirection: 'row',
  gap: scale(4),
};
const $item: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
};

export default ScaleSelectList;
