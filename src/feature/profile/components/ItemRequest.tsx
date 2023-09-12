import {TypeGetRequestResponse} from 'api/interface';
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
  item: TypeGetRequestResponse<keyof typeof TYPE_AUTH_REQUEST>;
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
      const data =
        item.data as unknown as TypeGetRequestResponse<'update_bank'>['data'];

      return (
        <View style={[$upgradeAccount, {backgroundColor: theme.gray_50}]}>
          <StyleText
            originValue={`${t('profile.bankName')}: ${data.bank_code}`}
          />
          <StyleText
            originValue={`${t('profile.accountNumber')}: ${data.bank_account}`}
          />
        </View>
      );
    }

    if (item.type === TYPE_AUTH_REQUEST.update_price) {
      const data =
        item.data as unknown as TypeGetRequestResponse<'update_price'>['data'];
      return (
        <StyleTouchable
          customStyle={[$upgradeAccount, {backgroundColor: theme.gray_50}]}
          onPress={() => {
            if (data.sale.id) {
              push(ROOT_SCREEN.detailSale, {
                saleId: data.sale.id,
              });
            }
          }}>
          <View style={$updatePrice}>
            <Avatar source={{uri: data.sale.images?.[0]}} size={35} />
            <View style={$name}>
              <StyleText originValue={data.sale.name} customStyle={$textName} />
              <View style={$location}>
                <StyleText
                  originValue={data.sale.name}
                  customStyle={[$textLocation, {color: theme.gray_500}]}
                />
              </View>
            </View>
          </View>

          <BoxUpdatePrice
            prices={data.prices}
            containerStyle={{marginTop: verticalScale(4)}}
          />
        </StyleTouchable>
      );
    }

    if (item.type === TYPE_AUTH_REQUEST.suggest_location) {
      const data =
        item.data as unknown as TypeGetRequestResponse<'suggest_location'>['data'];
      return (
        <View style={$data}>
          <StyleTouchable
            customStyle={[$suggestLocation, {backgroundColor: theme.gray_50}]}
            onPress={() => onGoToProfile(data.id)}>
            <Avatar source={{uri: data.avatar}} size={35} />
            <View style={$name}>
              <StyleText originValue={data.name} customStyle={$textName} />
              <View style={$location}>
                <StyleIcon
                  source={Images.icons.location}
                  size={12}
                  tintColor={theme.gray_500}
                />
                <StyleText
                  originValue={data.location}
                  customStyle={[$textLocation, {color: theme.gray_500}]}
                />
              </View>
            </View>
          </StyleTouchable>
        </View>
      );
    }

    if (item.type === TYPE_AUTH_REQUEST.upgrade_to_shop) {
      const data =
        item.data as unknown as TypeGetRequestResponse<'upgrade_to_shop'>['data'];
      return (
        <View style={[$upgradeAccount, {backgroundColor: theme.gray_100}]}>
          <StyleText originValue={`${t('discovery.name')}: ${data.name}`} />
          <StyleText
            originValue={`${t('profile.address')}: ${data.location}`}
          />
          <StyleText originValue={`${t('login.phone')}: ${data.phone}`} />
          <StyleText
            originValue={`${t('profile.bankName')}: ${data.bank_code}`}
          />
          <StyleText
            originValue={`${t('profile.accountNumber')}: ${data.bank_account}`}
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
          const temp: TypeGetRequestResponse<'suggest_location'> = item;
          emitAppEvent(APP_EVENT.suggestLocation, {
            locationId: temp?.data?.id,
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
      containerStyle={$container}
      titleBoxFlex={0.3}
    />
  );
};

const $container: ViewStyle = {
  marginTop: verticalScale(12),
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
// Upgrade account
const $upgradeAccount: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(16),
  paddingVertical: verticalScale(12),
  borderRadius: BORDER_RADIUS.f3,
};
// Update price
const $updatePrice: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
};

export default memo(ItemRequest, (pre: Props, next: Props) => {
  return isEqual(pre.item, next.item);
});
