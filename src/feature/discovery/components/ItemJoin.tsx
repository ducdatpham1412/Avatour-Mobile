import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {verticalMargin} from 'asset/metrics';
import {
  StyleButton,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React, {ReactElement, memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {calculatePriceDeposit, renderJoinStatus} from 'utility/assistant';
import {formatDDMMMMYY, formatMoney} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';
import {canSupplierConfirmBought} from 'utility/validate';

interface Props {
  item: TypeJoinEstimate;
  containerStyle?: StyleProp<ViewStyle>;
  bottomComponent?: ReactElement;
  onPressMode?: AppParamsList[ROOT_SCREEN.detailMeJoin]['mode'];
  showDeposited?: boolean;
  mode?: 'consumer' | 'supplier';
  onConfirmBought?: () => void;
}

const ItemJoin = ({
  item,
  containerStyle,
  bottomComponent,
  onPressMode,
  showDeposited,
  mode = 'consumer',
  onConfirmBought,
}: Props) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const status = renderJoinStatus(item.status, theme);
  const priceDeposit = calculatePriceDeposit(item);

  return (
    <StyleTouchable
      customStyle={[$container, {backgroundColor: theme.white}, containerStyle]}
      onPress={() => {
        if (onPressMode) {
          push(ROOT_SCREEN.detailMeJoin, {
            estimateId: item.id,
            initValue: item,
            mode: onPressMode,
          });
        }
      }}>
      <View style={$top}>
        <StyleText
          originValue={
            mode === 'consumer' ? item?.sale?.creator_name : item.creator_name
          }
          customStyle={$textName}
          numberOfLines={1}
        />
        <StyleText
          originValue={formatMoney(priceDeposit.price)}
          customStyle={$textBold}
        />
      </View>

      <View style={$informationView}>
        <StyleImage
          source={{uri: item?.sale?.images?.[0]}}
          customStyle={$imageSale}
        />
        <View style={$saleInfo}>
          <View style={$nameAndAmount}>
            <StyleText
              originValue={item.sale.name}
              customStyle={[$textInfo, {maxWidth: scale(200)}]}
              numberOfLines={1}
            />
            <StyleText
              originValue={`  x ${item.amount}`}
              customStyle={$textInfo}
            />
          </View>

          <View style={[$informationView, {marginTop: verticalScale(4)}]}>
            <StyleText
              originValue={formatDDMMMMYY(item?.time_will_buy)}
              numberOfLines={1}
              customStyle={$textInfo}
            />
            <StyleText
              originValue={` - ${t(status.text)}`}
              customStyle={[
                $textInfo,
                {color: status.color, fontWeight: FONT_WEIGHT_MEDIUM},
              ]}
            />
          </View>
        </View>
      </View>

      {mode === 'supplier' && (
        <>
          <View style={$informationView}>
            <StyleText
              originValue={`${t('discovery.transactionHash')}: `}
              customStyle={{color: theme.gray_600}}
            />
            <StyleText
              originValue={item.hash}
              customStyle={{fontWeight: FONT_WEIGHT_MEDIUM}}
            />
          </View>

          {canSupplierConfirmBought(item?.status) && (
            <StyleButton
              title="discovery.confirmBought"
              onPress={onConfirmBought}
              containerStyle={$buttonConfirmBought}
            />
          )}
        </>
      )}

      {showDeposited && (
        <>
          <View style={$informationView}>
            <StyleText
              i18Text="discovery.deposited"
              customStyle={{color: theme.gray_600}}>
              <StyleText
                originValue=": "
                customStyle={{color: theme.gray_600}}
              />
            </StyleText>
            <StyleText
              originValue={formatMoney(priceDeposit.deposit)}
              numberOfLines={1}
              customStyle={$textBold}
            />
          </View>

          <View style={[$informationView, {marginTop: 4}]}>
            <StyleText
              i18Text="discovery.moneyToPay"
              customStyle={{color: theme.gray_600}}>
              <StyleText
                originValue=": "
                customStyle={{color: theme.gray_600}}
              />
            </StyleText>
            <StyleText
              originValue={formatMoney(
                priceDeposit.price - priceDeposit.deposit,
              )}
              numberOfLines={1}
              customStyle={[$textBold, {color: theme.red}]}
            />
          </View>
        </>
      )}

      {bottomComponent}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  borderRadius: BORDER_RADIUS.f3,
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(16),
};
const $top: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const $nameAndAmount: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $informationView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(8),
};
const $textName: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  maxWidth: scale(200),
};
const $textBold: TextStyle = {
  fontWeight: 'bold',
};
const $imageSale: ImageStyle = {
  width: scale(50),
  height: scale(50),
  borderRadius: BORDER_RADIUS.f4,
};
const $saleInfo: ViewStyle = {
  flex: 1,
  paddingLeft: scale(8),
};
const $textInfo: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $buttonConfirmBought: ViewStyle = {
  marginTop: verticalMargin,
};

export default memo(ItemJoin, (pre: Props, next: Props) => {
  if (!isEqual(pre, next)) {
    return false;
  }
  return true;
});
