import {apiSearch} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {APP_EVENT, STATUS} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemSale} from 'components';
import {StyleList} from 'components/base';
import {useAppEvent, usePaging, useSafeArea} from 'hook';
import React, {useEffect} from 'react';
import isEqual from 'react-fast-compare';
import {View, ViewStyle} from 'react-native';
import {onReactSale} from 'utility/assistant';
import {scale} from 'utility/scale';

const SearchListGroupBuying = () => {
  const {bottom} = useSafeArea();
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
  } = usePaging<TypeGroupBuying, TypeSearchRequest>({
    request: apiSearch,
    params: {
      ...searchParams,
      post_search: 'sale',
    },
    isInitNotRunRequest: true,
  });

  useAppEvent(APP_EVENT.reactSale, data => {
    setList(pre => {
      return pre.map(sale => {
        if (sale.id !== data?.saleId) {
          return sale;
        }
        const isLiked = data.type === 'like';
        return {
          ...sale,
          is_liked: isLiked,
          total_likes: isLiked ? sale.total_likes + 1 : sale.total_likes - 1,
        };
      });
    });
  });

  useAppEvent(APP_EVENT.editSale, e => {
    setList(pre => {
      if (e.data.status === STATUS.notActive) {
        return pre.filter(sale => sale.id !== e.post_id);
      }
      return pre.map(sale => {
        if (sale.id !== e?.post_id) {
          return sale;
        }
        return {
          ...sale,
          ...e.data,
        };
      });
    });
  });

  useEffect(() => {
    if (!isEqual(searchParams, {})) {
      setParams({
        ...searchParams,
        post_search: 'sale',
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
        initLoading={initLoading}
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
