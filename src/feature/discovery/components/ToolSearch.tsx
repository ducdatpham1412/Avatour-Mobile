import {FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {ScrollView, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {borderWidthTiny, chooseTextTopic} from 'utility/assistant';
import {formatLocaleNumber} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  location: string;
  numberPeople?: number;
  startPrice?: number;
  endPrice?: number;
  services?: number[];
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  isEditMode?: boolean;
  haveBorder?: boolean;
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
  haveBorder = true,
}: Props) => {
  const theme = useTheme();

  const borderWidth = haveBorder ? borderWidthTiny : 0;
  const paddingLeft = haveBorder ? scale(8) : 0;
  const paddingRight = haveBorder ? scale(8) : scale(2);

  const renderIndicator = () => {
    return (
      <View
        style={[
          $indicator,
          {
            borderRightColor: theme.gray_600,
            borderRightWidth: haveBorder ? 0 : moderateScale(1),
            marginHorizontal: haveBorder ? scale(4) : scale(8),
          },
        ]}
      />
    );
  };

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
            customStyle={[
              $toolBox,
              {
                borderColor: theme.gray_600,
                borderWidth,
                paddingLeft,
                paddingRight,
              },
            ]}
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

        {renderIndicator()}

        {!!numberPeople && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {
                borderColor: theme.gray_600,
                borderWidth,
                paddingLeft,
                paddingRight,
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
              customStyle={[$textTool, {color: theme.gray_600}]}
            />
          </StyleTouchable>
        )}

        {renderIndicator()}

        {(!!startPrice || !!endPrice) && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {
                borderColor: theme.gray_600,
                borderWidth,
                paddingLeft,
                paddingRight,
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
              customStyle={[$textTool, {color: theme.gray_600}]}
            />
          </StyleTouchable>
        )}

        {renderIndicator()}

        {!!services?.length && (
          <StyleTouchable
            customStyle={[
              $toolBox,
              {
                borderColor: theme.gray_600,
                borderWidth,
                paddingLeft,
                paddingRight,
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
  borderRadius: 30,
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
const $indicator: ViewStyle = {
  height: verticalScale(16),
  alignSelf: 'center',
};

export default ToolSearch;
