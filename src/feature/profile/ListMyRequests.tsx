import {safePaddingNotZero} from 'asset/metrics';
import {StyleContainer, StyleList} from 'components/base';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ItemRequest} from './components';
import {useMyRequests} from './hooks';

const ListMyRequests = () => {
  const {bottom} = useSafeAreaInsets();
  const [{data, initLoading, validating}, {mutate}] = useMyRequests();

  return (
    <StyleContainer
      headerProps={{
        title: 'profile.myRequests',
      }}
      layOut="view">
      <StyleList
        data={data}
        renderItem={({item}) => <ItemRequest item={item} />}
        keyExtractor={item => String(item?.id)}
        initLoading={initLoading}
        refreshing={validating}
        onRefresh={mutate}
        contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
      />
    </StyleContainer>
  );
};

export default ListMyRequests;
