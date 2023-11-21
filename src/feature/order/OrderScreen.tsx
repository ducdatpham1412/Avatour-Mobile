import {apiGetListGBJoined} from 'api/profile';
import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE} from 'asset';
import {APP_EVENT} from 'asset/enum';
import {IconEmpty, ImageEmpty} from 'asset/icons';
import {
  Metrics,
  horizontalMargin,
  horizontalPadding,
  verticalMargin,
} from 'asset/metrics';
import {
  StyleButton,
  StyleContainer,
  StyleList,
  StyleText,
} from 'components/base';
import {ItemJoin, ItemJoinWithBanner} from 'feature/discovery/components';
import {
  useAppEvent,
  useEstimatesAndJoinings,
  usePaging,
  useSafeArea,
  useTheme,
} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {DISCOVERY_ROUTE} from 'navigation/config';
import React, {useCallback} from 'react';
import {ScrollView, TextStyle, View, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';
import {ItemEstimate} from './components';

const Empty = () => {
  const theme = useTheme();

  return (
    <View style={[$emptyScreen, {backgroundColor: theme.white}]}>
      <ImageEmpty size={300} />
      <StyleText
        i18Text="discovery.notHaveAnyOrder"
        customStyle={{
          fontSize: FONT_SIZE.f1,
          marginTop: verticalMargin,
          fontWeight: 'bold',
        }}
      />
      <StyleText
        i18Text="discovery.goToExploreTour"
        customStyle={{
          fontSize: FONT_SIZE.f3,
          marginTop: verticalMargin,
          textAlign: 'center',
        }}
        mode="html"
      />
      <StyleButton
        title="discovery.exploreTour"
        containerStyle={{marginTop: verticalScale(40)}}
        onPress={() => navigate(DISCOVERY_ROUTE.searchScreen)}
      />
    </View>
  );
};

const OrderScreenUser = () => {
  const theme = useTheme();
  const {
    data: {estimates, joinings},
    loading,
    mutate,
  } = useEstimatesAndJoinings();
  const {paddingBottom} = useSafeArea();

  const {list, refreshing, onRefresh, onLoadMore, loadingMore, initLoading} =
    usePaging<TypeJoinEstimate>({
      request: apiGetListGBJoined,
    });

  useAppEvent(APP_EVENT.confirmArrived, () => {
    /**
     * Don't need to call mutate, we call it in component DetailMeJoin
     * We do it to avoid: This component have not been rendered yet -> mutate is not called
     * Tip: Search: "@Tag: Logic when confirm arrived"
     */
    // mutate();
    onRefresh();
  });

  const renderItemJoin = useCallback((item: TypeJoinEstimate) => {
    return (
      <ItemJoin
        item={item}
        containerStyle={[$itemJoinSuccess, {backgroundColor: theme.gray_100}]}
        onPressMode="see-detail"
        showDeposited={false}
      />
    );
  }, []);

  const renderHeaderComponent = () => {
    return (
      <>
        {!!estimates?.length && (
          <View style={$header}>
            <StyleText
              i18Text="discovery.waitingDeposit"
              customStyle={$textJoining}
            />
            <ScrollView
              horizontal
              style={$containerHeader}
              contentContainerStyle={$contentHeader}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {estimates.map(est => (
                <ItemEstimate
                  key={est.id}
                  item={est}
                  containerStyle={$itemJoining}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View
          style={[
            $header,
            {
              marginTop: estimates.length
                ? verticalScale(24)
                : verticalScale(8),
            },
          ]}>
          <StyleText i18Text="profile.joining" customStyle={$textJoining} />
          {joinings.length ? (
            <ScrollView
              horizontal
              style={$containerHeader}
              contentContainerStyle={$contentHeader}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {joinings.map(joining => (
                <ItemJoinWithBanner
                  key={joining?.id}
                  item={joining}
                  containerStyle={$itemJoining}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={$empty}>
              <IconEmpty size={20} tintColor={theme.gray_500} />
              <StyleText
                i18Text="discovery.notHaveAnyOrder"
                customStyle={[$textEmpty, {color: theme.gray_500}]}
              />
            </View>
          )}
        </View>

        <View
          style={[
            $header,
            {marginTop: verticalScale(24), marginBottom: verticalMargin},
          ]}>
          <StyleText
            i18Text="profile.joinedSuccess"
            customStyle={$textJoining}
          />
        </View>
      </>
    );
  };

  const renderContent = () => {
    if (!estimates.length && !joinings.length && !list.length) {
      return <Empty />;
    }

    return (
      <StyleList
        data={list}
        renderItem={({item}) => renderItemJoin(item)}
        keyExtractor={item => String(item?.id)}
        refreshing={refreshing}
        onRefresh={() => {
          onRefresh();
          mutate();
        }}
        loadingMore={loadingMore}
        onLoadMore={onLoadMore}
        contentContainerStyle={[$contentContainer, {paddingBottom}]}
        ListHeaderComponent={renderHeaderComponent()}
        ListEmptyComponent={
          <View style={[$empty, {marginTop: 0}]}>
            <IconEmpty size={20} tintColor={theme.gray_500} />
            <StyleText
              i18Text="discovery.notHaveAnyOrder"
              customStyle={[$textEmpty, {color: theme.gray_500}]}
            />
          </View>
        }
      />
    );
  };

  return (
    <StyleContainer
      layOut="view"
      headerProps={{
        title: 'order.orderManagement',
        LeftComponent: null,
      }}
      backgroundColor={theme.white}
      customStyle={$container}
      initLoading={initLoading || loading}>
      {renderContent()}
    </StyleContainer>
  );
};

const OrderScreen = () => {
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const theme = useTheme();

  if (modeExp) {
    return (
      <StyleContainer
        layOut="view"
        headerProps={{
          title: 'order.orderManagement',
          LeftComponent: null,
        }}
        backgroundColor={theme.white}
        customStyle={$container}>
        <Empty />
      </StyleContainer>
    );
  }

  return <OrderScreenUser />;
};

const $container: ViewStyle = {
  paddingHorizontal: 0,
};
const $contentContainer: ViewStyle = {
  flexGrow: 1,
  alignItems: 'center',
  gap: verticalMargin,
};
const $header: ViewStyle = {
  width: Metrics.width,
  marginTop: verticalScale(8),
};
const $containerHeader: ViewStyle = {
  marginTop: verticalMargin,
};
const $contentHeader: ViewStyle = {
  paddingLeft: horizontalPadding,
  paddingRight: horizontalPadding,
};
const $textJoining: TextStyle = {
  marginLeft: horizontalPadding,
  fontWeight: 'bold',
  fontSize: FONT_SIZE.f1,
};
const $itemJoining: ViewStyle = {
  marginRight: horizontalMargin,
};
const $itemJoinSuccess: ViewStyle = {
  width: scale(343),
};
const $empty: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalMargin,
  paddingHorizontal: horizontalPadding,
};
const $textEmpty: TextStyle = {
  fontSize: FONT_SIZE.f3,
  marginLeft: scale(8),
};
const $emptyScreen: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: horizontalPadding,
};

export default OrderScreen;
