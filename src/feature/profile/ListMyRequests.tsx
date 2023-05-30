import {StyleContainer, StyleList} from 'components/base';
import React from 'react';
import {ItemRequest} from './components';
import {useMyRequests} from './hooks';

const ListMyRequests = () => {
  const [{data, initLoading, validating}, {mutate}] = useMyRequests();

  return (
    <StyleContainer
      headerProps={{
        title: 'profile.myRequests',
      }}>
      <StyleList
        data={data}
        renderItem={({item}) => <ItemRequest item={item} />}
        keyExtractor={item => String(item?.id)}
        initLoading={initLoading}
        refreshing={validating}
        onRefresh={mutate}
      />
    </StyleContainer>
  );
};

export default ListMyRequests;
