import {apiSearch} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {POST_SEARCH} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemTour, Separator} from 'components';
import {StyleList} from 'components/base';
import {usePaging} from 'hook';
import React, {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale} from 'utility/scale';

const SearchListTour = () => {
  const {bottom} = useSafeAreaInsets();
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
      post_search: POST_SEARCH.tour,
    },
    isInitNotRunRequest: true,
  });

  useEffect(() => {
    setParams({
      ...searchParams,
      post_search: POST_SEARCH.tour,
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
          paddingBottom: bottom || safePaddingNotZero,
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
  paddingHorizontal: scale(12),
};

export default SearchListTour;
