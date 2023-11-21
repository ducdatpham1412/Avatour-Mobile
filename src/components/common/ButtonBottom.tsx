import {FONT_SIZE} from 'asset';
import {horizontalPadding, verticalMargin} from 'asset/metrics';
import {StyleButton, StyleText} from 'components/base';
import {useSafeArea, useTheme} from 'hook';
import React, {ReactNode} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {$styleTopShadow, borderWidthTiny} from 'utility/assistant';
import {verticalScale} from 'utility/scale';

type Props = {
  topComponent?: ReactNode;
  title?: I18Normalize;
  action:
    | {
        left: {
          title: I18Normalize;
          disable?: boolean;
          loading?: boolean;
          onPress: () => void;
        };
        right: {
          title: I18Normalize;
          disable?: boolean;
          loading?: boolean;
          onPress: () => void;
        };
      }
    | {
        title: I18Normalize;
        disable?: boolean;
        loading?: boolean;
        onPress: () => void;
      };
};

const ButtonBottom = ({title, topComponent, action}: Props) => {
  const theme = useTheme();
  const {bottom} = useSafeArea();
  const haveTwoButton = 'left' in action;

  const button = () => {
    if (haveTwoButton) {
      return (
        <View style={$twoButton}>
          <StyleButton
            title={action.left.title}
            containerStyle={[$buttonCancel, {borderColor: theme.black}]}
            titleStyle={{
              color: action.left.disable ? theme.gray_500 : theme.black,
            }}
            onPress={action.left.onPress}
            disable={action.left.disable}
            isLoading={action.left.loading}
          />
          <StyleButton
            title={action.right.title}
            containerStyle={{width: '70%'}}
            onPress={action.right.onPress}
            disable={action.right.disable}
            isLoading={action.right.loading}
          />
        </View>
      );
    }

    return (
      <StyleButton
        containerStyle={$oneButton}
        title={action.title}
        onPress={action.onPress}
        isLoading={action.loading}
        disable={action.disable}
      />
    );
  };

  return (
    <View
      style={[
        $container,
        $styleTopShadow,
        {
          paddingBottom: bottom,
          backgroundColor: theme.white,
          shadowColor: theme.black,
        },
      ]}>
      {topComponent}
      {!!title && (
        <StyleText
          i18Text={title as I18Normalize}
          customStyle={[$title, {color: theme.red}]}
        />
      )}
      {button()}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  paddingTop: verticalMargin,
  paddingHorizontal: horizontalPadding,
  alignItems: 'center',
};
const $twoButton: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
};
const $buttonCancel: ViewStyle = {
  width: '28%',
  backgroundColor: 'transparent',
  borderWidth: borderWidthTiny,
};
const $oneButton: ViewStyle = {
  width: '100%',
};
const $title: TextStyle = {
  marginBottom: verticalScale(8),
  fontSize: FONT_SIZE.f4,
};

export default ButtonBottom;
