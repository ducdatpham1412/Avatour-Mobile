import {
  BORDER_RADIUS,
  FONT_SIZE,
  FONT_WEIGHT_MEDIUM,
  ratioImageSale,
} from 'asset';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import React, {memo, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {calculatePriceDeposit, detectFromStyle} from 'utility/assistant';
import {formatDDMMYYYY, formatMoney} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeJoinEstimate;
  containerStyle?: StyleProp<ViewStyle>;
  contentFontSize?: number;
}

const ItemJoinWithBanner = ({item, containerStyle, contentFontSize}: Props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const width = useRef(
    detectFromStyle(containerStyle, 'width') || defaultWidth,
  );
  const fontSize = useRef(contentFontSize || FONT_SIZE.f4);
  const [height, setHeight] = useState(
    typeof width.current === 'number' ? width.current * ratioImageSale : 0,
  );
  const priceDeposit = calculatePriceDeposit(item);

  return (
    <StyleTouchable
      customStyle={[
        $container,
        {backgroundColor: theme.white, borderColor: theme.blue_800},
        containerStyle,
        {width: width.current as number},
      ]}
      onPress={() =>
        push(ROOT_SCREEN.detailMeJoin, {
          estimateId: item.id,
          initValue: item,
          mode: 'see-detail',
        })
      }
      onLayout={({nativeEvent}) => {
        if (typeof width.current === 'string') {
          setHeight(nativeEvent.layout.width * ratioImageSale);
        }
      }}>
      <StyleImage
        source={{uri: item?.sale?.images?.[0]}}
        customStyle={{width: width.current as number, height}}
        defaultImageSource="image"
      />

      <View style={$informationView}>
        <StyleText
          originValue={item?.sale?.name}
          customStyle={$textName}
          numberOfLines={1}
        />
      </View>

      <View style={$informationView}>
        <StyleText
          originValue={`${t('discovery.arrivalTime')}: `}
          customStyle={{color: theme.gray_600, fontSize: fontSize.current}}
        />
        <StyleText
          originValue={formatDDMMYYYY(item?.time_will_buy)}
          customStyle={{fontSize: fontSize.current}}
          numberOfLines={1}
        />
      </View>

      <View style={$informationView}>
        <StyleText
          originValue={`${t('discovery.nowPrice')}: `}
          customStyle={{color: theme.gray_600, fontSize: fontSize.current}}
        />
        <StyleText
          originValue={formatMoney(priceDeposit?.price)}
          customStyle={[
            $textInfo,
            {color: theme.green, fontSize: fontSize.current},
          ]}
          numberOfLines={1}
        />
      </View>

      {/* <View style={$informationView}>
        <StyleText
          i18Text="profile.status"
          customStyle={[
            $textTitle,
            {color: theme.gray_600, fontSize: fontSize.current},
          ]}>
          <StyleText
            originValue=": "
            customStyle={[
              $textTitle,
              {color: theme.gray_600, fontSize: fontSize.current},
            ]}
          />
          <StyleText
            i18Text={status.text}
            customStyle={[
              $textTitle,
              {
                color: status.color,
                fontSize: fontSize.current,
                fontWeight: 'bold',
              },
            ]}
          />
        </StyleText>
      </View> */}
    </StyleTouchable>
  );
};

const defaultWidth = scale(172);
const $container: ViewStyle = {
  borderRadius: BORDER_RADIUS.f3,
  paddingBottom: scale(8),
  borderWidth: moderateScale(2),
};
const $informationView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(4),
  paddingHorizontal: scale(8),
};
const $textName: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $textInfo: TextStyle = {
  fontWeight: 'bold',
};

export default memo(ItemJoinWithBanner, (pre: Props, next: Props) => {
  if (!isEqual(pre.item, next.item)) {
    return false;
  }
  return true;
});
