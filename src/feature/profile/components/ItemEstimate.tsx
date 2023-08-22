import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageSale,
} from 'asset';
import {TextCountDown} from 'components';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {Avatar} from 'components/common';
import dayjs from 'dayjs';
import {useDetailSale} from 'feature/common/hooks';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {formatMoney} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeJoinEstimate;
  containerStyle?: StyleProp<ViewStyle>;
}

const ItemEstimate = ({item, containerStyle}: Props) => {
  const theme = useTheme();
  const [{data}] = useDetailSale(item.sale_id, {revalidateAll: false});

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {backgroundColor: theme.white, borderColor: theme.p_600},
        containerStyle,
      ]}
      onPress={() =>
        push(ROOT_SCREEN.detailMeJoin, {
          saleId: item.sale_id,
          mode: 'go-to-deposit-from-profile',
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

      <View style={$creatorView}>
        <Avatar source={{uri: data?.creator_avatar}} size={17} />
        <StyleText
          originValue={data?.creator_name}
          customStyle={$textCreator}
        />
      </View>

      <StyleText numberOfLines={1} customStyle={$textContent}>
        <StyleText
          i18Text="discovery.estimatedPrice"
          customStyle={[$text, {fontWeight: FONT_WEIGHT_MEDIUM}]}
        />
        <StyleText
          originValue={` ${formatMoney(item?.price)}`}
          customStyle={$text}
        />
      </StyleText>

      <StyleText numberOfLines={1} customStyle={$textContent}>
        <StyleText
          i18Text="discovery.deposit"
          customStyle={[$text, {fontWeight: FONT_WEIGHT_MEDIUM}]}
        />
        <StyleText
          originValue={` ${formatMoney(item?.deposit)}`}
          customStyle={$text}
        />
      </StyleText>

      <StyleText numberOfLines={1} customStyle={$textContent}>
        <StyleText
          i18Text="discovery.remainingTime"
          customStyle={[$text, {fontWeight: FONT_WEIGHT_MEDIUM}]}>
          <StyleText
            originValue=": "
            customStyle={[$text, {fontWeight: FONT_WEIGHT_MEDIUM}]}
          />
        </StyleText>
        <TextCountDown
          initSeconds={dayjs(item.expired).diff(dayjs(), 'seconds')}
          style={$text}
        />
      </StyleText>

      {!data?.name && <StyleText originValue="" customStyle={$textName} />}

      <View style={[$button, {backgroundColor: theme.p_600}]}>
        <StyleText
          i18Text="discovery.goToDeposit"
          customStyle={[$text, {fontWeight: FONT_WEIGHT_MEDIUM}]}
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
  paddingHorizontal: scale(4),
  fontSize: FONT_SIZE.f4,
  marginTop: verticalScale(4),
  fontWeight: 'bold',
  height: FONT_SIZE.f4 + moderateScale(5),
};
const $creatorView: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(4),
  marginTop: verticalScale(4),
  flexDirection: 'row',
  alignItems: 'center',
};
const $textCreator: TextStyle = {
  fontSize: FONT_SIZE.f4,
  marginLeft: scale(4),
};
const $textContent: TextStyle = {
  width: '100%',
  paddingHorizontal: scale(4),
  fontSize: FONT_SIZE.f4,
  marginTop: verticalScale(4),
};
const $text: TextStyle = {
  fontSize: FONT_SIZE.f4,
};
const $button: ViewStyle = {
  width: '70%',
  paddingVertical: verticalScale(5),
  alignSelf: 'center',
  borderRadius: BORDER_RADIUS.f3,
  marginTop: verticalScale(4),
  alignItems: 'center',
};

export default memo(ItemEstimate, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  return true;
});
