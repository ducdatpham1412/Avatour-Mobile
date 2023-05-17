import {FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {ScrollView, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {borderWidthTiny, chooseTextTopic} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  location: string;
  numberPeople?: number;
  startPrice?: number;
  endPrice?: number;
  services?: number[];
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  isEditMode?: boolean;
}

const ToolSearch = ({
  location,
  numberPeople,
  startPrice,
  endPrice,
  services,
  onPress,
  containerStyle,
  isEditMode = false,
}: Props) => {
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
        {!!location && (
          <StyleTouchable
            customStyle={[$toolBox, {borderColor: theme.gray_600}]}
            onPress={onPress}>
            <StyleIcon
              source={Images.icons.location}
              size={11}
              customStyle={{tintColor: theme.gray_600}}
            />
            <StyleText
              originValue={location}
              customStyle={[$textTool, {color: theme.gray_600}]}
            />
          </StyleTouchable>
        )}

        {!!numberPeople && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {borderColor: theme.gray_600, marginLeft: scale(8)},
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
              customStyle={[$textTool, {color: theme.gray_600}]}
            />
          </StyleTouchable>
        )}

        {(!!startPrice || !!endPrice) && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {marginLeft: scale(8), borderColor: theme.gray_600},
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
              customStyle={[$textTool, {color: theme.gray_600}]}
            />
          </StyleTouchable>
        )}

        {!!services?.length && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {marginLeft: scale(8), borderColor: theme.gray_600},
            ]}
            onPress={onPress}>
            <StyleIcon
              source={Images.icons.category}
              size={11}
              customStyle={{tintColor: theme.gray_600}}
            />
            {services?.map(item => {
              return (
                <StyleText
                  key={item}
                  i18Text={chooseTextTopic(item)}
                  customStyle={[$textTool, {color: theme.gray_600}]}
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
  paddingHorizontal: scale(12),
};
const $toolBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: verticalScale(2),
  borderWidth: borderWidthTiny,
  paddingHorizontal: scale(8),
  borderRadius: 30,
};
const $textTool: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginLeft: scale(7),
};
const $textEdit: TextStyle = {
  fontWeight: 'bold',
  marginRight: scale(12),
  textDecorationLine: 'underline',
};

export default ToolSearch;
