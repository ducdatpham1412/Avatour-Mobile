import {apiGetListSalesLiked} from 'api/profile';
import {HORIZONTAL_PADDING} from 'asset';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemSale} from 'components';
import {StyleList} from 'components/base';
import {usePaging} from 'hook';
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
  } = usePaging({
    request: apiGetListSalesLiked,
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
        hidingElements={['location', 'name']}
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
  paddingHorizontal: HORIZONTAL_PADDING,
};

export default FavoriteSales;
