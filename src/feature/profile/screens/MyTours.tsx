import {apiGetListTours} from 'api/discovery';
import {useAppSelector} from 'app-redux/store';
import {APP_EVENT, REACT} from 'asset/enum';
import {safePaddingNotZero} from 'asset/metrics';
import {ItemTour, Separator} from 'components';
import {StyleList} from 'components/base';
import {useAppEvent, usePaging, useSafeArea} from 'hook';
import React, {useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {onReactPost} from 'utility/assistant';

const MyTours = () => {
  const {bottom} = useSafeArea();
  const {id: myId} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const {list, setList, refreshing, onRefresh, onLoadMore, initLoading} =
    usePaging({
      request: apiGetListTours,
      params: {
        user_id: myId,
      },
    });

  useAppEvent(APP_EVENT.createNewTour, e => {
    setList(pre => [e.newTour].concat(pre));
  });

  useAppEvent(APP_EVENT.editTour, onRefresh);

  useAppEvent(APP_EVENT.deleteTour, e => {
    setList(pre => pre.filter(item => item.id !== e.tourId));
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
      keyExtractor={item => item.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={onLoadMore}
      contentContainerStyle={[$content, {paddingBottom: bottom}]}
      initLoading={initLoading}
      ItemSeparatorComponent={Separator}
    />
  );
};

const $content: ViewStyle = {
  paddingTop: safePaddingNotZero,
  alignItems: 'center',
  flexGrow: 1,
};

export default MyTours;
