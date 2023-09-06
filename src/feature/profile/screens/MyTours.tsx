import {apiGetListTours} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemTour, Separator} from 'components';
import {StyleList} from 'components/base';
import {usePaging, useSafeArea} from 'hook';
import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';

const MyTours = () => {
  const {bottom} = useSafeArea();
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
    return <ItemTour item={item} />;
  }, []);

  return (
    <StyleList
      data={list}
      renderItem={({item}) => renderItem(item)}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      contentContainerStyle={[$content, {paddingBottom: bottom}]}
      initLoading={initLoading}
      ItemSeparatorComponent={Separator}
    />
  );
};

const $content: ViewStyle = {
  paddingTop: safePaddingNotZero,
  alignItems: 'center',
  flexGrow: 1,
};

export default MyTours;
