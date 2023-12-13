import {LoadingIcon} from 'feature/profile/screens';
import {useTheme} from 'hook';
import React from 'react';
import {ActivityIndicator, StyleProp, TextStyle, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {detectFromStyle} from 'utility/assistant';
import {moderateScale, scale} from 'utility/scale';
import {StyleText} from '.';
import StyleTouchable from './StyleTouchable';

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
        $container,
        {backgroundColor: disable ? theme.gray_300 : theme.p_600},
        containerStyle,
      ]}
      onPress={onPress}
      disable={disable || isLoading}
      disableOpacity={1}>
      {isLoading ? (
        <LoadingIcon
          withMessage
          layout="absolute"
          loadingCpn={
            <ActivityIndicator color={(tintColor as string) ?? theme.white} />
          }
          textWaiting={{
            style: {
              color: theme.white,
            },
          }}
        />
      ) : (
        <StyleText
          i18Text={title || 'common.done'}
          customStyle={[$title, {color: theme.white}, titleStyle]}
        />
      )}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: scale(200),
  height: moderateScale(46),
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
};

const $title: TextStyle = {
  fontWeight: 'bold',
};

export default StyleButton;
