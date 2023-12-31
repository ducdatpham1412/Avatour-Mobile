import {verticalMargin} from 'asset/metrics';
import {Separator} from 'components';
import {StyleContainer, StyleList} from 'components/base';
import {useSafeArea} from 'hook';
import React from 'react';
import {ItemRequest} from './components';
import {useMyRequests} from './hooks';

const renderItem = ({item}: {item: TypeGetRequestResponse}) => {
  return <ItemRequest item={item} />;
};

const ListMyRequests = () => {
  const {paddingBottom} = useSafeArea();
  const [{data, initLoading, validating}, {mutate}] = useMyRequests();

  return (
    <StyleContainer
      headerProps={{
        title: 'profile.myRequests',
      }}
      layOut="view">
      <StyleList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item?.id)}
        initLoading={initLoading}
        refreshing={validating}
        onRefresh={mutate}
        contentContainerStyle={{
          paddingBottom,
          paddingTop: verticalMargin,
        }}
        ItemSeparatorComponent={Separator}
      />
    </StyleContainer>
  );
};

export default ListMyRequests;
