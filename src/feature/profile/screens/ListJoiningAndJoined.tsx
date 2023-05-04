import {apiGetListGBJoined, apiGetListGbJoining} from 'api/profile';
import {FONT_SIZE} from 'asset';
import {APP_EVENT, GROUP_BUYING_STATUS} from 'asset/enum';
import {Metrics, horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {StyleList, StyleText} from 'components/base';
import {useAppEvent, usePaging} from 'hook';
import React, {useCallback} from 'react';
import {ScrollView, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';
import {ItemJoinProfile} from '../components';

const ListJoiningAndJoined = () => {
  const dataJoining = usePaging<TypeMeJoinResponse>({
    request: apiGetListGbJoining,
  });
  const {list, refreshing, onRefresh, onLoadMore, loadingMore, initLoading} =
    usePaging({
      request: apiGetListGBJoined,
    });

  useAppEvent(APP_EVENT.requestBoughtJoin, data => {
    dataJoining.setList(pre => {
      return pre.map(join => {
        if (join.id !== data?.joinId) {
          return join;
        }
        return {
          ...join,
          status: GROUP_BUYING_STATUS.requestBought,
        };
      });
    });
  });

  const renderItemJoin = useCallback((item: TypeMeJoinResponse) => {
    return (
      <ItemJoinProfile
        item={item}
        containerStyle={$itemJoinSuccess}
        contentFontSize={FONT_SIZE.f2}
      />
    );
  }, []);

  const renderHeaderComponent = () => {
    return (
      <View style={$header}>
        <StyleText i18Text="profile.joining" customStyle={$textJoining} />
        <ScrollView
          horizontal
          style={$containerHeader}
          contentContainerStyle={$contentHeader}
          showsVerticalScrollIndicator={false}>
          {dataJoining.list.map(joining => (
            <ItemJoinProfile
              key={joining?.id}
              item={joining}
              containerStyle={$itemJoining}
            />
          ))}
        </ScrollView>
        <StyleText
          i18Text="profile.joinedSuccess"
          customStyle={$textJoinSuccess}
        />
      </View>
    );
  };

  return (
    <StyleList
      data={list}
      renderItem={({item}) => renderItemJoin(item)}
      keyExtractor={item => String(item?.id)}
      initLoading={initLoading || dataJoining.initLoading}
      refreshing={refreshing}
      onRefresh={() => {
        onRefresh();
        dataJoining.onRefresh();
      }}
      loadingMore={loadingMore}
      onLoadMore={onLoadMore}
      contentContainerStyle={$contentContainer}
      ListHeaderComponent={renderHeaderComponent()}
    />
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingBottom: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};
const $header: ViewStyle = {
  width: Metrics.width,
  left: -scale(12),
};
const $containerHeader: ViewStyle = {
  marginTop: verticalScale(8),
};
const $contentHeader: ViewStyle = {
  paddingLeft: scale(12),
  paddingRight: scale(12),
  paddingBottom: verticalScale(10),
};
const $textJoining: TextStyle = {
  marginLeft: scale(12),
  marginTop: verticalScale(8),
  fontWeight: 'bold',
};
const $textJoinSuccess: StyleProp<TextStyle> = [
  $textJoining,
  {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(8),
  },
];
const $itemJoining: ViewStyle = {
  marginRight: scale(8),
};
const $itemJoinSuccess: ViewStyle = {
  width: scale(351),
  marginBottom: verticalScale(8),
};

export default ListJoiningAndJoined;
