import {apiSearch} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {REACT} from 'asset/enum';
import {horizontalPadding} from 'asset/metrics';
import {ItemTour, Separator} from 'components';
import {StyleList} from 'components/base';
import {usePaging, useSafeArea} from 'hook';
import React, {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import {onReactPost} from 'utility/assistant';
import SearchListShops from './SearchListShops';

const SearchListTour = () => {
  const {paddingBottom} = useSafeArea();
  const {searchParams} = useAppSelector(state => state.logicSlice);
  const {
    list,
    setList,
    setParams,
    onLoadMore,
    refreshing,
    onRefresh,
    loadingMore,
    initLoading,
  } = usePaging<Tour, TypeSearchRequest>({
    request: apiSearch,
    params: {
      ...searchParams,
      post_search: 'tour',
    },
    isInitNotRunRequest: true,
  });

  useEffect(() => {
    setParams({
      ...searchParams,
      post_search: 'tour',
    });
  }, [searchParams]);

  return (
    <View style={$container}>
      <StyleList
        data={list}
        renderItem={({item}) => (
          <ItemTour
            item={item}
            onReact={() => {
              onReactPost(item.id, {
                type: REACT.tour,
                setList,
              });
            }}
          />
        )}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        loadingMore={loadingMore}
        initLoading={initLoading}
        contentContainerStyle={{
          paddingBottom,
          paddingHorizontal: horizontalPadding,
        }}
        ListEmptyComponent={null}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={SearchListShops}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
};

export default SearchListTour;
