import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {calculatePriceDeposit, renderJoinStatus} from 'utility/assistant';
import {formatMoney, formatddddDDMMYYYY} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeJoinEstimate;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const ItemMeJoin = ({item, onPress, containerStyle}: Props) => {
  const theme = useTheme();

  const textAndColor = renderJoinStatus(item.status, theme);
  const priceDeposit = calculatePriceDeposit(item);

  return (
    <StyleTouchable
      style={[
        $itemMeJoin,
        {
          backgroundColor: theme.p_100,
        },
        containerStyle,
      ]}
      onPress={onPress}>
      <StyleText
        i18Text={textAndColor.text}
        customStyle={[
          $title,
          {color: theme.black, fontWeight: FONT_WEIGHT_MEDIUM},
        ]}
      />

      <StyleText customStyle={$textInfo}>
        <StyleText
          i18Text="discovery.amount"
          customStyle={[$title, {color: theme.gray_600}]}
        />
        <StyleText originValue={`: ${item?.amount}`} customStyle={$title} />
      </StyleText>

      <StyleText customStyle={$textInfo}>
        <StyleText
          i18Text="discovery.arrivalTime"
          customStyle={[$title, {color: theme.gray_600}]}
        />
        <StyleText
          originValue={`: ${formatddddDDMMYYYY(item?.time_will_buy)}`}
          customStyle={$title}
        />
      </StyleText>

      <StyleText customStyle={$textInfo}>
        <StyleText
          i18Text="discovery.nowPrice"
          customStyle={[$title, {color: theme.gray_600}]}
        />
        <StyleText
          originValue={`: ${formatMoney(priceDeposit.price)}`}
          customStyle={[$title, {fontWeight: 'bold', color: theme.green}]}
        />
      </StyleText>
    </StyleTouchable>
  );
};

const $itemMeJoin: ViewStyle = {
  borderRadius: BORDER_RADIUS.f2,
  paddingVertical: verticalScale(8),
  paddingHorizontal: scale(12),
  maxWidth: scale(300),
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f2,
};
const $textInfo: TextStyle = {
  marginTop: verticalScale(4),
};

export default memo(ItemMeJoin, (pre: Props, next: Props) => {
  return isEqual(pre, next);
});
