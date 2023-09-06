import Images from 'asset/img/images';
import {TabView} from 'components';
import {
  RefreshControl,
  StyleContainer,
  StyleIcon,
  StyleTouchable,
} from 'components/base';
import {useTheme} from 'hook';
import {AppParamsList, ROOT_SCREEN} from 'navigation/config';
import {ModalActionSheet} from 'navigation/screen/modals';
import React, {useState} from 'react';
import {ViewStyle} from 'react-native';
import {I18Normalize} from 'utility/I18Next';
import {scale, verticalScale} from 'utility/scale';
import {IconTabBarProfile, InformationProfile} from './components';
import {useOtherProfile} from './hooks';
import {ListReviews, ListSales, ListTours} from './screens';
import {ACCOUNT} from 'asset/enum';
import {IconTour} from 'asset/icons';

const OtherProfile = ({
  route: {
    params: {id, initValue},
  },
}: RouteParams<AppParamsList[ROOT_SCREEN.otherProfile]>) => {
  const theme = useTheme();
  const [
    {data, isFollowing, isBlocked, loading, validating},
    {follow, block, report, mutate},
  ] = useOtherProfile(id, {
    initValue,
    // TODO: Only = true when routeParam having revalidateAll = True => Add revalidateAll in routeParams
    revalidateAll: true,
  });

  const [tabViewHeight, setTabViewHeight] = useState(0);

  const isShopAccount = data?.account_type === ACCOUNT.shop;
  const isLocationAccount = data?.account_type === ACCOUNT.location;

  const onShowModalOptions = () => {
    if (!isBlocked) {
      ModalActionSheet.show({
        options: [
          {
            title: isFollowing ? 'profile.unFollow' : 'profile.follow',
            onPress: follow,
          },
          {
            title: isBlocked ? 'profile.unBlock' : 'profile.block',
            onPress: block,
          },
          {
            title: 'profile.report',
            onPress: report,
          },
        ],
      });
    }
  };

  const renderShop = () => {
    if (data) {
      return <ListSales userId={data?.id} account_type={data?.account_type} />;
    }
    return null;
  };

  const renderTour = () => {
    if (data) {
      return <ListTours userId={data?.id} />;
    }
    return null;
  };

  const renderListReviews = () => {
    if (data) {
      return (
        <ListReviews userId={data?.id} account_type={data?.account_type} />
      );
    }
    return null;
  };

  return (
    <StyleContainer
      headerProps={{
        title: data?.name as I18Normalize,
        RightComponent: !isBlocked && (
          <StyleTouchable onPress={onShowModalOptions}>
            <StyleIcon
              source={Images.icons.more}
              size={20}
              customStyle={{tintColor: theme.black}}
            />
          </StyleTouchable>
        ),
      }}
      customStyle={$content}
      backgroundColor={theme.white}
      onLayout={e => {
        setTabViewHeight(e.nativeEvent.layout.height);
      }}
      scrollEnabled
      stickyHeaderIndices={[1]}
      initLoading={loading || !data}
      refreshControl={
        <RefreshControl
          refreshing={validating && !loading}
          onRefresh={mutate}
        />
      }>
      {!isBlocked && data && (
        <>
          <InformationProfile profile={data} />
          <TabView
            style={[$body, {height: tabViewHeight}]}
            tabBarStyle={$tabBar}
            listElements={[renderShop, renderTour, renderListReviews]}
            listIconTabBar={[
              <IconTabBarProfile
                title="profile.shop"
                icon={Images.icons.shop}
              />,
              <IconTabBarProfile
                title="discovery.tour"
                icon={<IconTour size={22} />}
              />,
              <IconTabBarProfile
                title="profile.checkIn"
                icon={Images.icons.review}
              />,
            ]}
            initialIndex={isShopAccount ? 0 : isLocationAccount ? 2 : 1}
          />
        </>
      )}
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

export default OtherProfile;
