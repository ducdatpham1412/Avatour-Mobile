import {apiGetListToursFavorite} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {REACT} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemTour, Separator} from 'components';
import {StyleList} from 'components/base';
import {usePaging, useSafeArea} from 'hook';
import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {onReactPost} from 'utility/assistant';

const FavoriteTours = () => {
  const {bottom} = useSafeArea();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const {
    list,
    setList,
    refreshing,
    onRefresh,
    loadingMore,
    onLoadMore,
    initLoading,
  } = usePaging({
    request: apiGetListToursFavorite,
    params: {
      user_id: myId,
    },
  });

  const renderItem = useCallback(({item}: {item: Tour}) => {
    return (
      <ItemTour
        item={item}
        onReact={() => {
          onReactPost(item.id, {
            type: REACT.tour,
            setList,
          });
        }}
      />
    );
  }, []);

  return (
    <StyleList
      data={list}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      loadingMore={loadingMore}
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

export default FavoriteTours;
