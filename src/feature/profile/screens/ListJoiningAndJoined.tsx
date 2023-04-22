import {apiGetListGBJoined, apiGetListGbJoining} from 'api/profile';
import {Metrics, safePaddingNotZero} from 'asset/metrics';
import {StyleList, StyleText} from 'components/base';
import {usePaging} from 'hook';
import React, {useCallback} from 'react';
import {ScrollView, StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';
import {ItemJoinProfile} from '../components';
import {FONT_SIZE, HORIZONTAL_PADDING} from 'asset';

const ListJoiningAndJoined = () => {
  const dataJoining = usePaging<TypeMeJoinResponse>({
    request: apiGetListGbJoining,
  });
  const {list, refreshing, onRefresh, onLoadMore, loadingMore, initLoading} =
    usePaging({
      request: apiGetListGBJoined,
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
      style={$container}
      contentContainerStyle={$contentContainer}
      ListHeaderComponent={renderHeaderComponent()}
      showsVerticalScrollIndicator
    />
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingBottom: safePaddingNotZero,
  paddingHorizontal: HORIZONTAL_PADDING,
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
