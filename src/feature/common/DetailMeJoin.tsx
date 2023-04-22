import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import {BoxInformation} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleText,
} from 'components/base';
import {useTheme} from 'hook';
import {goBack} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {borderWidthTiny} from 'utility/assistant';
import {formatLocaleNumber, formatddddDDMMYYYY} from 'utility/format';
import {verticalScale} from 'utility/scale';
import {useDetailSale} from './hooks';

const ConfirmJoinScreen = ({
  route: {
    params: {itemJoin, mode, onSuccess},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.detailMeJoin]>) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const [{loadingJoin}, {onJoin}] = useDetailSale({
    saleId: itemJoin?.saleId,
  });

  const TopComponent = (
    <View style={$topView}>
      <StyleIcon source={Images.images.squirrelLogin} size={70} />
    </View>
  );

  const renderBottomComponent = () => {
    if (mode === 'confirm-join') {
      return (
        <StyleButton
          title="common.confirm"
          containerStyle={{
            marginBottom: bottom || safePaddingNotZero,
            width: '70%',
          }}
          onPress={() => onJoin(itemJoin, {onSuccess})}
          isLoading={loadingJoin}
        />
      );
    }
    if (mode === 'see-detail') {
      return (
        <StyleButton
          title="common.ok"
          containerStyle={[
            $buttonOk,
            {
              marginBottom: bottom || safePaddingNotZero,
              width: '70%',
            },
          ]}
          titleStyle={{color: theme.black}}
          onPress={goBack}
          isLoading={loadingJoin}
        />
      );
    }
    return null;
  };

  return (
    <StyleContainer
      TopComponent={TopComponent}
      BottomComponent={renderBottomComponent()}
      headerProps={{
        title: 'discovery.confirmJoining',
      }}>
      <BoxInformation
        listInformation={[
          {
            title: 'discovery.amount',
            content: String(itemJoin?.amount),
          },
          {
            title: 'discovery.arrivalTime',
            content: formatddddDDMMYYYY(itemJoin?.time_will_buy),
          },
          {
            title: 'discovery.deposit',
            content: `${formatLocaleNumber(
              String(itemJoin?.deposit || '0'),
            )} (vnd)`,
          },
          <View style={{width: '100%'}}>
            <StyleText
              i18Text="discovery.note"
              style={{color: theme.gray_600}}
            />
            <StyleText
              originValue={itemJoin?.note}
              style={[$contentNote, {color: theme.black}]}
            />
          </View>,
        ]}
        containerStyle={$depositView}
      />
    </StyleContainer>
  );
};

const $topView: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  marginTop: verticalScale(10),
};
const $depositView: ViewStyle = {
  marginTop: verticalScale(20),
};
const $contentNote: TextStyle = {
  marginTop: verticalScale(5),
};
const $buttonOk: ViewStyle = {
  backgroundColor: 'transparent',
  borderWidth: borderWidthTiny,
};

export default ConfirmJoinScreen;
