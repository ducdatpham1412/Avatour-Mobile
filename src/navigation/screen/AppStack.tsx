import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useAppSelector} from 'app-redux/store';
import ModalPreviewLink from 'components/ModalPreviewLink';
import SwipeImages from 'components/SwipeImages';
import {DetailMeJoin, DetailSale} from 'feature/common';
import EditHistory from 'feature/common/EditHistory';
import PostsArchived from 'feature/common/PostsArchived';
import UpdateBankAccount from 'feature/common/UpdateBankAccount';
import UpdatePrices from 'feature/common/UpdatePrices';
import UpgradeAccount from 'feature/common/UpgradeAccount';
import {
  DetailTour,
  GoToDeposit,
  JoinHistory,
  ListJoining,
  ScanResult,
} from 'feature/discovery';
import InteractBubble from 'feature/discovery/InteractBubble';
import ReportUser from 'feature/discovery/ReportUser';
import SearchScreen from 'feature/discovery/SearchScreen';
import {SendOTP} from 'feature/login';
import {ChatDetail, ChatDetailSetting, MessScreen} from 'feature/mess';
import DetailBubble from 'feature/notification/DetailBubble';
import {
  CreatePostPickImage,
  CreatePostPreview,
  CreateSale,
  CreateTour,
  EditProfile,
  ListFollows,
  ListMyRequests,
  MyProfile,
  MyQRCode,
  OtherProfile,
} from 'feature/profile';
import {
  AboutUs,
  ConfirmDeleteAccount,
  ConfirmLockAccount,
  EnterPassword,
  ExtendSetting,
  PersonalInformation,
  SecurityAndLogin,
  SettingScreen,
} from 'feature/setting';
import {useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN, {
  DISCOVERY_ROUTE,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  SETTING_ROUTE,
} from 'navigation/config/routes';
import React from 'react';
import MainTabs from './MainTabs';

const modalPreviewLinkRef = React.createRef<ModalPreviewLink>();
export const showPreviewLink = (item: TypeBubblePalace) => {
  modalPreviewLinkRef.current?.show(item);
};

const Stack = createStackNavigator<AppParamsList>();

const AppStack = () => {
  const theme = useTheme();
  const {gestureHandle} = useAppSelector(state => state.logicSlice);

  const cardStyle = {
    backgroundColor: theme.backgroundColor,
  };

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={ROOT_SCREEN.mainScreen} component={MainTabs} />

      <Stack.Screen name={ROOT_SCREEN.otherProfile} component={OtherProfile} />
      <Stack.Screen name={ROOT_SCREEN.listFollows} component={ListFollows} />
      <Stack.Screen name={ROOT_SCREEN.detailBubble} component={DetailBubble} />
      <Stack.Screen name={ROOT_SCREEN.myProfile} component={MyProfile} />
      <Stack.Screen name={ROOT_SCREEN.editProfile} component={EditProfile} />
      <Stack.Screen name={LOGIN_ROUTE.sendOTP} component={SendOTP} />

      {/* Interact Bubble */}
      <Stack.Screen
        options={{
          cardStyle: [{backgroundColor: theme.backgroundOpacity(0.3)}],
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        name={ROOT_SCREEN.interactBubble}
        component={InteractBubble}
      />

      {/* Swipe Image */}
      <Stack.Screen
        options={{
          cardStyle,
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        name={ROOT_SCREEN.swipeImages}
        component={SwipeImages}
      />

      <Stack.Screen name={ROOT_SCREEN.reportUser} component={ReportUser} />

      <Stack.Screen
        name={PROFILE_ROUTE.createPostPreview}
        component={CreatePostPreview}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={PROFILE_ROUTE.createPostPickImg}
        component={CreatePostPickImage}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={PROFILE_ROUTE.createSale}
        component={CreateSale}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={PROFILE_ROUTE.updatePrices}
        component={UpdatePrices}
      />
      <Stack.Screen
        name={PROFILE_ROUTE.listMyRequests}
        component={ListMyRequests}
      />
      <Stack.Screen name={PROFILE_ROUTE.myQRCode} component={MyQRCode} />
      <Stack.Screen
        name={PROFILE_ROUTE.createTour}
        component={CreateTour}
        options={{gestureEnabled: false}}
      />

      <Stack.Screen name={ROOT_SCREEN.messScreen} component={MessScreen} />
      <Stack.Screen name={ROOT_SCREEN.chatDetail} component={ChatDetail} />
      <Stack.Screen
        name={ROOT_SCREEN.chatDetailSetting}
        component={ChatDetailSetting}
      />

      <Stack.Screen
        name={ROOT_SCREEN.postsArchived}
        component={PostsArchived}
      />
      <Stack.Screen
        name={ROOT_SCREEN.upgradeAccount}
        component={UpgradeAccount}
      />
      <Stack.Screen name={ROOT_SCREEN.editHistory} component={EditHistory} />
      <Stack.Screen
        name={ROOT_SCREEN.updateBankAccount}
        component={UpdateBankAccount}
      />
      <Stack.Screen
        name={DISCOVERY_ROUTE.searchScreen}
        component={SearchScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: gestureHandle.searchScreen,
        }}
      />
      <Stack.Screen
        name={ROOT_SCREEN.detailSale}
        component={DetailSale}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name={ROOT_SCREEN.detailMeJoin}
        component={DetailMeJoin}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name={ROOT_SCREEN.detailTour}
        component={DetailTour}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      {/* Setting screens */}
      <Stack.Screen
        name={SETTING_ROUTE.settingScreen}
        component={SettingScreen}
      />
      <Stack.Screen
        name={SETTING_ROUTE.security}
        component={SecurityAndLogin}
      />
      <Stack.Screen
        name={SETTING_ROUTE.confirmLockAccount}
        component={ConfirmLockAccount}
      />
      <Stack.Screen
        name={SETTING_ROUTE.confirmDeleteAccount}
        component={ConfirmDeleteAccount}
      />
      <Stack.Screen
        name={SETTING_ROUTE.personalInformation}
        component={PersonalInformation}
      />
      <Stack.Screen
        name={SETTING_ROUTE.enterPassword}
        component={EnterPassword}
      />
      <Stack.Screen name={SETTING_ROUTE.aboutUs} component={AboutUs} />
      <Stack.Screen
        name={SETTING_ROUTE.extendSetting}
        component={ExtendSetting}
      />
      <Stack.Screen name={ROOT_SCREEN.goToDeposit} component={GoToDeposit} />
      <Stack.Screen
        name={ROOT_SCREEN.scanResult}
        component={ScanResult}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name={ROOT_SCREEN.joinsHistory} component={JoinHistory} />
      <Stack.Screen name={ROOT_SCREEN.listJoining} component={ListJoining} />
    </Stack.Navigator>
  );
};

export default AppStack;
