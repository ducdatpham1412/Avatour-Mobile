import {FONT_WEIGHT_MEDIUM} from 'asset';
import {TYPE_AUTH_REQUEST} from 'asset/enum';
import {BoxInformation} from 'components';
import {StyleButton, StyleText} from 'components/base';
import {useTheme} from 'hook';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {TextStyle, View, ViewStyle} from 'react-native';
import {formatddddDDMMYYYY} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {useMyRequests} from '../hooks';
import {ModalAlert} from 'navigation/screen/modals';

interface Props {
  item: TypeGetRequestResponse<any>;
}

const ItemRequest = ({item}: Props) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [{isCanceling}, {onCancelRequest}] = useMyRequests();

  const content = useCallback(
    (type: number) => {
      if (type === TYPE_AUTH_REQUEST.upgrade_to_shop) {
        return t('profile.upgradeToShop');
      }
      if (type === TYPE_AUTH_REQUEST.update_bank) {
        return t('profile.updateBankAccount');
      }
      if (type === TYPE_AUTH_REQUEST.update_price) {
        return t('discovery.updatePrice');
      }
      if (type === TYPE_AUTH_REQUEST.delete_gb) {
        return t('discovery.deleteSale');
      }
      return t('common.null');
    },
    [t],
  );

  const renderData = () => {
    if (typeof item.data === 'object') {
      return (
        <>
          {Object.entries(item?.data)?.map(([key, value]) => {
            return (
              <StyleText>
                <StyleText originValue={String(key)} customStyle={$keyText} />
                <StyleText originValue=": " />
                <StyleText originValue={String(value)} />
              </StyleText>
            );
          })}
        </>
      );
    }
    return <StyleText originValue={item?.data} />;
  };

  const onCancel = () => {
    ModalAlert.options({
      i18Content: 'profile.post.sureDeletePost',
      onContinue: () => onCancelRequest(item?.id),
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
            title="common.cancel"
            onPress={onCancel}
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
const $keyText: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
};

export default ItemRequest;
