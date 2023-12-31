import {apiGetListTours} from 'api/discovery';
import {REACT} from 'asset/enum';
import {
  horizontalPadding,
  safePaddingNotZero,
  verticalMargin,
} from 'asset/metrics';
import {ItemTour} from 'components';
import {StyleList} from 'components/base';
import {usePaging, useSafeArea} from 'hook';
import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {onReactPost} from 'utility/assistant';

interface Props {
  userId: number;
}

const ListTours = ({userId}: Props) => {
  const {paddingBottom} = useSafeArea();
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
          onReactPost(item.id, {
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
      contentContainerStyle={[$contentContainer, {paddingBottom}]}
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
  paddingHorizontal: horizontalPadding,
  gap: 1.5 * verticalMargin,
  paddingTop: safePaddingNotZero,
};

export default ListTours;
