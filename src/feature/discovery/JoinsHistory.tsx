import {safePaddingNotZero} from 'asset/metrics';
import {StyleContainer, StyleList} from 'components/base';
import {useDetailSale} from 'feature/common/hooks';
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

  const {data, loading, validating, mutate} = useApi<TypeJoinPersonal[]>({
    path: `/profile/sales/join/${saleId}`,
    params: {
      type: 'join_history',
    },
    config: {
      revalidateAll: mode === 'go-from-notification',
    },
  });
  const [{data: dataSale}] = useDetailSale(saleId);

  return (
    <StyleContainer
      headerProps={{
        title: 'discovery.buyingHistory',
      }}
      layOut="view">
      <StyleList
        data={data ?? []}
        keyExtractor={item => String(item?.id)}
        renderItem={({item}) => (
          <ItemJoin
            item={{
              ...item,
              sale: {
                images: dataSale?.images,
                name: dataSale?.name,
                creator: dataSale?.creator,
                creator_name: dataSale?.creator_name,
                creator_avatar: dataSale?.creator_avatar,
              },
            }}
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
