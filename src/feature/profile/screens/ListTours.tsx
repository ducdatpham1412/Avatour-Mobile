import {apiGetListTours} from 'api/discovery';
import {REACT} from 'asset/enum';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {ItemTour} from 'components';
import {StyleList} from 'components/base';
import {usePaging} from 'hook';
import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {onReactSale} from 'utility/assistant';

interface Props {
  userId: number;
}

const ListTours = ({userId}: Props) => {
  const {bottom} = useSafeAreaInsets();
  const {
    list,
    setList,
    refreshing,
    onRefresh,
    onLoadMore,
    loadingMore,
    initLoading,
  } = usePaging<Tour>({
    request: apiGetListTours,
    params: {
      user_id: userId,
    },
  });

  const renderItem = useCallback(({item}: {item: Tour}) => {
    return (
      <ItemTour
        item={item}
        onReact={() => {
          onReactSale(item.id, {
            type: REACT.tour,
            setList,
          });
        }}
      />
    );
  }, []);

  return (
    <StyleList
      data={list}
      renderItem={renderItem}
      keyExtractor={item => String(item?.id)}
      contentContainerStyle={[
        $contentContainer,
        {paddingBottom: bottom || safePaddingNotZero},
      ]}
      refreshing={refreshing}
      onRefresh={onRefresh}
      loadingMore={loadingMore}
      onLoadMore={onLoadMore}
      initLoading={initLoading}
    />
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingBottom: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};

export default ListTours;
