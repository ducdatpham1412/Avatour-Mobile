import {FONT_SIZE} from 'asset';
import Theme from 'asset/theme/Theme';
import {useTheme} from 'hook';
import {useRef, useState} from 'react';
import {StyleProp, Text, TextStyle, View, ViewStyle} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {StyleTouchable} from './base';

interface Props {
  value: string;
  backgroundColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  minRows?: number;
}

const TextReadMore = ({
  value,
  backgroundColor = Theme.newTheme.white,
  containerStyle,
  textStyle,
  minRows = 2,
}: Props) => {
  const theme = useTheme();

  const checked = useRef(false);

  const aim = useSharedValue(0);
  const rootHeight = useSharedValue(0);
  const minHeight = useSharedValue(0);

  const [rootLines, setRootLines] = useState(0);
  const [numberOfLines, setNumberOfLines] = useState(minRows);

  const style = useAnimatedStyle(() => {
    const height =
      minHeight.value === 0
        ? undefined
        : interpolate(aim.value, [0, 1], [minHeight.value, rootHeight.value]);

    return {height};
  }, []);

  const displayReadMore = rootLines > numberOfLines;

  const onRead = () => {
    const isLessMode = aim.value === 0;
    setNumberOfLines(isLessMode ? rootLines : minRows);
    aim.value = withTiming(isLessMode ? 1 : 0, undefined);
  };

  return (
    <View style={[$container, containerStyle]}>
      <Animated.View style={[$container, {backgroundColor}, style]}>
        <Text
          style={[$textRoot, textStyle, {color: 'transparent'}]}
          onTextLayout={e => {
            setRootLines(e.nativeEvent.lines.length);
          }}
          onLayout={e => {
            rootHeight.value = e.nativeEvent.layout.height;
          }}>
          {value}
        </Text>

        <StyleTouchable activeOpacity={1} onPress={onRead}>
          <Text
            style={[$textDisplay, {color: theme.black}, textStyle]}
            numberOfLines={numberOfLines}
            onTextLayout={e => {
              if (!checked.current) {
                setNumberOfLines(e.nativeEvent.lines.length);
                checked.current = true;
              }
            }}
            onLayout={e => {
              minHeight.value = e.nativeEvent.layout.height;
            }}>
            {value}
          </Text>
        </StyleTouchable>

        {displayReadMore && (
          <Animated.Text
            style={[$readMore, {backgroundColor}, textStyle]}
            onPress={onRead}>
            ...Read more
          </Animated.Text>
        )}
      </Animated.View>
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
};
const $textRoot: TextStyle = {
  position: 'absolute',
  top: 1,
  fontSize: FONT_SIZE.f2,
};
const $textDisplay: TextStyle = {
  fontSize: FONT_SIZE.f2,
};
const $readMore: TextStyle = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  fontSize: FONT_SIZE.f2,
  fontWeight: 'bold',
};

export default TextReadMore;
