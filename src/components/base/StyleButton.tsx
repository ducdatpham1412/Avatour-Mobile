import {useTheme} from 'hook';
import React from 'react';
import {ActivityIndicator, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';
import {scale, verticalScale} from 'utility/scale';
import {StyleText} from '.';
import StyleTouchable from './StyleTouchable';
import {detectFromStyle} from 'utility/assistant';

interface StyleTouchableProps {
  title: I18Normalize;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  disable?: boolean;
  onPress?: () => void;
  isLoading?: boolean;
}

const StyleButton = (props: StyleTouchableProps) => {
  const {title, containerStyle, titleStyle, disable, onPress, isLoading} =
    props;
  const theme = useTheme();
  const tintColor = detectFromStyle(titleStyle, 'color');

  return (
    <StyleTouchable
      customStyle={[
        styles.container,
        {backgroundColor: theme.p_700},
        containerStyle,
      ]}
      onPress={onPress}
      disable={disable || isLoading}
      disableOpacity={isLoading ? 1 : 0.4}>
      {isLoading ? (
        <ActivityIndicator color={(tintColor as string) ?? theme.white} />
      ) : (
        <StyleText
          i18Text={title || 'common.done'}
          customStyle={[styles.title, {color: theme.white}, titleStyle]}
        />
      )}
    </StyleTouchable>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: scale(200),
    height: verticalScale(40),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default StyleButton;
