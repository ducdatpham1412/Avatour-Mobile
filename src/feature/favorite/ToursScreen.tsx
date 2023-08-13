import {apiGetListTours, apiGetListToursFavorite} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {ItemTour, TabView} from 'components';
import {StyleContainer, StyleIcon, StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import {IconTabBar} from 'components/common';
import {useTheme} from 'hook';
import usePaging from 'hook/usePaging';
import React, {useCallback} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import {scale, verticalScale} from 'utility/scale';

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

  const renderContent = () => {
    if (modeExp) {
      return null;
    }

    return (
      <TabView
        style={$body}
        listElements={[MyTour, TourFavorite]}
        listIconTabBar={[
          <IconTabBar icon={Images.icons.tour} title="tour.myTours" />,
          <IconTabBar icon={Images.icons.heart} title="tour.favoriteTour" />,
        ]}
        tabBarStyle={$tabBar}
      />
    );
  };

  return (
    <StyleContainer layOut="view">
      <View style={[$titleView, {borderBottomColor: theme.gray_300}]}>
        <StyleIcon
          source={Images.icons.tour}
          size={15}
          customStyle={{tintColor: theme.p_900}}
        />
        <StyleText i18Text="tour.tours" customStyle={$textTitle} />
      </View>
      {renderContent()}
    </StyleContainer>
  );
};

const $titleView: ViewStyle = {
  paddingVertical: verticalScale(4),
  paddingHorizontal: scale(20),
  borderBottomWidth: borderWidthTiny,
  flexDirection: 'row',
  alignItems: 'center',
};
const $textTitle: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
  marginLeft: scale(8),
};

const styles = ScaledSheet.create({
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
