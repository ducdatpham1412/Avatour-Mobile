import {apiSearch} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {newHorizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {ItemTour, Separator} from 'components';
import {StyleList} from 'components/base';
import {usePaging, useSafeArea} from 'hook';
import React, {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';

const SearchListTour = () => {
  const {bottom} = useSafeArea();
  const {searchParams} = useAppSelector(state => state.logicSlice);
  const {
    list,
    setParams,
    onLoadMore,
    refreshing,
    onRefresh,
    loadingMore,
    initLoading,
  } = usePaging<TypeSearchResponse, TypeSearchRequest>({
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
        renderItem={({item}) => <ItemTour item={item} />}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        loadingMore={loadingMore}
        initLoading={initLoading}
        contentContainerStyle={{
          paddingBottom: bottom,
          paddingTop: safePaddingNotZero,
        }}
        ListEmptyComponent={null}
        ItemSeparatorComponent={Separator}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: newHorizontalPadding,
};

export default SearchListTour;
