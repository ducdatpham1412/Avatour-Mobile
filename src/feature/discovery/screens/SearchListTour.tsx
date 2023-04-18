import {apiSearch} from 'api/discovery';
import {ratioImageTour} from 'asset';
import {POST_SEARCH} from 'asset/enum';
import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {ItemTour} from 'components';
import {StyleList} from 'components/base';
import {usePaging} from 'hook';
import React, {useEffect} from 'react';
import isEqual from 'react-fast-compare';
import {View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale, verticalScale} from 'utility/scale';

interface Props {
  searchParams: Omit<TypeSearchRequest, 'post_search'>;
}

const SearchListTour = ({searchParams}: Props) => {
  const {bottom} = useSafeAreaInsets();
  const {
    list,
    setParams,
    onLoadMore,
    refreshing,
    onRefresh,
    loading,
    loadingMore,
  } = usePaging<TypeSearchResponse, TypeSearchRequest>({
    request: apiSearch,
    params: {
      ...searchParams,
      post_search: POST_SEARCH.tour,
    },
    isInitNotRunRequest: true,
  });

  useEffect(() => {
    if (!isEqual(searchParams, {})) {
      setParams({
        ...searchParams,
        post_search: POST_SEARCH.tour,
      });
    }
  }, [searchParams]);

  return (
    <View style={$container}>
      <StyleList
        data={list}
        renderItem={({item}) => (
          <ItemTour item={item} containerStyle={$itemView} />
        )}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        loading={loading}
        loadingMore={loadingMore}
        contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
        ListEmptyComponent={null}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: scale(12),
};
const $itemView: ViewStyle = {
  width: Metrics.width - scale(24),
  height: (Metrics.width - scale(24)) * ratioImageTour * 0.8,
  marginBottom: verticalScale(12),
};

export default SearchListTour;
