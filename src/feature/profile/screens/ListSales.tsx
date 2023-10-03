import {apiGetListGroupBuying} from 'api/profile';
import {ACCOUNT, APP_EVENT, STATUS, REACT} from 'asset/enum';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {ItemSale, Separator} from 'components';
import {StyleList} from 'components/base';
import {useAppEvent, usePaging, useSafeArea} from 'hook';
import React, {useCallback} from 'react';
import {View, ViewStyle} from 'react-native';
import {onReactPost} from 'utility/assistant';

interface Props {
  userId: number;
  account_type: number;
}

const ListSalesSupplier = ({userId}: Props) => {
  const {bottom} = useSafeArea();

  const {
    list,
    setList,
    refreshing,
    onRefresh,
    onLoadMore,
    loadingMore,
    initLoading,
  } = usePaging<TypeGroupBuying>({
    request: apiGetListGroupBuying,
    params: {
      userId,
    },
  });

  useAppEvent(APP_EVENT.createNewSale, data => {
    setList(pre => [data.newSale].concat(pre));
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
        hidingElements={['location']}
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

const ListSaleConsumer = (_: Props) => {
  return <View style={$container} />;
};

const ListSales = ({userId, account_type}: Props) => {
  if (account_type === ACCOUNT.shop) {
    return <ListSalesSupplier userId={userId} account_type={account_type} />;
  }
  return <ListSaleConsumer userId={userId} account_type={account_type} />;
};

const $container: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
};
const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: horizontalPadding,
  paddingTop: safePaddingNotZero,
};

export default ListSales;
