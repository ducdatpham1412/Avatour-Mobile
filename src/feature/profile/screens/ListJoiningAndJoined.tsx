import {apiGetListGBJoined} from 'api/profile';
import {
  Metrics,
  horizontalMargin,
  horizontalPadding,
  safePaddingNotZero,
  verticalMargin,
} from 'asset/metrics';
import {Separator} from 'components';
import {StyleList, StyleText} from 'components/base';
import {ItemJoin, ItemJoinWithBanner} from 'feature/discovery/components';
import {useAppEvent, useEstimatesAndJoinings, usePaging} from 'hook';
import React, {useCallback} from 'react';
import {ScrollView, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';
import {ItemEstimate} from '../components';
import {FONT_SIZE} from 'asset';
import {APP_EVENT} from 'asset/enum';

const ListJoiningAndJoined = () => {
  const {
    data: {estimates, joinings},
    loading,
    mutate,
  } = useEstimatesAndJoinings();

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
        containerStyle={$itemJoinSuccess}
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
              i18Text="discovery.goToDeposit"
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
        </View>

        <View style={[$header, {marginTop: verticalScale(24)}]}>
          <StyleText
            i18Text="profile.joinedSuccess"
            customStyle={$textJoinSuccess}
          />
        </View>
      </>
    );
  };

  return (
    <StyleList
      data={list}
      renderItem={({item}) => renderItemJoin(item)}
      keyExtractor={item => String(item?.id)}
      initLoading={initLoading || loading}
      refreshing={refreshing}
      onRefresh={() => {
        onRefresh();
        mutate();
      }}
      loadingMore={loadingMore}
      onLoadMore={onLoadMore}
      contentContainerStyle={$contentContainer}
      ListHeaderComponent={renderHeaderComponent()}
      ItemSeparatorComponent={Separator}
    />
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingBottom: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};
const $header: ViewStyle = {
  width: Metrics.width,
  left: -scale(12),
  marginTop: verticalScale(8),
};
const $containerHeader: ViewStyle = {
  marginTop: verticalMargin,
};
const $contentHeader: ViewStyle = {
  paddingLeft: scale(12),
  paddingRight: scale(12),
};
const $textJoining: TextStyle = {
  marginLeft: scale(12),
  fontWeight: 'bold',
  fontSize: FONT_SIZE.f1,
};
const $textJoinSuccess: StyleProp<TextStyle> = [
  $textJoining,
  {
    marginBottom: verticalMargin,
  },
];
const $itemJoining: ViewStyle = {
  marginRight: horizontalMargin,
};
const $itemJoinSuccess: ViewStyle = {
  width: scale(351),
};

export default ListJoiningAndJoined;
