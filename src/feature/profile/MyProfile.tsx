import {apiGetPassport} from 'api/discovery';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import {IconTour} from 'asset/icons';
import Images from 'asset/img/images';
import {TabView} from 'components';
import {RefreshControl, StyleContainer, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList, PROFILE_ROUTE, SETTING_ROUTE} from 'navigation/config';
import React, {ElementRef, useEffect, useRef, useState} from 'react';
import {View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {logger} from 'utility/assistant';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {
  IconLeftMyProfile,
  IconTabBarProfile,
  InformationProfile,
} from './components';
import {ListFavorites, ListSales, MyTours} from './screens';

type TypeRouteParams = RouteParams<AppParamsList[PROFILE_ROUTE.myProfile]>;

interface TabViewNullProps {
  tabViewHeight: number;
}

interface TabViewProps {
  tabViewHeight: number;
  profile: TypeGetProfileResponse;
  routeParams: TypeRouteParams['route']['params'];
}

const refresh = async () => {
  try {
    const res = await apiGetPassport();
    updatePassport(res.data);
  } catch (err) {
    logger('Get passport error: ', err);
  }
};

const renderNull = () => {
  return <View />;
};

const TabViewNull = ({tabViewHeight}: TabViewNullProps) => {
  return (
    <TabView
      style={[$body, {height: tabViewHeight}]}
      listElements={[renderNull, renderNull, renderNull, renderNull]}
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
      initialIndex={1}
      tabBarType="fix-width"
    />
  );
};

const TabViewUser = ({tabViewHeight, profile, routeParams}: TabViewProps) => {
  const tabViewRef = useRef<ElementRef<typeof TabView>>(null);

  const shop = () => {
    return (
      <ListSales userId={profile?.id} account_type={profile?.account_type} />
    );
  };

  const review = () => {
    return <View />;
  };

  useEffect(() => {
    if (routeParams?.initIndex === 'tour') {
      tabViewRef.current?.navigateToIndex(1);
    }
  }, [routeParams]);

  return (
    <TabView
      ref={tabViewRef}
      style={[$body, {height: tabViewHeight}]}
      listElements={[shop, MyTours, ListFavorites, review]}
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
  );
};

const MyProfile = ({route}: TypeRouteParams) => {
  const theme = useTheme();

  const {
    passport: {profile},
    modeExp,
  } = useAppSelector(state => state.accountSlice);
  const [tabViewHeight, setTabViewHeight] = useState(0);

  const iconLeft = () => {
    if (route.name === PROFILE_ROUTE.myProfile) {
      return <IconLeftMyProfile />;
    }
    return undefined;
  };

  const renderTabView = () => {
    if (modeExp) {
      return <TabViewNull tabViewHeight={tabViewHeight} />;
    }

    if (!profile.id) {
      return null;
    }

    return (
      <TabViewUser
        tabViewHeight={tabViewHeight}
        profile={profile}
        routeParams={route.params}
      />
    );
  };

  return (
    /**
     * TO DO: Consider move this to ScrollView of re animated
     */
    <StyleContainer
      headerProps={{
        title: 'common.null',
        LeftComponent: iconLeft(),
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
      {renderTabView()}
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
