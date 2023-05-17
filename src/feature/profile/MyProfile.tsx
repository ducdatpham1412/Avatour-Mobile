import {useRoute} from '@react-navigation/native';
import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import Images from 'asset/img/images';
import {TabView} from 'components';
import {StyleContainer, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {PROFILE_ROUTE, SETTING_ROUTE} from 'navigation/config';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useUpdate, useUpdateEffect} from 'react-use';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, scale} from 'utility/scale';
import {
  IconLeftMyProfile,
  IconTabBarProfile,
  InformationProfile,
} from './components';
import {ListFavorites, ListJoiningAndJoined, ListSales} from './screens';

const MyProfile = () => {
  const update = useUpdate();
  const theme = useTheme();
  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const route = useRoute();

  useUpdateEffect(() => {
    update();
  }, [profile?.id]);

  const renderShop = () => {
    return (
      <ListSales userId={profile?.id} account_type={profile?.account_type} />
    );
  };

  const renderReview = () => {
    return <View />;
  };

  const renderIconLeft = () => {
    if (route.name === PROFILE_ROUTE.myProfile) {
      return <IconLeftMyProfile />;
    }
    return undefined;
  };

  return (
    <StyleContainer
      headerProps={{
        title: profile?.name as I18Normalize,
        LeftComponent: renderIconLeft(),
        RightComponent: (
          <StyleTouchable onPress={() => navigate(SETTING_ROUTE.settingScreen)}>
            <AntDesign
              name="setting"
              style={{fontSize: moderateScale(17), color: theme.black}}
            />
          </StyleTouchable>
        ),
      }}
      customStyle={$content}>
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
          <IconTabBarProfile title="profile.shop" icon={Images.icons.shop} />,
          <IconTabBarProfile title="profile.gbOrder" icon={Images.icons.bag} />,
          <IconTabBarProfile
            title="profile.favorite"
            icon={Images.icons.heartBold}
          />,
          <IconTabBarProfile
            title="profile.reviewProvider"
            icon={Images.icons.review}
          />,
        ]}
        initialIndex={profile.account_type === ACCOUNT.shop ? 0 : 1}
      />
    </StyleContainer>
  );
};

const $body: ViewStyle = {
  flex: 1,
};
const $tabBar: ViewStyle = {
  paddingHorizontal: scale(16),
};
const $content: ViewStyle = {
  paddingHorizontal: 0,
};

export default MyProfile;
