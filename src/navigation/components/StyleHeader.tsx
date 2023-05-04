import {FONT_SIZE} from 'asset/standardValue';
import {StyleText} from 'components/base';
import {useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import React, {ReactNode} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';
import HeaderLeftIcon from './HeaderLeftIcon';

export interface StyleHeaderProps {
  title: I18Normalize;
  titleParams?: any;
  onGoBack?(): void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  showIconBack?: boolean;
  RightComponent?: ReactNode;
}

const StyleHeader = (props: StyleHeaderProps) => {
  const {
    title,
    titleParams,
    onGoBack,
    containerStyle,
    titleStyle,
    iconStyle,
    showIconBack = true,
    RightComponent,
  } = props;
  const theme = useTheme();

  return (
    <View
      style={[
        $container,
        {
          backgroundColor: theme.background,
          borderBottomColor: theme.gray_300,
        },
        containerStyle,
      ]}>
      <StyleText
        i18Text={title as I18Normalize}
        i18Params={titleParams}
        customStyle={[$titleText, titleStyle]}
      />

      {!!showIconBack && (
        <HeaderLeftIcon
          style={$headerLeft}
          onPress={onGoBack || goBack}
          iconStyle={iconStyle}
        />
      )}

      {!!RightComponent && (
        <View style={$rightComponent}>{RightComponent}</View>
      )}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  paddingBottom: verticalScale(7),
  paddingTop: verticalScale(3),
  alignItems: 'center',
  justifyContent: 'center',
  borderBottomWidth: borderWidthTiny,
};
const $titleText: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  maxWidth: '80%',
};
const $headerLeft: ViewStyle = {
  position: 'absolute',
  left: scale(12),
};
const $rightComponent: ViewStyle = {
  position: 'absolute',
  right: scale(12),
};

export default StyleHeader;
