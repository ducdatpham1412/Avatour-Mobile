import {apiGetListGroupBuying} from 'api/profile';
import {HORIZONTAL_PADDING} from 'asset';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemSale} from 'components';
import {StyleList} from 'components/base';
import {usePaging} from 'hook';
import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {onReactSale} from 'utility/assistant';
import {scale} from 'utility/scale';

interface Props {
  userId: number;
}

const ListSales = ({userId}: Props) => {
  const {
    list,
    setList,
    refreshing,
    onRefresh,
    onLoadMore,
    loadingMore,
    initLoading,
  } = usePaging({
    request: apiGetListGroupBuying,
    params: {
      userId,
    },
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
      style={$container}
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

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: HORIZONTAL_PADDING,
};
const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingBottom: safePaddingNotZero,
};

export default ListSales;
