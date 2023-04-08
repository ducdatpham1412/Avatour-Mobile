import {View, Text, StyleProp, TextStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {I18Normalize} from 'utility/I18Next';
import {ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';
import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {$styleDropShadow} from 'utility/assistant';
import {useTheme} from 'hook';
import {StyleText} from 'components/base';

interface Props {
  title: I18Normalize;
  containerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

const CardInformation = ({title, containerStyle, children}: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        $container,
        $styleDropShadow,
        {backgroundColor: theme.white, shadowColor: theme.gray_500},
        containerStyle,
      ]}>
      <StyleText i18Text={title} customStyle={$titleCard} />
      {children}
    </View>
  );
};

const $container: ViewStyle = {
  width: scale(351),
  paddingVertical: verticalScale(12),
  borderRadius: BORDER_RADIUS.f2,
};
const $titleCard: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  marginLeft: scale(12),
};

export default CardInformation;
