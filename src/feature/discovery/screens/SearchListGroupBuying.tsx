import {apiSearch} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {APP_EVENT, POST_SEARCH} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemSale} from 'components';
import {StyleList} from 'components/base';
import {useAppEvent, usePaging} from 'hook';
import React, {useEffect} from 'react';
import isEqual from 'react-fast-compare';
import {View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {onReactSale} from 'utility/assistant';
import {scale} from 'utility/scale';

const SearchListGroupBuying = () => {
  const {bottom} = useSafeAreaInsets();
  const {searchParams} = useAppSelector(state => state.logicSlice);

  const {
    list,
    setList,
    setParams,
    onLoadMore,
    refreshing,
    onRefresh,
    loadingMore,
  } = usePaging<TypeGroupBuying, TypeSearchRequest>({
    request: apiSearch,
    params: {
      ...searchParams,
      post_search: POST_SEARCH.group_buying,
    },
    isInitNotRunRequest: true,
  });

  useAppEvent(APP_EVENT.reactSale, data => {
    setList(pre => {
      return pre.map(sale => {
        if (sale.id !== data?.saleId) {
          return sale;
        }
        return {
          ...sale,
          is_liked: data.type === 'like',
        };
      });
    });
  });

  useEffect(() => {
    if (!isEqual(searchParams, {})) {
      setParams({
        ...searchParams,
        post_search: POST_SEARCH.group_buying,
      });
    }
  }, [searchParams]);

  return (
    <View style={$container}>
      <StyleList
        data={list}
        renderItem={({item, index}) => (
          <ItemSale
            item={item}
            onReact={value =>
              onReactSale(value.postId as number, {
                isLiked: value.isLiked,
                setList,
              })
            }
            containerStyle={{marginLeft: index % 2 !== 0 ? scale(7) : 0}}
          />
        )}
        keyExtractor={item => String(item.id)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        loadingMore={loadingMore}
        contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
        ListEmptyComponent={null}
        numColumns={2}
      />
    </View>
  );
};

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: scale(12),
};

export default SearchListGroupBuying;
