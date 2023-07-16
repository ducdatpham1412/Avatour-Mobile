import {apiGetListTours, apiGetListToursFavorite} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import Images from 'asset/img/images';
import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {ItemTour, TabView} from 'components';
import {StyleIcon, StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import {IconTabBar} from 'components/common';
import {useTheme} from 'hook';
import usePaging from 'hook/usePaging';
import React, {useCallback} from 'react';
import {Platform, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {scale} from 'utility/scale';

const TourEnjoy = () => {
  const theme = useTheme();
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.titleView, {borderBottomColor: theme.holderColor}]}>
        <StyleIcon
          source={Images.icons.tour}
          size={15}
          customStyle={{tintColor: theme.p_900}}
        />
        <StyleText i18Text="tour.tours" customStyle={styles.textTitle} />
      </View>
    </View>
  );
};

const MyTour = () => {
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const {list, refreshing, onRefresh, onLoadMore, initLoading} = usePaging({
    request: apiGetListTours,
    params: {
      user_id: myId,
    },
  });

  const renderItem = useCallback((item: Tour) => {
    return <ItemTour item={item} containerStyle={{marginBottom: 10}} />;
  }, []);

  return (
    <StyleList
      data={list}
      renderItem={({item}) => renderItem(item)}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      contentContainerStyle={styles.content}
      initLoading={initLoading}
    />
  );
};

const TourFavorite = () => {
  const {list, refreshing, onRefresh, onLoadMore, initLoading} = usePaging({
    request: apiGetListToursFavorite,
  });

  const renderItem = useCallback((item: Tour) => {
    return <ItemTour item={item} containerStyle={{marginBottom: 10}} />;
  }, []);

  return (
    <StyleList
      data={list}
      renderItem={({item}) => renderItem(item)}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      contentContainerStyle={styles.content}
      initLoading={initLoading}
    />
  );
};

const ToursScreen = () => {
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const theme = useTheme();

  if (modeExp) {
    return <TourEnjoy />;
  }
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.titleView, {borderBottomColor: theme.holderColor}]}>
        <StyleIcon
          source={Images.icons.tour}
          size={15}
          customStyle={{tintColor: theme.p_900}}
        />
        <StyleText i18Text="tour.tours" customStyle={styles.textTitle} />
      </View>
      <TabView
        style={$body}
        listElements={[MyTour, TourFavorite]}
        listIconTabBar={[
          <IconTabBar icon={Images.icons.tour} title="tour.myTours" />,
          <IconTabBar icon={Images.icons.heart} title="tour.favoriteTour" />,
        ]}
        tabBarStyle={$tabBar}
      />
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingTop: Metrics.safeTopPadding,
  },
  titleView: {
    paddingVertical: '3@vs',
    paddingHorizontal: '20@s',
    borderBottomWidth: Platform.select({
      ios: '0.25@ms',
      android: '0.5@ms',
    }),
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: FONT_SIZE.f1,
    fontWeight: 'bold',
    marginLeft: '8@s',
  },
  iconHeart: {
    fontSize: '20@ms',
  },
  content: {
    paddingTop: safePaddingNotZero,
    paddingBottom: safePaddingNotZero,
    alignItems: 'center',
    flexGrow: 1,
  },
});
const $body: ViewStyle = {
  flex: 1,
};
const $tabBar: ViewStyle = {
  paddingHorizontal: scale(50),
};

export default ToursScreen;
