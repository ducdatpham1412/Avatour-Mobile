import {FONT_SIZE} from 'asset';
import {GROUP_BUYING_STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {BoxView} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleList,
  StyleText,
} from 'components/base';
import {Avatar, RightIcon} from 'components/common';
import {ErrorScreen} from 'feature/common';
import {useOtherProfile} from 'feature/profile/hooks';
import {useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {I18Normalize} from 'utility/I18Next';
import {formatMoney} from 'utility/format';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ItemJoin} from './components';
import {useJoinResult} from './hooks';

interface Props {
  shop_id: number;
}

const JoinResult = ({shop_id}: Props) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const [{data: shopData}] = useOtherProfile(shop_id, {
    revalidateAll: false,
  });
  const [
    {data, loadingRequestBought, loading, error},
    {requestBought, mutate},
  ] = useJoinResult(shop_id, {
    revalidateAll: true,
    joinId: 'all',
  });
  const isHaveNotBought = data?.today?.find(
    item => item.status === GROUP_BUYING_STATUS.notBought,
  ); // Check have any join have status === status not bought

  const onRequestAll = () => {
    if (isHaveNotBought) {
      if (data?.today?.length) {
        const agree = async () => {
          await requestBought({
            list_joins_id: data.today.map(item => item.id),
          });
        };

        ModalAlert.options({
          i18Content: 'alert.beSureConfirmWhenInStore',
          onContinue: agree,
        });
      }
    } else {
      goBack();
    }
  };

  if (error) {
    return <ErrorScreen title="common.retry" onPress={mutate} />;
  }

  const renderHeader = () => {
    const text = () => {
      if (!data?.today?.length) {
        return (
          <StyleText
            i18Text="discovery.notHaveOrderToday"
            i18Params={{
              storeName: shopData?.name,
            }}
            customStyle={[$textAlert, {color: theme.gray_700}]}
          />
        );
      }
      if (isHaveNotBought) {
        return (
          <StyleText
            i18Text="discovery.rememberConfirmWhenArrived"
            i18Params={{
              numberJoins: data?.today?.length,
              storeName: shopData?.name,
            }}
            mode="html"
            customStyle={[$textAlert, {color: theme.gray_700}]}
          />
        );
      }
      return null;
    };

    return (
      <View style={$header}>
        <StyleIcon
          source={Images.images.successful}
          size={50}
          customStyle={$iconHeader}
        />
        {text()}
      </View>
    );
  };

  const renderFooter = () => {
    if (data?.next?.length) {
      return (
        <>
          <View
            style={[
              $divider,
              {
                borderTopColor: theme.gray_300,
                marginVertical: verticalScale(20),
              },
            ]}
          />
          <BoxView
            containerStyle={$also}
            onPress={() =>
              navigate(ROOT_SCREEN.listJoining, {
                list: data.next,
              })
            }>
            <Avatar source={{uri: shopData?.avatar}} size={40} />
            <View style={$textAlsoBox}>
              <StyleText
                i18Text="discovery.alsoHaveNextDay"
                i18Params={{
                  numberJoins: data.next.length,
                  storeName: shopData?.name,
                }}
                customStyle={$textAlso}
              />
            </View>
            <RightIcon />
          </BoxView>
        </>
      );
    }
    return null;
  };

  const renderTotal = () => {
    if (data?.today?.length) {
      const totalDeposited = data.today
        .map(join => join.deposit)
        .reduce((pre, current) => pre + current);
      const totalPrice = data.today
        .map(join => join.price)
        .reduce((pre, current) => pre + current);

      return (
        <>
          <StyleText
            i18Text="discovery.allPrice"
            customStyle={{color: theme.gray_700}}>
            <StyleText originValue=":" customStyle={{color: theme.gray_700}} />
            <StyleText
              originValue={` ${formatMoney(totalPrice)}`}
              customStyle={$textDeposited}
            />
          </StyleText>
          <View style={[$divider, {borderTopColor: theme.gray_300}]} />

          <StyleText
            i18Text="discovery.allDeposited"
            customStyle={{color: theme.gray_700}}>
            <StyleText originValue=":" customStyle={{color: theme.gray_700}} />
            <StyleText
              originValue={` ${formatMoney(totalDeposited)}`}
              customStyle={$textDeposited}
            />
          </StyleText>
          <View style={[$divider, {borderTopColor: theme.gray_300}]} />

          <StyleText
            i18Text="discovery.moneyToPayAll"
            customStyle={{color: theme.gray_700}}>
            <StyleText originValue=":" customStyle={{color: theme.gray_700}} />
          </StyleText>

          <StyleText
            originValue={` ${formatMoney(totalPrice - totalDeposited)}`}
            customStyle={[$textPrice, {color: theme.red}]}
          />
        </>
      );
    }
    return null;
  };

  return (
    <View style={$joinResultContainer}>
      <StyleList
        data={data?.today ?? []}
        renderItem={({item}) => {
          const isNotBought = item?.status === GROUP_BUYING_STATUS.notBought;
          return (
            <ItemJoin
              item={item}
              containerStyle={$itemContainer}
              bottomComponent={
                isNotBought ? 'button-confirm-join' : 'join-status'
              }
              onPressMode="go-from-scan"
            />
          );
        }}
        keyExtractor={item => String(item?.id)}
        contentContainerStyle={{
          paddingBottom: bottom || safePaddingNotZero,
          paddingHorizontal: horizontalPadding,
        }}
        initLoading={loading}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={null}
        ListFooterComponent={renderFooter()}
      />
      {!loading && (
        <View
          style={[
            $buttonView,
            {
              backgroundColor: theme.background,
              shadowColor: theme.black,
              paddingBottom: bottom || safePaddingNotZero,
            },
          ]}>
          {renderTotal()}
          <StyleButton
            containerStyle={$button}
            title={isHaveNotBought ? 'discovery.confirmAll' : 'common.done'}
            isLoading={loadingRequestBought}
            onPress={onRequestAll}
            disable={!data?.today?.length}
          />
        </View>
      )}
    </View>
  );
};

const ScanResult = ({
  route: {
    params: {mode, shop_id},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.scanResult]>) => {
  const [{data, error, loading}, {mutate}] = useOtherProfile(shop_id, {
    revalidateAll: false,
  });

  const renderContent = () => {
    if (error) {
      return <ErrorScreen title="common.retry" onPress={mutate} />;
    }

    if (mode === 'join-result') {
      return <JoinResult shop_id={shop_id} />;
    }

    return null;
  };

  return (
    <StyleContainer
      layOut="view"
      headerProps={{
        title: data?.name as I18Normalize,
      }}
      initLoading={loading}
      customStyle={$container}>
      {renderContent()}
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $header: ViewStyle = {
  width: '100%',
  alignItems: 'center',
};
const $iconHeader: ImageStyle = {
  marginTop: verticalScale(12),
};
const $textAlert: TextStyle = {
  fontSize: FONT_SIZE.f3,
  textAlign: 'center',
  marginTop: verticalScale(8),
};
const $joinResultContainer: ViewStyle = {
  flex: 1,
};
const $itemContainer: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
};
const $buttonView: ViewStyle = {
  width: '100%',
  paddingTop: verticalScale(8),
  paddingHorizontal: horizontalPadding,
  shadowOpacity: 0.1,
  shadowOffset: {
    width: 0,
    height: -4,
  },
};
const $button: ViewStyle = {
  width: '100%',
};
const $textDeposited: TextStyle = {
  fontWeight: 'bold',
};
const $textPrice: TextStyle = {
  fontWeight: 'bold',
  marginBottom: verticalScale(8),
  fontSize: FONT_SIZE.h2,
};
const $divider: ViewStyle = {
  width: '100%',
  marginVertical: verticalScale(4),
  borderTopWidth: moderateScale(0.5),
};
const $also: ViewStyle = {
  flexDirection: 'row',
  paddingHorizontal: horizontalPadding,
  alignItems: 'center',
};
const $textAlsoBox: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: scale(4),
};
const $textAlso: TextStyle = {
  fontSize: FONT_SIZE.f3,
};

export default ScanResult;
