import {FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {TabView} from 'components';
import {StyleIcon, StyleText} from 'components/base';
import React from 'react';
import {ImageSourcePropType, TextStyle, View, ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {scale} from 'utility/scale';
import FavoriteSales from './FavoriteSales';
import FavoriteTours from './FavoriteTours';

interface IconTabBarProps {
  icon: ImageSourcePropType;
  title: I18Normalize;
}

const IconTabBar = ({icon, title}: IconTabBarProps) => {
  return (
    <View style={$titleView}>
      <StyleIcon source={icon} size={13} />
      <StyleText i18Text={title} customStyle={[$title]} />
    </View>
  );
};

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
const $titleView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f4,
  marginLeft: 4,
};

export default ListFavorites;
