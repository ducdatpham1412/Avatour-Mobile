import {apiGetListSalesLiked} from 'api/profile';
import {APP_EVENT, STATUS, REACT} from 'asset/enum';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {ItemSale, Separator} from 'components';
import {StyleList} from 'components/base';
import {useAppEvent, usePaging, useSafeArea} from 'hook';
import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {onReactPost} from 'utility/assistant';

const FavoriteSales = () => {
  const {bottom} = useSafeArea();
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

  const renderItemSale = useCallback((item: TypeGroupBuying) => {
    return (
      <ItemSale
        item={item}
        onReact={() =>
          onReactPost(item.id, {
            type: REACT.sale,
            setList,
          })
        }
      />
    );
  }, []);

  return (
    <StyleList
      data={list}
      contentContainerStyle={[$contentContainer, {paddingBottom: bottom}]}
      keyExtractor={item => String(item?.id)}
      renderItem={({item}) => renderItemSale(item)}
      refreshing={refreshing}
      loadingMore={loadingMore}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      numColumns={2}
      initialNumToRender={6}
      initLoading={initLoading}
      columnWrapperStyle={{justifyContent: 'space-between'}}
      ItemSeparatorComponent={Separator}
    />
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingTop: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};

export default FavoriteSales;
