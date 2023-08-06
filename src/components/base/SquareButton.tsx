import {BORDER_RADIUS, FONT_WEIGHT_MEDIUM} from 'asset';
import {useTheme} from 'hook';
import React from 'react';
import {ActivityIndicator, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {scale, verticalScale} from 'utility/scale';
import StyleText from './StyleText';
import StyleTouchable from './StyleTouchable';

interface Props {
  title: I18Normalize;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disable?: boolean;
}

const SquareButton = ({
  title,
  onPress,
  containerStyle,
  titleStyle,
  loading = false,
  disable = false,
}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {backgroundColor: theme.gray_300},
        containerStyle,
      ]}
      onPress={onPress}
      disable={disable || loading}
      disableOpacity={loading ? 1 : 0.4}>
      {loading ? (
        <ActivityIndicator size="small" color={theme.black} />
      ) : (
        <StyleText i18Text={title} customStyle={[$title, titleStyle]} />
      )}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: scale(12),
  height: verticalScale(30),
  borderRadius: BORDER_RADIUS.f4,
  alignItems: 'center',
  justifyContent: 'center',
};
const $title: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default SquareButton;
