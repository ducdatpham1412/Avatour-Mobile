import {apiGetListTours} from 'api/discovery';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {ItemTour} from 'components';
import {StyleList} from 'components/base';
import {usePaging} from 'hook';
import React from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'utility/scale';

interface Props {
  userId: number;
}

const renderItemTour = (item: Tour) => {
  return <ItemTour item={item} containerStyle={$itemContainer} />;
};

const ListTours = ({userId}: Props) => {
  const {bottom} = useSafeAreaInsets();
  const {list, refreshing, onRefresh, onLoadMore, loadingMore} =
    usePaging<Tour>({
      request: apiGetListTours,
      params: {
        user_id: userId,
      },
    });

  return (
    <StyleList
      data={list}
      renderItem={({item}) => renderItemTour(item)}
      keyExtractor={item => String(item?.id)}
      contentContainerStyle={[
        $contentContainer,
        {paddingBottom: bottom || safePaddingNotZero},
      ]}
    />
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingBottom: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};
const $itemContainer: ViewStyle = {
  marginTop: verticalScale(7),
};

export default ListTours;
