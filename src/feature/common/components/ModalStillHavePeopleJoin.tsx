import {STATUS} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {AppModalize} from 'components';
import {StyleButton, StyleText} from 'components/base';
import {useCreateSale} from 'feature/profile/hooks';
import {useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {ForwardedRef, RefObject, forwardRef} from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {impactMedium} from 'utility/haptic';
import {verticalScale} from 'utility/scale';

interface Props {
  sale: TypeGroupBuying;
}

const ModalStillHavePeopleJoin = (
  {sale}: Props,
  ref: ForwardedRef<TypeShowModalize>,
) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const [{loadingUpdateStatus}, {updateStatus}] = useCreateSale({
    postId: sale.id,
    name: sale.name,
    content: sale.content,
    images: sale.images,
    prices: sale.prices,
  });

  const onUpdateStatusSale = async () => {
    try {
      await updateStatus(STATUS.temporarilyClose);
      impactMedium();
      const temp = ref as RefObject<TypeShowModalize>;
      temp.current?.hide();
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <AppModalize ref={ref}>
      <StyleText
        i18Text="alert.stillHavePeopleJoin"
        i18Params={{name: sale.name}}
        mode="html"
        htmlTextBoldColor={theme.red}
      />
      <StyleButton
        title="discovery.temporarilyClosed"
        containerStyle={[
          $buttonContinue,
          {marginBottom: bottom || safePaddingNotZero},
        ]}
        onPress={onUpdateStatusSale}
        isLoading={loadingUpdateStatus}
      />
    </AppModalize>
  );
};

const $buttonContinue: ViewStyle = {
  width: '70%',
  marginTop: verticalScale(12),
};

export default forwardRef(ModalStillHavePeopleJoin);
