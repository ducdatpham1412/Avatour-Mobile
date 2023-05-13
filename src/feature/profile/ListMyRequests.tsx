import {View, Text} from 'react-native';
import React from 'react';
import {useMyRequests} from './hooks';
import {StyleContainer, StyleList} from 'components/base';
import {ItemRequest} from './components';

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
