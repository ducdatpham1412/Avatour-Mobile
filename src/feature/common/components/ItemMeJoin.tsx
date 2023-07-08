import {BORDER_RADIUS} from 'asset';
import {GROUP_BUYING_STATUS} from 'asset/enum';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import React, {memo, useMemo} from 'react';
import isEqual from 'react-fast-compare';
import {TextStyle, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {formatddddDDMMYYYY} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeJoinPersonal;
  onPress: () => void;
}

const ItemMeJoin = ({item, onPress}: Props) => {
  const theme = useTheme();

  const textAndColor = useMemo(() => {
    let color = theme.black;
    let text: I18Normalize = 'common.null';
    if (
      item?.status === GROUP_BUYING_STATUS.notBought ||
      item?.status === GROUP_BUYING_STATUS.notBoughtButOvertime
    ) {
      color = theme.blue;
      text = 'profile.joining';
    }
    if (item?.status === GROUP_BUYING_STATUS.requestBought) {
      color = theme.red;
      text = 'profile.waitingConfirm';
    }
    if (item?.status === GROUP_BUYING_STATUS.bought) {
      color = theme.green;
      text = 'profile.joinedSuccess';
    }
    return {
      color,
      text,
    };
  }, [item?.status, theme]);

  return (
    <StyleTouchable
      customStyle={[
        $itemMeJoin,
        {
          borderColor: theme.gray_500,
          backgroundColor: theme.gray_50,
        },
      ]}
      onPress={onPress}>
      <StyleText
        i18Text={textAndColor.text}
        customStyle={[$title, {color: textAndColor.color}]}
      />

      <StyleText customStyle={$textInfo}>
        <StyleText i18Text="discovery.amount" customStyle={$title} />
        <StyleText originValue={`: ${item?.amount}`} />
      </StyleText>

      <StyleText customStyle={$textInfo}>
        <StyleText i18Text="discovery.arrivalTime" customStyle={$title} />
        <StyleText
          originValue={`: ${formatddddDDMMYYYY(item?.time_will_buy)}`}
        />
      </StyleText>

      <StyleText customStyle={$textInfo}>
        <StyleText i18Text="discovery.deposited" customStyle={$title} />
        <StyleText originValue={`: ${item?.deposit} vnd`} />
      </StyleText>

      <StyleText
        originValue={item?.note}
        numberOfLines={1}
        customStyle={[$textInfo, {color: theme.gray_600}]}
      />
    </StyleTouchable>
  );
};

const $itemMeJoin: ViewStyle = {
  borderRadius: BORDER_RADIUS.f2,
  borderWidth: borderWidthTiny,
  paddingVertical: verticalScale(8),
  paddingHorizontal: scale(8),
  marginLeft: scale(8),
  maxWidth: scale(300),
};
const $title: TextStyle = {
  fontWeight: 'bold',
};
const $textInfo: TextStyle = {
  marginTop: verticalScale(3),
};

export default memo(ItemMeJoin, (pre: Props, next: Props) => {
  return isEqual(pre, next);
});
