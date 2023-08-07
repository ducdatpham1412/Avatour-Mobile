import Theme from 'asset/theme/Theme';
import React, {useCallback, useEffect, useState} from 'react';
import {
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextLayoutEventData,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {StyleText, StyleTouchable} from './base';
import {verticalScale} from 'utility/scale';

interface Props {
  value: any;
  maxHeight?: number;
  maxRows?: number;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?(): void;
}

const StyleMoreText = (props: Props) => {
  const {
    value,
    maxHeight = verticalScale(400),
    maxRows = 8,
    textStyle,
    containerStyle,
    onPress,
  } = props;

  const [saveNumber, setSaveNumber] = useState(0);
  const [numberOfLines, setNumberOfLines] = useState<number | undefined>(
    undefined,
  );
  const displayButton = !!saveNumber && saveNumber > maxRows;
  const isShowMore = displayButton && numberOfLines === maxRows;

  const onTextLayOut = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (numberOfLines === undefined) {
        setSaveNumber(e.nativeEvent.lines.length);
        if (e.nativeEvent.lines.length > maxRows) {
          setNumberOfLines(maxRows);
        }
      }
    },
    [numberOfLines],
  );

  useEffect(() => {
    setNumberOfLines(undefined);
  }, [value]);

  const RenderButtonShowMoreOrLess = () => {
    const text = isShowMore ? 'common.seeMore' : 'common.seeLess';

    const onPressText = () => {
      if (isShowMore) {
        setNumberOfLines(saveNumber);
      } else {
        setNumberOfLines(maxRows);
      }
    };

    return (
      <StyleTouchable onPress={onPressText}>
        <StyleText
          i18Text={text}
          customStyle={[
            styles.textSeeMoreOrLess,
            {color: Theme.darkTheme.borderColor},
          ]}
        />
      </StyleTouchable>
    );
  };

  const styleScroll: ViewStyle = displayButton
    ? isShowMore
      ? {}
      : {maxHeight}
    : {};

  return (
    <View style={[styles.container, containerStyle, styleScroll]}>
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <StyleText
          originValue={value}
          customStyle={textStyle}
          onTextLayout={onTextLayOut}
          numberOfLines={isShowMore ? maxRows : numberOfLines}
          onPress={onPress}
        />
      </ScrollView>

      {displayButton && RenderButtonShowMoreOrLess()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textSeeMoreOrLess: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default StyleMoreText;
