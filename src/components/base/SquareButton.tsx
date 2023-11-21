import {FONT_WEIGHT_MEDIUM} from 'asset';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
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
  icon?: ReactNode;
}

const SquareButton = ({
  title,
  onPress,
  containerStyle,
  titleStyle,
  loading = false,
  icon,
}: Props) => {
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {backgroundColor: theme.gray_100},
        containerStyle,
      ]}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator size="small" color={theme.black} />
      ) : (
        <>
          {icon}
          <StyleText
            i18Text={title}
            customStyle={[$title, {marginLeft: icon ? 4 : 0}, titleStyle]}
          />
        </>
      )}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: scale(12),
  height: verticalScale(36),
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
};
const $title: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default SquareButton;
