import {BORDER_RADIUS, FONT_SIZE} from 'asset';
import {Metrics, horizontalPadding} from 'asset/metrics';
import {StyleText} from 'components/base';
import {useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';

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
        // $styleDropShadow,
        {shadowColor: theme.gray_500},
        containerStyle,
      ]}>
      <StyleText i18Text={title} customStyle={$titleCard} />
      {renderContent()}
    </View>
  );
};

const $container: ViewStyle = {
  width: Metrics.width - 2 * horizontalPadding,
  borderRadius: BORDER_RADIUS.f2,
};
const $titleCard: TextStyle = {
  fontSize: FONT_SIZE.h2,
  fontWeight: 'bold',
};
const $contentContainerStyle: ViewStyle = {
  width: Metrics.width,
  left: -horizontalPadding,
};

export default CardInformation;
