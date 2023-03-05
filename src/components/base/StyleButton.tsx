import {useTheme} from 'hook';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';
import {StyleText} from '.';
import StyleTouchable from './StyleTouchable';

interface StyleTouchableProps {
  title: I18Normalize;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  disable?: boolean;
  onPress?: () => void;
}

const StyleButton = (props: StyleTouchableProps) => {
  const {title, containerStyle, titleStyle, disable, onPress} = props;
  const theme = useTheme();

  return (
    <StyleTouchable
      customStyle={[
        styles.container,
        {backgroundColor: theme.p_700},
        containerStyle,
      ]}
      onPress={onPress}
      disable={disable}>
      <StyleText
        i18Text={title || 'common.done'}
        customStyle={[styles.title, {color: theme.white}, titleStyle]}
      />
    </StyleTouchable>
  );
};

const styles = ScaledSheet.create({
  container: {
    borderRadius: '8@vs',
    paddingVertical: '10@vs',
    paddingHorizontal: '60@s',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default StyleButton;
