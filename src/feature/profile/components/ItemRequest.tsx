import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {APP_EVENT, TYPE_AUTH_REQUEST} from 'asset/enum';
import Images from 'asset/img/images';
import {BoxInformation} from 'components';
import {
  StyleButton,
  StyleIcon,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {Avatar} from 'components/common';
import {BoxUpdatePrice} from 'feature/common/components';
import {emitAppEvent, useTheme} from 'hook';
import {push} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {TextStyle, View, ViewStyle} from 'react-native';
import {onGoToProfile} from 'utility/assistant';
import {formatddddDDMMYYYY} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {useMyRequests} from '../hooks';

interface Props {
  item: TypeGetRequestResponse;
}

const ItemRequest = ({item}: Props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [{isCanceling}, {onDeleteRequest}] = useMyRequests();

  const content = (type: number) => {
    if (type === TYPE_AUTH_REQUEST.upgrade_to_shop) {
      return t('profile.upgradeToShop');
    }
    if (type === TYPE_AUTH_REQUEST.update_bank) {
      return t('profile.updateBankAccount');
    }
    if (type === TYPE_AUTH_REQUEST.update_price) {
      return t('discovery.updatePrice');
    }
    if (type === TYPE_AUTH_REQUEST.suggest_location) {
      return t('discovery.suggestNewLocation');
    }
    return t('common.null');
  };

  const renderData = () => {
    if (item.type === TYPE_AUTH_REQUEST.update_bank) {
      return (
        <View style={[$upgradeAccount, {backgroundColor: theme.gray_50}]}>
          <StyleText
            originValue={`${t('profile.bankName')}: ${item.data.bank_code}`}
          />
          <StyleText
            originValue={`${t('profile.accountNumber')}: ${
              item.data.bank_account
            }`}
          />
        </View>
      );
    }

    if (item.type === TYPE_AUTH_REQUEST.update_price) {
      return (
        <StyleTouchable
          customStyle={[$upgradeAccount, {backgroundColor: theme.gray_50}]}
          onPress={() => {
            if (item.data.sale.id) {
              push(ROOT_SCREEN.detailSale, {
                saleId: item.data?.sale?.id,
              });
            }
          }}>
          <View style={$updatePrice}>
            <Avatar source={{uri: item.data.sale.images?.[0]}} size={35} />
            <View style={$name}>
              <StyleText
                originValue={item.data?.sale?.name}
                customStyle={$textName}
              />
              <View style={$location}>
                <StyleText
                  originValue={item.data?.sale?.name}
                  customStyle={[$textLocation, {color: theme.gray_500}]}
                />
              </View>
            </View>
          </View>

          <BoxUpdatePrice
            prices={item.data?.prices}
            containerStyle={{marginTop: verticalScale(4)}}
          />
        </StyleTouchable>
      );
    }

    if (item.type === TYPE_AUTH_REQUEST.suggest_location) {
      return (
        <View style={$data}>
          <StyleTouchable
            customStyle={[$suggestLocation, {backgroundColor: theme.gray_50}]}
            onPress={() => onGoToProfile(item.data.id)}>
            <Avatar source={{uri: item.data.avatar}} size={35} />
            <View style={$name}>
              <StyleText originValue={item.data.name} customStyle={$textName} />
              <View style={$location}>
                <StyleIcon
                  source={Images.icons.location}
                  size={12}
                  tintColor={theme.gray_500}
                />
                <StyleText
                  originValue={item.data?.location}
                  customStyle={[$textLocation, {color: theme.gray_500}]}
                />
              </View>
            </View>
          </StyleTouchable>
        </View>
      );
    }

    if (item.type === TYPE_AUTH_REQUEST.upgrade_to_shop) {
      return (
        <View style={[$upgradeAccount, {backgroundColor: theme.gray_100}]}>
          <StyleText
            originValue={`${t('discovery.name')}: ${item.data.name}`}
          />
          <StyleText
            originValue={`${t('profile.address')}: ${item.data.location}`}
          />
          <StyleText originValue={`${t('login.phone')}: ${item.data.phone}`} />
          <StyleText
            originValue={`${t('profile.bankName')}: ${item.data.bank_code}`}
          />
          <StyleText
            originValue={`${t('profile.accountNumber')}: ${
              item.data?.bank_account
            }`}
          />
        </View>
      );
    }

    return null;
  };

  const onDelete = () => {
    const agree = async () => {
      try {
        await onDeleteRequest(item.id);
        if (item.type === TYPE_AUTH_REQUEST.suggest_location) {
          emitAppEvent(APP_EVENT.suggestLocation, {
            locationId: item.data?.id,
            event: 'delete-suggest',
          });
        }
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      }
    };

    ModalAlert.options({
      i18Content: 'profile.post.sureDeletePost',
      onContinue: agree,
    });
  };

  return (
    <BoxInformation
      listInformation={[
        {
          title: 'common.type',
          content: content(item?.type),
        },
        {
          title: 'profile.created',
          content: formatddddDDMMYYYY(item?.created),
          contentStyle: {fontWeight: 'normal'},
        },
        renderData(),
        <View style={$cancel}>
          <StyleButton
            containerStyle={[$button, {borderColor: theme.black}]}
            titleStyle={{color: theme.black}}
            title="common.delete"
            onPress={onDelete}
            isLoading={isCanceling}
          />
        </View>,
      ]}
      titleBoxFlex={0.3}
    />
  );
};

const $cancel: ViewStyle = {
  width: '100%',
  alignItems: 'center',
};
const $button: ViewStyle = {
  width: scale(150),
  backgroundColor: 'transparent',
  borderWidth: moderateScale(0.5),
};
// Suggest location
const $data: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
};
const $suggestLocation: ViewStyle = {
  maxWidth: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(12),
  borderRadius: BORDER_RADIUS.f3,
};
const $name: ViewStyle = {
  marginLeft: scale(4),
};
const $location: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(2),
};
const $textName: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $textLocation: TextStyle = {
  fontSize: FONT_SIZE.f4,
  marginLeft: scale(4),
};
const $upgradeAccount: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(12),
  borderRadius: BORDER_RADIUS.f3,
};
const $updatePrice: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
};

export default memo(ItemRequest, (pre: Props, next: Props) => {
  return isEqual(pre.item, next.item);
});
