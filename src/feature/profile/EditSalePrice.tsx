import {safePaddingNotZero} from 'asset/metrics';
import {StyleButton, StyleContainer} from 'components/base';
import {goBack} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useState} from 'react';
import isEqual from 'react-fast-compare';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'utility/scale';
import {PricesEdit} from './components';
import {useMyRequests} from './hooks';

const EditSalePrice = ({
  route: {
    params: {saleId, prices: paramPrices},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.editSalePrice]>) => {
  const {bottom} = useSafeAreaInsets();
  const [{loadingSendRequest}, {sendRequest}] = useMyRequests();

  const [prices, setPrices] = useState(paramPrices);
  const disableButton = isEqual(prices, paramPrices);

  const onSendRequest = async () => {
    try {
      const newUpdatePrice: TypeRequestUpdatePrice = {
        sale_id: saleId,
        prices,
      };
      await sendRequest(newUpdatePrice);
      ModalAlert.success({
        i18Content: 'alert.reviewUpdatePrice',
        onClose: goBack,
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <StyleContainer
      headerProps={{
        title: 'profile.editPrice',
      }}
      BottomComponent={
        <StyleButton
          title="common.save"
          containerStyle={[
            $button,
            {marginBottom: bottom || safePaddingNotZero},
          ]}
          disable={disableButton}
          isLoading={loadingSendRequest}
          onPress={onSendRequest}
        />
      }>
      <PricesEdit
        prices={prices}
        containerStyle={$editPrice}
        enableEdit
        onAddPrice={value => setPrices(pre => pre.concat(value))}
        onDeletePrice={value =>
          setPrices(pre =>
            pre.filter(item => item.number_people !== value.number_people),
          )
        }
        onEditPrice={e => {
          setPrices(pre =>
            pre.map((item, index) => {
              if (index !== e.indexEdit) {
                return item;
              }
              return e.value;
            }),
          );
        }}
      />
    </StyleContainer>
  );
};

const $button: ViewStyle = {
  width: '90%',
};
const $editPrice: ViewStyle = {
  marginTop: verticalScale(8),
};

export default EditSalePrice;
