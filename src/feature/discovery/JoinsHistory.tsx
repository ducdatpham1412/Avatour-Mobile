import {FONT_SIZE} from 'asset';
import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {SafeView, StyleList} from 'components/base';
import {useDetailSale} from 'feature/common/hooks';
import {ItemJoinProfile} from 'feature/profile/components';
import {useApi} from 'hook';
import {StyleHeader} from 'navigation/components';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'utility/scale';

const JoinsHistory = ({
  route: {
    params: {saleId},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.joinsHistory]>) => {
  const {bottom} = useSafeAreaInsets();

  const {data, loading, validating} = useApi<TypeJoinPersonal[]>({
    path: `/profile/sales/join/${saleId}`,
    params: {
      type: 'join_history',
    },
  });
  const [{data: dataSale}] = useDetailSale(saleId);

  return (
    <SafeView style={$container}>
      <StyleHeader title="discovery.buyingHistory" />

      <StyleList
        data={data ?? []}
        keyExtractor={item => String(item?.id)}
        renderItem={({item}) => (
          <ItemJoinProfile
            item={{
              ...item,
              sale: {
                images: dataSale?.images,
                name: dataSale?.name,
                creator: dataSale?.creator,
                creator_avatar: dataSale?.creator_avatar,
              },
            }}
            containerStyle={$itemContainer}
            contentFontSize={FONT_SIZE.f2}
          />
        )}
        contentContainerStyle={{paddingBottom: bottom || safePaddingNotZero}}
        refreshing={validating}
        initLoading={loading}
      />
    </SafeView>
  );
};

const $container: ViewStyle = {
  width: '100%',
  paddingHorizontal: horizontalPadding,
};
const $itemContainer: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
};

export default JoinsHistory;
