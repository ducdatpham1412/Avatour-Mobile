import {horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import {StyleList} from 'components/base';
import React from 'react';
import {ViewStyle} from 'react-native';

const FavoriteTours = () => {
  return (
    <StyleList
      data={[]}
      renderItem={({item}) => null}
      keyExtractor={item => String(item?.id)}
      contentContainerStyle={$contentContainer}
    />
  );
};

const $contentContainer: ViewStyle = {
  flexGrow: 1,
  paddingBottom: safePaddingNotZero,
  paddingHorizontal: horizontalPadding,
};

export default FavoriteTours;
