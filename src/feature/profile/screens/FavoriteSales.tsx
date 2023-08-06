import {apiGetListSalesLiked} from 'api/profile';
import {APP_EVENT} from 'asset/enum';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {ItemSale} from 'components';
import {StyleList} from 'components/base';
import {useAppEvent, usePaging} from 'hook';
import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {onReactSale} from 'utility/assistant';
import {scale} from 'utility/scale';

const FavoriteSales = () => {
  const {
    list,
    setList,
    refreshing,
    onRefresh,
    loadingMore,
    onLoadMore,
    initLoading,
  } = usePaging<TypeGroupBuying>({
    request: apiGetListSalesLiked,
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

  useAppEvent(APP_EVENT.editSale, data => {
    setList(pre => {
      return pre.map(sale => {
        if (sale.id !== data?.post_id) {
          return sale;
        }
        return {
          ...sale,
          ...data.data,
        };
      });
    });
  });

  const renderItemSale = useCallback((item: TypeGroupBuying, index: number) => {
    return (
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
    );
  }, []);

  return (
    <StyleList
      data={list}
      contentContainerStyle={$contentContainer}
      keyExtractor={item => String(item?.id)}
      renderItem={({item, index}) => renderItemSale(item, index)}
      refreshing={refreshing}
      loadingMore={loadingMore}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      numColumns={2}
      initialNumToRender={6}
      initLoading={initLoading}
    />
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingBottom: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};

export default FavoriteSales;
