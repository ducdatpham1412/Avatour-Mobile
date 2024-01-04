import {ACCOUNT, APP_EVENT} from 'asset/enum';
import {
  horizontalPadding,
  safePaddingNotZero,
  verticalMargin,
} from 'asset/metrics';
import {ItemCheckIn} from 'components';
import {StyleList} from 'components/base';
import {useAppEvent, useSafeArea} from 'hook';
import React, {useMemo} from 'react';
import {ViewStyle} from 'react-native';
import {useCheckIn} from '../hooks';

interface Props {
  userId: number;
  accountType: number;
}

const renderItem = ({item}: {item: TypeCheckIn}) => {
  return <ItemCheckIn item={item} />;
};

const ListCheckIn = ({userId, accountType}: Props) => {
  const {paddingBottom} = useSafeArea();
  const [{data, refreshing, loadingMore, loading}, {onRefresh, onLoadMore}] =
    useCheckIn(
      accountType === ACCOUNT.shop || accountType === ACCOUNT.location
        ? 'check-in'
        : 'my-check-in',
      userId,
    );

  const list = useMemo(
    () =>
      data?.reduce((pre, cur) => {
        pre.push(...cur.data);
        return pre;
      }, [] as TypeCheckIn[]),
    [data],
  );

  useAppEvent(APP_EVENT.checkInSuccess, e => {
    if (e.userId === userId) {
      onRefresh();
    }
  });

  return (
    <StyleList
      data={list ?? []}
      renderItem={renderItem}
      contentContainerStyle={[$content, {paddingBottom}]}
      keyExtractor={item => String(item?.id)}
      refreshing={refreshing}
      loadingMore={loadingMore}
      initLoading={loading}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
    />
  );
};

const $content: ViewStyle = {
  gap: 1.5 * verticalMargin,
  paddingTop: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};

export default ListCheckIn;
