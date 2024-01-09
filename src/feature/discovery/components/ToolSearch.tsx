import {FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {horizontalPadding} from 'asset/metrics';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {borderWidthTiny, chooseTextTopic} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  numberPeople?: number;
  numberDays?: number;
  startPrice?: number;
  endPrice?: number;
  services?: number[];
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  isEditMode?: boolean;
}

const ToolSearch = ({
  numberPeople,
  numberDays,
  startPrice,
  endPrice,
  services,
  onPress,
  containerStyle,
  isEditMode = false,
}: Props) => {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <View style={[$container, containerStyle]}>
      <ScrollView
        horizontal
        contentContainerStyle={$contentToolView}
        showsHorizontalScrollIndicator={false}>
        {!!isEditMode && (
          <StyleTouchable onPress={onPress}>
            <StyleText
              i18Text="common.editFilter"
              customStyle={[
                $textEdit,
                {
                  color: theme.blue,
                },
              ]}
            />
          </StyleTouchable>
        )}

        {!!numberDays && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {
                borderColor: theme.black,
              },
            ]}
            onPress={onPress}>
            <StyleIcon
              source={Images.icons.username}
              size={11}
              customStyle={{tintColor: theme.gray_600}}
            />
            <StyleText
              originValue={`${numberDays} ${
                numberDays > 1 ? t('common.days') : t('common.day')
              }`}
              customStyle={[$textTool, {color: theme.black}]}
            />
          </StyleTouchable>
        )}

        {!!numberPeople && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {
                borderColor: theme.black,
              },
            ]}
            onPress={onPress}>
            <StyleIcon
              source={Images.icons.username}
              size={11}
              customStyle={{tintColor: theme.gray_600}}
            />
            <StyleText
              i18Text="discovery.valuePeople"
              i18Params={{
                value: numberPeople,
              }}
              customStyle={[$textTool, {color: theme.black}]}
            />
          </StyleTouchable>
        )}

        {(!!startPrice || !!endPrice) && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {
                borderColor: theme.black,
              },
            ]}
            onPress={onPress}>
            <StyleIcon
              source={Images.icons.price}
              size={11}
              customStyle={{tintColor: theme.gray_600}}
            />
            <StyleText
              originValue={`${formatLocaleNumber(
                String(startPrice),
              )} - ${formatLocaleNumber(String(endPrice))} vnd`}
              customStyle={[$textTool, {color: theme.black}]}
            />
          </StyleTouchable>
        )}

        {!!services?.length && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {
                borderColor: theme.black,
              },
            ]}
            onPress={onPress}>
            <StyleIcon
              source={Images.icons.category}
              size={11}
              customStyle={{tintColor: theme.gray_600}}
            />
            {services?.map((item, index) => {
              return (
                <StyleText
                  key={index}
                  i18Text={chooseTextTopic(item)}
                  customStyle={[$textTool, {color: theme.black}]}
                />
              );
            })}
          </StyleTouchable>
        )}
      </ScrollView>
    </View>
  );
};

const $container: ViewStyle = {
  width: '100%',
};
const $contentToolView: ViewStyle = {
  paddingHorizontal: horizontalPadding,
  gap: scale(8),
};
const $toolBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: verticalScale(4),
  borderRadius: 30,
  paddingHorizontal: scale(8),
  borderWidth: borderWidthTiny,
};
const $textTool: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginLeft: scale(4),
};
const $textEdit: TextStyle = {
  fontWeight: 'bold',
  marginRight: scale(12),
  textDecorationLine: 'underline',
};

export default ToolSearch;
