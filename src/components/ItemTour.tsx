import {BORDER_RADIUS, FONT_SIZE, ratioImageTour} from 'asset';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {formatLocaleNumber} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';
import {StyleImage, StyleText, StyleTouchable} from './base';
import {Avatar} from './common';

interface Props {
  item: Tour;
  containerStyle?: StyleProp<ViewStyle>;
  width?: number;
  fontSize?: number;
}

const ItemTour = ({
  item,
  containerStyle,
  width = scale(343),
  fontSize = FONT_SIZE.f2,
}: Props) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const listImages: string[] = item.schedule?.reduce((pre, current) => {
    return pre.concat(...current);
  }, []);
  const textPeople = (
    item.number_people > 1 ? t('discovery.people') : t('discovery.person')
  ).toLocaleLowerCase();

  return (
    <StyleTouchable
      customStyle={[$container, containerStyle, {width}]}
      onPress={() => {
        push(ROOT_SCREEN.detailTour, {
          tourId: item.id,
        });
      }}>
      <StyleImage
        source={{uri: listImages?.[0]}}
        customStyle={[$image, {width, height: width * ratioImageTour}]}
        defaultImageSource="image"
      />
      {!!item.name && (
        <StyleText
          originValue={item?.name}
          customStyle={[$name, {fontSize}]}
          numberOfLines={2}
        />
      )}
      <StyleText
        originValue={`<b>${formatLocaleNumber(
          item.start_price,
        )} - ${formatLocaleNumber(item.end_price)} vnd</b> | ${
          item.number_people
        } ${textPeople}`}
        mode="html"
        htmlTextBoldColor={theme.p_800}
        customStyle={[$price, {fontSize}]}
      />
      <View style={$creator}>
        <Avatar
          source={{uri: item.creator_avatar}}
          size={(20 / 16) * fontSize}
        />
        <StyleText
          originValue={item.creator_name}
          customStyle={[$nameCreator, {fontSize}]}
          numberOfLines={1}
        />
      </View>
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: scale(343),
  overflow: 'hidden',
};
const $image: ImageStyle = {
  borderRadius: BORDER_RADIUS.f2,
};
const $name: TextStyle = {
  marginTop: verticalScale(4),
  fontWeight: 'bold',
  paddingHorizontal: scale(2),
};
const $price: TextStyle = {
  marginTop: verticalScale(4),
  paddingHorizontal: scale(2),
};
const $creator: ViewStyle = {
  marginTop: verticalScale(4),
  paddingHorizontal: scale(2),
  flexDirection: 'row',
  alignItems: 'center',
};
const $nameCreator: TextStyle = {
  marginLeft: scale(4),
};

export default memo(ItemTour, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  if (__DEV__ && !isEqual(pre.containerStyle, next.containerStyle)) {
    return false;
  }
  return true;
});
