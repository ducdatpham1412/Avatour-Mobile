import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE} from 'asset';
import {ImageEmpty} from 'asset/icons';
import {verticalMargin} from 'asset/metrics';
import {StyleContainer, StyleList, StyleText} from 'components/base';
import {useApi, useSafeArea, useTheme} from 'hook';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {verticalScale} from 'utility/scale';
import {ItemJoin} from './components';

type TypeRouteParams = RouteParams<AppParamsList[ROOT_SCREEN.joinsHistory]>;

const EmptyView = () => {
  return (
    <View style={$empty}>
      <ImageEmpty size={300} />
      <StyleText
        i18Text="discovery.notHaveAnyOrder"
        customStyle={{
          fontSize: FONT_SIZE.f1,
          marginTop: verticalMargin,
          fontWeight: 'bold',
        }}
      />
    </View>
  );
};

const JoinsHistoryUser = ({
  saleId,
  mode,
}: TypeRouteParams['route']['params']) => {
  const {paddingBottom} = useSafeArea();

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
        contentContainerStyle={{paddingBottom, flexGrow: 1}}
        refreshing={validating}
        initLoading={loading}
        onRefresh={mutate}
        ListEmptyComponent={EmptyView}
      />
    </StyleContainer>
  );
};

const JoinsHistory = ({
  route: {
    params: {saleId, mode},
  },
}: TypeRouteParams) => {
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const theme = useTheme();

  if (modeExp) {
    return (
      <StyleContainer
        headerProps={{
          title: 'discovery.buyingHistory',
        }}
        backgroundColor={theme.white}>
        <EmptyView />
      </StyleContainer>
    );
  }

  return <JoinsHistoryUser saleId={saleId} mode={mode} />;
};

const $empty: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
};
const $itemContainer: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(12),
};

export default JoinsHistory;
