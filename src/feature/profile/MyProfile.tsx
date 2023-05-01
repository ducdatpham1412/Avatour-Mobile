import {useAppSelector} from 'app-redux/store';
import {SafeView, StyleIcon, StyleText} from 'components/base';
import React, {ReactNode} from 'react';
import {InformationProfile} from './components';
import {ImageSourcePropType, TextStyle, View, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';
import {TabView} from 'components';
import {I18Normalize} from 'utility/I18Next';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset';
import {ListFavorites, ListJoiningAndJoined, ListSales} from './screens';
import {useUpdate, useUpdateEffect} from 'react-use';

interface IconTabBarProps {
  icon: ImageSourcePropType;
  title: I18Normalize;
}

const IconTabBar = ({icon, title}: IconTabBarProps) => {
  return (
    <>
      <StyleIcon source={icon} size={15} />
      <StyleText i18Text={title} customStyle={$title} />
    </>
  );
};

const MyProfile = () => {
  const update = useUpdate();
  const {profile} = useAppSelector(state => state.accountSlice.passport);

  useUpdateEffect(() => {
    update();
  }, [profile?.id]);

  const renderShop = () => {
    return <ListSales userId={profile?.id} />;
  };

  const renderReview = () => {
    return <View />;
  };

  return (
    <SafeView>
      <InformationProfile profile={profile} />
      <TabView
        style={$body}
        listElements={[
          renderShop,
          ListJoiningAndJoined,
          ListFavorites,
          renderReview,
        ]}
        tabBarStyle={$tabBar}
        listIconTabBar={[
          <IconTabBar title="profile.shop" icon={Images.icons.shop} />,
          <IconTabBar title="profile.gbOrder" icon={Images.icons.bag} />,
          <IconTabBar title="profile.favorite" icon={Images.icons.heartBold} />,
          <IconTabBar
            title="profile.reviewProvider"
            icon={Images.icons.review}
          />,
        ]}
      />
    </SafeView>
  );
};

const $body: ViewStyle = {
  flex: 1,
};
const $tabBar: ViewStyle = {
  paddingHorizontal: scale(16),
};
const $title: TextStyle = {
  fontSize: FONT_SIZE.f4,
  marginTop: 2,
};

export default MyProfile;
