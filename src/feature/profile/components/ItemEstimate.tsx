import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageSale,
} from 'asset';
import {TextCountDown} from 'components';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import dayjs from 'dayjs';
import {useDetailSale} from 'feature/common/hooks';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {calculatePriceDeposit} from 'utility/assistant';
import {formatMoney} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeJoinEstimate;
  containerStyle?: StyleProp<ViewStyle>;
}

const ItemEstimate = ({item, containerStyle}: Props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [{data}] = useDetailSale(item.sale.id, {revalidateAll: false});
  const priceDeposit = calculatePriceDeposit(item);

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {backgroundColor: theme.white, borderColor: theme.p_600},
        containerStyle,
      ]}
      onPress={() =>
        push(ROOT_SCREEN.detailMeJoin, {
          estimateId: item.id,
          initValue: item,
          mode: 'see-detail',
        })
      }>
      <StyleImage
        source={{uri: data?.images?.[0]}}
        customStyle={$image}
        defaultImageSource="image"
      />
      {!!data?.name && (
        <StyleText
          originValue={data?.name}
          customStyle={$textName}
          numberOfLines={1}
        />
      )}

      <StyleText numberOfLines={1} customStyle={$textContent}>
        <StyleText
          originValue={`${t('discovery.nowPrice')}: `}
          customStyle={[$title, {color: theme.gray_600}]}
        />
        <StyleText
          originValue={formatMoney(priceDeposit.price)}
          customStyle={[$text, {color: theme.green, fontWeight: 'bold'}]}
        />
      </StyleText>

      <StyleText numberOfLines={1} customStyle={$textContent}>
        <StyleText
          originValue={`${t('discovery.deposit')}: `}
          customStyle={[$title, {color: theme.gray_600}]}
        />
        <StyleText
          originValue={formatMoney(priceDeposit.deposit)}
          customStyle={$text}
        />
      </StyleText>

      <StyleText numberOfLines={1} customStyle={$textContent}>
        <StyleText
          originValue={`${t('discovery.remainingTime')}: `}
          customStyle={[$title, {color: theme.gray_600}]}
        />
        <TextCountDown
          initSeconds={dayjs(item.expired).diff(dayjs(), 'seconds')}
          style={$text}
        />
      </StyleText>

      <View style={[$button, {backgroundColor: theme.p_600}]}>
        <StyleText
          i18Text="discovery.goToDeposit"
          customStyle={[$text, {fontWeight: 'bold', color: theme.white}]}
        />
      </View>
    </StyleTouchable>
  );
};

const defaultWidth = scale(172);
const $container: ViewStyle = {
  width: defaultWidth,
  borderRadius: BORDER_RADIUS.f3,
  paddingBottom: scale(8),
  borderWidth: moderateScale(2),
};
const $image: ImageStyle = {
  width: defaultWidth,
  height: defaultWidth * ratioImageSale,
};
const $textName: TextStyle = {
  width: '100%',
  paddingHorizontal: scale(8),
  marginTop: verticalScale(4),
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $textContent: TextStyle = {
  width: '100%',
  paddingHorizontal: scale(8),
  marginTop: verticalScale(4),
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f4,
};
const $text: TextStyle = {
  fontSize: FONT_SIZE.f4,
};
const $button: ViewStyle = {
  width: '70%',
  paddingVertical: verticalScale(8),
  borderRadius: 30,
  marginTop: verticalScale(8),
  alignSelf: 'center',
  alignItems: 'center',
};

export default memo(ItemEstimate, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  return true;
});
