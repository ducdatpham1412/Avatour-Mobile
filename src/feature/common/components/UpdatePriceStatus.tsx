import {TYPE_AUTH_REQUEST} from 'asset/enum';
import {BORDER_RADIUS, FONT_SIZE} from 'asset/standardValue';
import {SquareButton, StyleText} from 'components/base';
import {useMyRequests} from 'feature/profile/hooks';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {borderWidthTiny} from 'utility/assistant';
import {formatMoney} from 'utility/format';
import {scale, verticalScale} from 'utility/scale';
import {useDetailSale} from '../hooks';
import {TypeGetRequestResponse} from 'api/interface';

interface Props {
  saleId: number;
}

interface BoxUpdatePriceProps {
  prices: TypePrice[];
  containerStyle?: StyleProp<ViewStyle>;
}

export const BoxUpdatePrice = ({
  prices,
  containerStyle,
}: BoxUpdatePriceProps) => {
  const theme = useTheme();
  const {t} = useTranslation();

  return (
    <View style={containerStyle}>
      <StyleText originValue={`${t('discovery.groupBuyingPrice')}:`} />

      {prices.map(p => (
        <View key={p.price} style={$updatePriceBox}>
          <StyleText
            originValue={`${p.number_people} ${t('discovery.servings')}`}
            customStyle={[
              $textPrice,
              {
                width: '32%',
                color: theme.gray_600,
              },
            ]}
          />
          <StyleText
            originValue="-"
            customStyle={[
              $textPrice,
              {
                marginRight: '12%',
                color: theme.gray_600,
              },
            ]}
          />
          <StyleText
            originValue={formatMoney(p.price)}
            customStyle={[$textPrice, {color: theme.gray_600}]}
          />
        </View>
      ))}
    </View>
  );
};

const UpdatePriceStatus = ({saleId}: Props) => {
  const theme = useTheme();

  const [{data, initLoading, isCanceling}, {onDeleteRequest}] = useMyRequests();
  const [{data: saleData}] = useDetailSale(saleId);

  const findingRequest = data.find(item => {
    const check = item.type === TYPE_AUTH_REQUEST.update_price;
    if (!check) {
      return false;
    }
    if (check) {
      const checkData =
        item.data as unknown as TypeGetRequestResponse<'update_price'>['data'];
      return checkData.sale.id === saleId;
    }
  }) as TypeGetRequestResponse<'update_price'> | undefined;

  const pricesRequest: TypePrice[] | undefined = findingRequest?.data?.prices;

  if (initLoading || !findingRequest || !pricesRequest) {
    return (
      <SquareButton
        title="profile.editPrice"
        containerStyle={$buttonEditPrice}
        onPress={() => {
          if (saleData) {
            navigate(ROOT_SCREEN.editSalePrice, {
              saleId,
              prices: saleData?.prices,
            });
          }
        }}
      />
    );
  }

  const onDelete = async () => {
    const agree = async () => {
      try {
        await onDeleteRequest(findingRequest.id);
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

  const onEdit = () => {
    navigate(ROOT_SCREEN.editSalePrice, {
      saleId: saleId,
      prices: pricesRequest,
    });
  };

  return (
    <View style={[$container, {borderColor: theme.gray_500}]}>
      <StyleText i18Text="discovery.reviewUpdatePrice" customStyle={$title} />

      <BoxUpdatePrice prices={pricesRequest} />

      <View style={$button}>
        <SquareButton
          title="discovery.cancelRequest"
          containerStyle={$buttonBox}
          loading={isCanceling}
          titleStyle={$textButton}
          onPress={onDelete}
        />
        <View style={{width: 8}} />
        <SquareButton
          title="common.edit"
          containerStyle={$buttonBox}
          onPress={onEdit}
          titleStyle={$textButton}
        />
      </View>
    </View>
  );
};

const $container: ViewStyle = {
  width: '80%',
  paddingHorizontal: scale(15),
  paddingVertical: verticalScale(5),
  borderWidth: borderWidthTiny,
  marginTop: verticalScale(12),
  alignSelf: 'center',
  borderRadius: BORDER_RADIUS.f3,
};
const $title: TextStyle = {
  fontWeight: 'bold',
};
const $updatePriceBox: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(2),
  paddingHorizontal: scale(8),
};
const $textPrice: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $button: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: verticalScale(12),
  marginBottom: verticalScale(2),
};
const $buttonBox: ViewStyle = {
  flex: 1,
};
const $textButton: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $buttonEditPrice: ViewStyle = {
  width: '90%',
  alignSelf: 'center',
  marginTop: verticalScale(12),
};

export default UpdatePriceStatus;
