import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {Metrics} from 'asset/metrics';
import {StyleText} from 'components/base';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {$styleDropShadow} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  title: I18Normalize;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  overflow?: 'visible' | 'hidden';
}

const CardInformation = ({
  title,
  containerStyle,
  contentContainerStyle,
  children,
  overflow = 'visible',
}: Props) => {
  const theme = useTheme();

  const renderContent = () => {
    if (overflow === 'hidden') {
      return children;
    }
    if (overflow === 'visible') {
      return (
        <View style={[$contentContainerStyle, contentContainerStyle]}>
          {children}
        </View>
      );
    }
    return null;
  };

  return (
    <View
      style={[
        $container,
        $styleDropShadow,
        {backgroundColor: theme.white, shadowColor: theme.gray_500},
        containerStyle,
      ]}>
      <StyleText i18Text={title} customStyle={$titleCard} />
      {renderContent()}
    </View>
  );
};

const $container: ViewStyle = {
  width: scale(351),
  marginHorizontal: scale(12),
  paddingVertical: verticalScale(12),
  borderRadius: BORDER_RADIUS.f2,
};
const $titleCard: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  marginLeft: scale(12),
};
const $contentContainerStyle: ViewStyle = {
  width: Metrics.width,
  left: -scale(12),
};

export default CardInformation;
