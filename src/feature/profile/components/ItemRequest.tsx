import {TypeGetRequestResponse} from 'api/interface';
import {TYPE_AUTH_REQUEST} from 'asset/enum';
import {BoxInformation} from 'components';
import {StyleButton} from 'components/base';
import {useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {useTranslation} from 'react-i18next';
import {View, ViewStyle} from 'react-native';
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
      return t('');
    }
    return t('common.null');
  };

  const renderData = () => {
    if (item.type === TYPE_AUTH_REQUEST.update_bank) {
      const data =
        item.data as unknown as TypeGetRequestResponse<'update_bank'>['data'];

      return null;
    }

    if (item.type === TYPE_AUTH_REQUEST.update_price) {
      const data =
        item.data as unknown as TypeGetRequestResponse<'update_price'>['data'];
      return null;
    }

    if (item.type === TYPE_AUTH_REQUEST.suggest_location) {
      const data =
        item.data as unknown as TypeGetRequestResponse<'suggest_location'>['data'];
      return null;
    }

    if (item.type === TYPE_AUTH_REQUEST.upgrade_to_shop) {
      const data =
        item.data as unknown as TypeGetRequestResponse<'upgrade_to_shop'>['data'];
      return null;
    }

    return null;
  };

  const onDelete = () => {
    const agree = async () => {
      try {
        await onDeleteRequest(item.id);
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

export default memo(ItemRequest, (pre: Props, next: Props) => {
  return isEqual(pre.item, next.item);
});
