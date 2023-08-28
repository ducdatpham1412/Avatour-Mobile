import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {JOIN_STATUS} from 'asset/enum';
import Images from 'asset/img/images';
import {
  horizontalPadding,
  safePaddingNotZero,
  verticalMargin,
} from 'asset/metrics';
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
import {useSafeArea, useTheme} from 'hook';
import {navigate, push} from 'navigation/NavigationService';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {borderWidthTiny} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ItemJoin} from './components';
import {useJoinResult} from './hooks';

interface Props {
  shop_id: number;
}

const JoinResult = ({shop_id}: Props) => {
  const theme = useTheme();
  const {bottom} = useSafeArea();
  const [{data: shopData}] = useOtherProfile(shop_id, {
    revalidateAll: false,
  });
  const [{data, loadingRequestBought, loading, error}, {mutate}] =
    useJoinResult(shop_id, {
      revalidateAll: true,
      joinId: 'all',
    });
  const isHaveNotBought = data?.today?.find(
    item => item.status === JOIN_STATUS.adminConfirm,
  );

  if (error) {
    return <ErrorScreen title="common.retry" onPress={mutate} />;
  }

  /**
   * Render views
   */
  const renderHeader = () => {
    if (isHaveNotBought) {
      return (
        <BoxView containerStyle={$alert}>
          <StyleText
            i18Text="discovery.rememberConfirmWhenArrived"
            i18Params={{
              numberJoins: data?.today?.length,
              storeName: shopData?.name,
            }}
            mode="html"
            customStyle={[$textAlert, {color: theme.gray_700}]}
          />
        </BoxView>
      );
    }
    return null;
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
                marginVertical: verticalMargin,
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

  return (
    <View style={$joinResultContainer}>
      <StyleList
        data={data?.today ?? []}
        renderItem={({item}) => {
          const isNotBought = item?.status === JOIN_STATUS.adminConfirm;
          return (
            <ItemJoin
              item={item}
              containerStyle={$itemContainer}
              bottomComponent={
                isNotBought ? (
                  <StyleButton
                    containerStyle={$buttonConfirm}
                    onPress={() => {
                      push(ROOT_SCREEN.detailMeJoin, {
                        estimateId: item.id,
                        initValue: item,
                        mode: 'go-from-scan',
                      });
                    }}
                    title="discovery.confirmArrived"
                    titleStyle={{
                      color: theme.black,
                      fontWeight: FONT_WEIGHT_MEDIUM,
                    }}
                    isLoading={loadingRequestBought}
                  />
                ) : undefined
              }
              onPressMode="go-from-scan"
              showDeposited
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
        ListEmptyComponent={
          <>
            <StyleIcon
              source={Images.images.successful}
              size={80}
              customStyle={$icon}
            />
            <BoxView containerStyle={$empty}>
              <StyleText
                i18Text="discovery.notHaveOrderToday"
                i18Params={{
                  storeName: shopData?.name,
                }}
                customStyle={[
                  $textEmpty,
                  {color: theme.gray_700, backgroundColor: theme.white},
                ]}
              />
            </BoxView>
          </>
        }
        ListFooterComponent={renderFooter()}
      />
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

  return (
    <StyleContainer
      layOut="view"
      headerProps={{
        title: data?.name as I18Normalize,
      }}
      initLoading={loading}
      customStyle={$container}
      error={error}
      onPressError={mutate}>
      {mode === 'join-result' && <JoinResult shop_id={shop_id} />}
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $alert: ViewStyle = {
  marginTop: verticalMargin,
};
const $textAlert: TextStyle = {
  textAlign: 'center',
};
const $empty: ViewStyle = {
  marginTop: verticalMargin,
};
const $textEmpty: TextStyle = {
  alignSelf: 'center',
  textAlign: 'center',
};
const $joinResultContainer: ViewStyle = {
  flex: 1,
};
const $itemContainer: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
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
  paddingHorizontal: scale(8),
};
const $textAlso: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $buttonConfirm: ViewStyle = {
  marginTop: verticalScale(12),
  width: scale(230),
  paddingHorizontal: scale(20),
  backgroundColor: 'transparent',
  borderWidth: borderWidthTiny,
};
const $icon: ImageStyle = {
  marginTop: verticalMargin,
  alignSelf: 'center',
};

export default ScanResult;
