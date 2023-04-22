import {View, Text, ViewStyle} from 'react-native';
import React from 'react';
import {HORIZONTAL_PADDING} from 'asset';
import {safePaddingNotZero} from 'asset/metrics';
import {StyleList} from 'components/base';

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
  paddingHorizontal: HORIZONTAL_PADDING,
};

export default FavoriteTours;
