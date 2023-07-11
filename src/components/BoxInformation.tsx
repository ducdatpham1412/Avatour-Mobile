import {useTheme} from 'hook';
import React, {ReactNode, isValidElement} from 'react';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';
import BoxView from './BoxView';
import {StyleText} from './base';

type TypeInfoContent = {
  iconRight?: ReactNode;
  title: I18Normalize;
  content: string;
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
        const isLatest = index === listInformation.length - 1;
        if (isValidElement(item)) {
          return (
            <View
              key={index}
              style={[
                $boxContainerColumn,
                {
                  borderBottomColor: theme.gray_200,
                  borderBottomWidth: isLatest ? 0 : borderWidthTiny,
                },
              ]}>
              {item}
            </View>
          );
        }
        if (item === null) {
          return null;
        }
        const itemContent: TypeInfoContent = item as TypeInfoContent;

        return (
          <View
            key={index}
            style={[
              $boxContainer,
              {
                borderBottomColor: theme.gray_200,
                borderBottomWidth: isLatest ? 0 : borderWidthTiny,
              },
            ]}>
            <View style={[$leftView, {flex: titleBoxFlex}]}>
              <StyleText
                i18Text={itemContent?.title}
                customStyle={[
                  $textTitle,
                  {
                    color: theme.gray_600,
                  },
                ]}
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
        );
      })}
    </BoxView>
  );
};

const $container: ViewStyle = {
  paddingVertical: 0,
};
const $boxContainer: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: verticalScale(12),
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

export default BoxInformation;
