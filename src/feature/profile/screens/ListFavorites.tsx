import Images from 'asset/img/images';
import {TabView} from 'components';
import {IconTabBar} from 'components/common';
import React from 'react';
import {ViewStyle} from 'react-native';
import {scale} from 'utility/scale';
import FavoriteSales from './FavoriteSales';
import FavoriteTours from './FavoriteTours';

const ListFavorites = () => {
  return (
    <TabView
      style={$container}
      listElements={[FavoriteTours, FavoriteSales]}
      tabBarStyle={{paddingHorizontal: scale(50)}}
      listIconTabBar={[
        <IconTabBar icon={Images.icons.tour} title="discovery.tour" />,
        <IconTabBar icon={Images.icons.shop} title="discovery.groupBuying" />,
      ]}
    />
  );
};

const $container: ViewStyle = {
  flex: 1,
};

export default ListFavorites;
