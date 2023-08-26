import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React, {ReactElement, memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {renderJoinStatus} from 'utility/assistant';
import {formatDDMMMMYY, formatMoney} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  item: TypeJoinPersonalAndSale;
  containerStyle?: StyleProp<ViewStyle>;
  bottomComponent?: ReactElement;
  onPressMode?: AppParamsList[ROOT_SCREEN.detailMeJoin]['mode'];
  showDeposited?: boolean;
}

const ItemJoin = ({
  item,
  containerStyle,
  bottomComponent,
  onPressMode,
  showDeposited,
}: Props) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const status = renderJoinStatus(item.status, theme);

  return (
    <StyleTouchable
      customStyle={[$container, {backgroundColor: theme.white}, containerStyle]}
      onPress={() => {
        if (onPressMode) {
          push(ROOT_SCREEN.detailMeJoin, {
            saleId: item.sale_id,
            joinPersonal: {
              id: item.id,
              group_id: item.group_id,
              sale_id: item.sale_id,
              deposit: item.deposit,
              price: item.price,
              amount: item.amount,
              time_will_buy: item.time_will_buy,
              note: item.note,
              creator: profile.id,
              creator_name: profile.name,
              creator_avatar: profile.avatar,
              created: item.created,
              status: item.status,
            },
            mode: onPressMode,
          });
        }
      }}>
      <View style={$top}>
        <StyleText
          originValue={item?.sale?.creator_name}
          customStyle={$textName}
          numberOfLines={1}
        />
        <StyleText
          originValue={formatMoney(item.price)}
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
              customStyle={[$textInfo, {color: status.color}]}
            />
          </View>
        </View>
      </View>

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
              originValue={formatMoney(item?.deposit)}
              numberOfLines={1}
              customStyle={$textBold}
            />
          </View>

          <View style={$informationView}>
            <StyleText
              i18Text="discovery.moneyToPay"
              customStyle={{color: theme.gray_600}}>
              <StyleText
                originValue=": "
                customStyle={{color: theme.gray_600}}
              />
            </StyleText>
            <StyleText
              originValue={formatMoney(item?.price - item?.deposit)}
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
  paddingHorizontal: scale(8),
  paddingVertical: verticalScale(8),
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

export default memo(ItemJoin, (pre: Props, next: Props) => {
  if (!isEqual(pre, next)) {
    return false;
  }
  return true;
});
