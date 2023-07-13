import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {
  StyleButton,
  StyleImage,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar} from 'components/common';
import {useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import React, {isValidElement, memo} from 'react';
import isEqual from 'react-fast-compare';
import {ImageStyle, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {borderWidthTiny, renderJoinStatus} from 'utility/assistant';
import {formatDDMMMMYY, formatMoney} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';
import {useJoinResult} from '../hooks';

interface Props {
  item: TypeJoinPersonalAndSale;
  containerStyle?: StyleProp<ViewStyle>;
  bottomComponent?: 'button-confirm-join' | 'join-status' | Element;
  onPressMode?: AppParamsList[ROOT_SCREEN.detailMeJoin]['mode'];
}

interface ButtonConfirmProps {
  item: TypeJoinPersonalAndSale;
}

const ButtonConfirm = ({item}: ButtonConfirmProps) => {
  const theme = useTheme();

  const [{loadingRequestBought}, {requestBought}] = useJoinResult(
    item.sale.creator,
    {
      joinId: item.id,
    },
  );

  const onRequestBought = () => {
    const agree = async () => {
      try {
        await requestBought({
          list_joins_id: [item.id],
        });
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    };

    ModalAlert.options({
      i18Content: 'alert.beSureConfirmWhenInStore',
      onContinue: agree,
    });
  };

  return (
    <StyleButton
      containerStyle={$button}
      onPress={onRequestBought}
      title="discovery.confirmArrived"
      titleStyle={{color: theme.black, fontWeight: FONT_WEIGHT_MEDIUM}}
      isLoading={loadingRequestBought}
    />
  );
};

const ItemJoin = ({
  item,
  containerStyle,
  bottomComponent,
  onPressMode,
}: Props) => {
  const theme = useTheme();
  const {profile} = useAppSelector(state => state.accountSlice.passport);

  const renderBottomComponent = () => {
    if (bottomComponent === 'button-confirm-join') {
      return <ButtonConfirm item={item} />;
    }
    if (bottomComponent === 'join-status') {
      const temp = renderJoinStatus(item.status, theme);
      return (
        <StyleText
          i18Text="profile.status"
          customStyle={[$textStatus, {color: theme.gray_600}]}>
          <StyleText originValue=": " customStyle={{color: theme.gray_600}} />
          <StyleText
            i18Text={temp.text}
            customStyle={{fontWeight: 'bold', color: temp.color}}
          />
        </StyleText>
      );
    }
    if (isValidElement(bottomComponent)) {
      return bottomComponent;
    }
    return null;
  };

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
      <View style={$informationView}>
        <Avatar source={{uri: item?.sale?.creator_avatar}} size={20} />
        <StyleText
          originValue={item?.sale?.name}
          customStyle={$textName}
          numberOfLines={1}
        />
      </View>

      <View style={$informationView}>
        <StyleText
          i18Text="discovery.price"
          customStyle={{color: theme.gray_600}}>
          <StyleText originValue=": " customStyle={{color: theme.gray_600}} />
        </StyleText>
        <StyleText
          originValue={formatMoney(item?.price)}
          numberOfLines={1}
          customStyle={$textBold}
        />
      </View>

      <View style={$informationView}>
        <StyleText
          i18Text="discovery.deposited"
          customStyle={{color: theme.gray_600}}>
          <StyleText originValue=": " customStyle={{color: theme.gray_600}} />
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
          <StyleText originValue=": " customStyle={{color: theme.gray_600}} />
        </StyleText>
        <StyleText
          originValue={formatMoney(item?.price - item?.deposit)}
          numberOfLines={1}
          customStyle={[$textBold, {color: theme.red}]}
        />
      </View>

      <View style={$informationView}>
        <StyleImage
          source={{uri: item?.sale?.images?.[0]}}
          customStyle={$imageSale}
        />
        <View style={$saleInfo}>
          <StyleText
            i18Text="discovery.amount"
            customStyle={[$textInfo, {color: theme.gray_600}]}>
            <StyleText
              originValue=": "
              customStyle={[$textInfo, {color: theme.gray_600}]}
            />
            <StyleText originValue={item.amount} customStyle={$textInfo} />
          </StyleText>

          <View style={[$informationView, {marginTop: verticalScale(4)}]}>
            <StyleText
              i18Text="discovery.arrivalTime"
              customStyle={[$textInfo, {color: theme.gray_600}]}>
              <StyleText
                originValue=": "
                customStyle={[$textInfo, {color: theme.gray_600}]}
              />
            </StyleText>
            <StyleText
              originValue={formatDDMMMMYY(item?.time_will_buy)}
              numberOfLines={1}
              customStyle={$textInfo}
            />
          </View>
        </View>
      </View>

      {renderBottomComponent()}
    </StyleTouchable>
  );
};

const $container: ViewStyle = {
  width: '100%',
  borderRadius: BORDER_RADIUS.f3,
  paddingHorizontal: scale(8),
  paddingBottom: verticalScale(8),
};
const $informationView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(8),
};
const $textName: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  marginLeft: scale(8),
  fontSize: FONT_SIZE.f1,
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
const $button: ViewStyle = {
  marginTop: verticalScale(12),
  width: scale(230),
  paddingHorizontal: scale(20),
  backgroundColor: 'transparent',
  borderWidth: borderWidthTiny,
};
const $textStatus: ViewStyle = {
  marginTop: verticalScale(8),
};

export default memo(ItemJoin, (pre: Props, next: Props) => {
  if (!isEqual(pre, next)) {
    return false;
  }
  return true;
});
