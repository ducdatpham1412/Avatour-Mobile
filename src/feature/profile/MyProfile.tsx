import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import Images from 'asset/img/images';
import {TabView} from 'components';
import {StyleContainer, StyleIcon, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {PROFILE_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {ModalActionSheet, TypeShowActionSheet} from 'navigation/screen/modals';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useUpdate, useUpdateEffect} from 'react-use';
import {I18Normalize} from 'utility/I18Next';
import {scale} from 'utility/scale';
import {IconTabBarProfile, InformationProfile} from './components';
import {ListFavorites, ListJoiningAndJoined, ListSales} from './screens';
import {useRoute} from '@react-navigation/native';

const listModalMyProfileShop: Array<TypeShowActionSheet> = [
  {
    title: 'profile.editProfile',
    onPress: () => navigate(ROOT_SCREEN.editProfile),
  },
  {
    title: 'setting.title',
    onPress: () => navigate(PROFILE_ROUTE.settingRoute),
  },
];

const listModalMyProfileConsumer: Array<TypeShowActionSheet> = [
  {
    title: 'profile.editProfile',
    onPress: () => navigate(ROOT_SCREEN.editProfile),
  },
  {
    title: 'profile.upgradeAccount',
    onPress: () => navigate(ROOT_SCREEN.upgradeAccount),
  },
  {
    title: 'setting.title',
    onPress: () => navigate(PROFILE_ROUTE.settingRoute),
  },
];

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

  return (
    <StyleContainer
      headerProps={{
        title: profile?.name as I18Normalize,
        showIconBack: route.name !== PROFILE_ROUTE.myProfile,
        RightComponent: (
          <StyleTouchable
            onPress={() =>
              ModalActionSheet.show({
                options:
                  profile?.account_type === ACCOUNT.shop
                    ? listModalMyProfileShop
                    : listModalMyProfileConsumer,
              })
            }>
            <StyleIcon
              source={Images.icons.more}
              size={20}
              customStyle={{tintColor: theme.black}}
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
