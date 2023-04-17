import {apiSearch} from 'api/discovery';
import {apiLikePost, apiUnLikePost} from 'api/profile';
import {POST_SEARCH, REACT} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemSale} from 'components';
import {StyleList} from 'components/base';
import {usePaging} from 'hook';
import {appAlert} from 'navigation/NavigationService';
import React, {useEffect} from 'react';
import isEqual from 'react-fast-compare';
import {View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale} from 'utility/scale';

interface Props {
  searchParams: Omit<TypeSearchRequest, 'post_search'>;
}

const SearchListGroupBuying = ({searchParams}: Props) => {
  const {bottom} = useSafeAreaInsets();

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

  useEffect(() => {
    if (!isEqual(searchParams, {})) {
      setParams({
        ...searchParams,
        post_search: POST_SEARCH.group_buying,
      });
    }
  }, [searchParams]);

  const onReact = async ({postId, isLiked}: TypeParamsLikePost) => {
    try {
      setList(pre => {
        return pre.map(item => {
          if (item?.id !== postId) {
            return item;
          }
          return {
            ...item,
            is_liked: !isLiked,
          };
        });
      });
      if (!isLiked) {
        await apiLikePost({
          type: REACT.sale,
          reactedId: postId,
        });
      } else {
        await apiUnLikePost({
          type: REACT.sale,
          reactedId: postId,
        });
      }
    } catch (err) {
      appAlert(err);
      setList(pre => {
        return pre.map(item => {
          if (item?.id !== postId) {
            return item;
          }
          return {
            ...item,
            is_liked: isLiked,
          };
        });
      });
    }
  };

  return (
    <View style={$container}>
      <StyleList
        data={list}
        renderItem={({item}) => <ItemSale item={item} onReact={onReact} />}
        keyExtractor={item => String(item.id)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
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

export default SearchListGroupBuying;
