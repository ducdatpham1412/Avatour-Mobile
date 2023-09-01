import {FONT_SIZE} from 'asset';
import {useTheme} from 'hook';
import React, {ReactNode, isValidElement} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';
import BoxView from './BoxView';
import {StyleText} from './base';
import {StyleTextProps} from './base/StyleText';

type TypeInfoContent = {
  iconRight?: ReactNode;
  title: I18Normalize;
  content: string;
  noteProps?: StyleTextProps;
  contentStyle?: StyleProp<TextStyle>;
};

interface Props {
  listInformation: Array<TypeInfoContent | Element | null>;
  containerStyle?: StyleProp<ViewStyle>;
  titleBoxFlex?: number;
}

const BoxInformation = ({
  listInformation,
  containerStyle,
  titleBoxFlex = 0.75,
}: Props) => {
  const theme = useTheme();

  return (
    <BoxView containerStyle={[$container, containerStyle]}>
      {listInformation.map((item, index) => {
        const shouldHaveBorder = !!listInformation[index + 1];

        if (isValidElement(item)) {
          return (
            <View
              key={index}
              style={[
                $boxContainerColumn,
                {
                  borderBottomColor: theme.gray_200,
                  borderBottomWidth: shouldHaveBorder ? borderWidthTiny : 0,
                },
              ]}>
              {item}
            </View>
          );
        }
        if (item === null) {
          return <View key={index} />;
        }
        const itemContent: TypeInfoContent = item as TypeInfoContent;

        return (
          <View
            key={index}
            style={[
              $box,
              {
                borderBottomColor: theme.gray_300,
                borderBottomWidth: shouldHaveBorder ? borderWidthTiny : 0,
              },
            ]}>
            <View style={$boxContainer}>
              <View style={[$leftView, {flex: titleBoxFlex}]}>
                <StyleText
                  i18Text={itemContent?.title}
                  customStyle={$textTitle}
                />
              </View>
              <StyleText
                originValue={itemContent?.content}
                customStyle={[
                  $textContent,
                  {marginRight: itemContent?.iconRight ? scale(4) : 0},
                  itemContent.contentStyle,
                ]}
              />
              {itemContent?.iconRight}
            </View>
            {!!itemContent.noteProps && (
              <StyleText
                {...itemContent.noteProps}
                customStyle={[
                  $textNote,
                  {color: theme.gray_500},
                  itemContent.noteProps.customStyle,
                ]}
              />
            )}
          </View>
        );
      })}
    </BoxView>
  );
};

const $container: ViewStyle = {
  paddingVertical: 0,
};
const $box: ViewStyle = {
  width: '100%',
  paddingVertical: verticalScale(12),
};
const $boxContainer: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
};
const $leftView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $boxContainerColumn: ViewStyle = {
  width: '100%',
  paddingVertical: verticalScale(12),
};
const $textTitle: TextStyle = {
  flex: 1,
};
const $textContent: TextStyle = {
  flex: 1,
  fontWeight: 'bold',
  textAlign: 'right',
};
const $textNote: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginTop: verticalScale(4),
};

export default BoxInformation;
