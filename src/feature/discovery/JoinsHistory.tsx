import {safePaddingNotZero} from 'asset/metrics';
import {StyleContainer, StyleList} from 'components/base';
import {useApi} from 'hook';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'utility/scale';
import {ItemJoin} from './components';

const JoinsHistory = ({
  route: {
    params: {saleId, mode},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.joinsHistory]>) => {
  const {bottom} = useSafeAreaInsets();

  const {data, loading, validating, mutate} = useApi<TypeJoinEstimate[]>({
    path: `/profile/sales/join/${saleId}`,
    params: {
      type: 'join_history',
    },
    config: {
      revalidateAll: mode === 'go-from-notification',
    },
  });

  return (
    <StyleContainer
      headerProps={{
        title: 'discovery.buyingHistory',
      }}
      layOut="view">
      <StyleList
        data={data ?? []}
        keyExtractor={item => String(item?.id)}
        renderItem={({item}: {item: TypeJoinEstimate}) => (
          <ItemJoin
            item={item}
            containerStyle={$itemContainer}
            onPressMode="see-detail"
          />
        )}
        contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
        refreshing={validating}
        initLoading={loading}
        onRefresh={mutate}
      />
    </StyleContainer>
  );
};

const $itemContainer: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
};

export default JoinsHistory;
