import {apiGetPassport} from 'api/discovery';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import Images from 'asset/img/images';
import {TabView} from 'components';
import {RefreshControl, StyleContainer, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList, PROFILE_ROUTE, SETTING_ROUTE} from 'navigation/config';
import React, {ElementRef, useEffect, useRef, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useUpdate, useUpdateEffect} from 'react-use';
import {I18Normalize} from 'utility/I18Next';
import {logger} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {
  IconLeftMyProfile,
  IconTabBarProfile,
  InformationProfile,
} from './components';
import {ListFavorites, ListSales, MyTours} from './screens';
import {IconTour} from 'asset/icons';

const refresh = async () => {
  try {
    const res = await apiGetPassport();
    updatePassport(res.data);
  } catch (err) {
    logger('Get passport error: ', err);
  }
};

const MyProfile = ({
  route,
}: RouteParams<AppParamsList[PROFILE_ROUTE.myProfile]>) => {
  const update = useUpdate();
  const theme = useTheme();

  const {profile} = useAppSelector(state => state.accountSlice.passport);
  const tabViewRef = useRef<ElementRef<typeof TabView>>(null);
  const [tabViewHeight, setTabViewHeight] = useState(0);

  useEffect(() => {
    if (route.params?.initIndex === 'order') {
      tabViewRef.current?.navigateToIndex(1);
    }
  }, [route?.params]);

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
    /**
     * TO DO: Consider move this to ScrollView of re animated
     */
    <StyleContainer
      headerProps={{
        title: profile?.name as I18Normalize,
        LeftComponent: renderIconLeft(),
        RightComponent: (
          <StyleTouchable onPress={() => navigate(SETTING_ROUTE.settingScreen)}>
            <AntDesign
              name="setting"
              style={{fontSize: moderateScale(20), color: theme.black}}
            />
          </StyleTouchable>
        ),
      }}
      customStyle={$content}
      stickyHeaderIndices={[1]}
      onLayout={e => {
        setTabViewHeight(e.nativeEvent.layout.height);
      }}
      scrollEnabled
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
      backgroundColor={theme.white}>
      <InformationProfile profile={profile} />
      <TabView
        ref={tabViewRef}
        style={[$body, {height: tabViewHeight}]}
        listElements={[renderShop, MyTours, ListFavorites, renderReview]}
        tabBarStyle={$tabBar}
        listIconTabBar={[
          <IconTabBarProfile title="profile.shop" icon={Images.icons.shop} />,
          <IconTabBarProfile
            title="discovery.myTour"
            icon={<IconTour size={22} />}
          />,
          <IconTabBarProfile
            title="profile.favorite"
            icon={Images.icons.heartBold}
          />,
          <IconTabBarProfile
            title="profile.checkIn"
            icon={Images.icons.review}
          />,
        ]}
        initialIndex={profile.account_type === ACCOUNT.shop ? 0 : 1}
        tabBarType="fix-width"
      />
    </StyleContainer>
  );
};

const $body: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(8),
};
const $tabBar: ViewStyle = {
  paddingHorizontal: scale(16),
};
const $content: ViewStyle = {
  paddingHorizontal: 0,
};

export default MyProfile;
