import {BORDER_RADIUS} from 'asset';
import {useTheme} from 'hook';
import React, {isValidElement} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {$styleDropShadow, borderWidthTiny} from 'utility/assistant';
import {scale} from 'utility/scale';
import {StyleText} from './base';

type TypeInfoContent = {
  title: I18Normalize;
  content: string;
  flexDirection?: 'row' | 'column';
};

interface Props {
  listInformation: Array<TypeInfoContent | Element>;
  containerStyle?: StyleProp<ViewStyle>;
}

const BoxInformation = ({listInformation, containerStyle}: Props) => {
  const theme = useTheme();

  return (
    <View
      style={[
        $container,
        $styleDropShadow,
        {backgroundColor: theme.white, shadowColor: theme.gray_400},
        containerStyle,
      ]}>
      {listInformation.map((item, index) => {
        const isLatest = index === listInformation.length - 1;
        if (isValidElement(item)) {
          return <View style={$boxContainerColumn}>{item}</View>;
        }
        const itemContent: TypeInfoContent = item as TypeInfoContent;

        return (
          <View
            style={[
              $boxContainer,
              {
                borderBottomColor: theme.gray_200,
                borderBottomWidth: isLatest ? 0 : borderWidthTiny,
              },
            ]}>
            <StyleText
              i18Text={itemContent?.title}
              customStyle={[$textTitle, {color: theme.gray_600}]}
            />
            <StyleText
              originValue={itemContent?.content}
              customStyle={$textContent}
            />
          </View>
        );
      })}
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  borderRadius: BORDER_RADIUS.f2,
  paddingHorizontal: scale(16),
};
const $boxContainer: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 12,
};
const $boxContainerColumn: ViewStyle = {
  width: '100%',
  paddingVertical: 12,
};
const $textTitle: TextStyle = {
  flex: 1,
};
const $textContent: TextStyle = {
  flex: 1,
  fontWeight: 'bold',
  textAlign: 'right',
};

export default BoxInformation;
