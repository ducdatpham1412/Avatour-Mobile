import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useAppSelector} from 'app-redux/store';
import SwipeImages from 'components/SwipeImages';
import {DetailMeJoin, DetailSale} from 'feature/common';
import ErrorScreen from 'feature/common/ErrorScreen';
import UpdateBankAccount from 'feature/common/UpdateBankAccount';
import UpgradeAccount from 'feature/common/UpgradeAccount';
import {
  DetailTour,
  GoToDeposit,
  JoinHistory,
  ListJoining,
  MyListJoins,
  ScanResult,
} from 'feature/discovery';
import ReportUser from 'feature/discovery/ReportUser';
import SearchScreen from 'feature/discovery/SearchScreen';
import {SendOTP} from 'feature/login';
import {ChatDetail, ChatDetailSetting, MessScreen} from 'feature/mess';
import {
  CreateLocation,
  CreatePostPickImage,
  CreateSale,
  CreateTour,
  CreateTourSuccess,
  EditProfile,
  EditSalePrice,
  ListFollows,
  ListMyRequests,
  MyProfile,
  MyQRCode,
  OtherProfile,
} from 'feature/profile';
import {LoadingScreen} from 'feature/profile/screens';
import {
  AboutUs,
  ConfirmDeleteAccount,
  ConfirmLockAccount,
  EnterPassword,
  ExtendSetting,
  ListSvgIcon,
  PersonalInformation,
  SecurityAndLogin,
  SettingScreen,
} from 'feature/setting';
import {useInitApp, useNotifications, useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN, {
  DISCOVERY_ROUTE,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  SETTING_ROUTE,
} from 'navigation/config/routes';
import MainTabs from './MainTabs';
import WebViewScreen from './WebViewScreen';
import LoginRoute from './LoginRoute';
import {useEffect} from 'react';
import {parseURL} from 'utility/assistant';
import {TYPE_EVENT_DL} from 'asset/enum';
import {navigate} from 'navigation/NavigationService';

const Stack = createStackNavigator<AppParamsList>();

const handleEvent = (event: string, data: Record<string, string>) => {
  if (event === TYPE_EVENT_DL.join_success && data?.sale_id) {
    navigate(ROOT_SCREEN.joinsHistory, {
      saleId: Number(data.sale_id),
      mode: 'go-from-notification',
    });
  }
};

const RootScreen = () => {
  const theme = useTheme();
  const [{loading, error}, {mutate}] = useInitApp();
  const {link, resetNotification} = useNotifications();
  const {gestureHandle} = useAppSelector(state => state.logicSlice);

  useEffect(() => {
    if (loading || !link) {
      return;
    }
    const parse = parseURL(link ?? '');
    if (parse) {
      handleEvent(parse.event, parse.params);
      resetNotification();
    }
  }, [link, loading]);

  if (loading) {
    return <LoadingScreen size={200} />;
  }
  if (error) {
    return <ErrorScreen onPress={mutate} title="common.retry" />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={ROOT_SCREEN.mainScreen} component={MainTabs} />

      <Stack.Screen name={ROOT_SCREEN.otherProfile} component={OtherProfile} />
      <Stack.Screen name={ROOT_SCREEN.listFollows} component={ListFollows} />
      <Stack.Screen name={ROOT_SCREEN.myProfile} component={MyProfile} />
      <Stack.Screen name={ROOT_SCREEN.editProfile} component={EditProfile} />
      <Stack.Screen name={LOGIN_ROUTE.sendOTP} component={SendOTP} />
      <Stack.Screen
        options={{
          cardStyle: {
            backgroundColor: theme.background,
          },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
        name={ROOT_SCREEN.swipeImages}
        component={SwipeImages}
      />
      <Stack.Screen name={ROOT_SCREEN.reportUser} component={ReportUser} />

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
        name={PROFILE_ROUTE.listMyRequests}
        component={ListMyRequests}
      />
      <Stack.Screen name={PROFILE_ROUTE.myQRCode} component={MyQRCode} />
      <Stack.Screen
        name={PROFILE_ROUTE.createTour}
        component={CreateTour}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name={PROFILE_ROUTE.createTourSuccess}
        component={CreateTourSuccess}
        options={{gestureEnabled: false}}
      />
      <Stack.Screen
        name={ROOT_SCREEN.createLocation}
        component={CreateLocation}
        options={{gestureEnabled: false}}
      />

      <Stack.Screen name={ROOT_SCREEN.messScreen} component={MessScreen} />
      <Stack.Screen name={ROOT_SCREEN.chatDetail} component={ChatDetail} />
      <Stack.Screen
        name={ROOT_SCREEN.chatDetailSetting}
        component={ChatDetailSetting}
      />
      <Stack.Screen
        name={ROOT_SCREEN.upgradeAccount}
        component={UpgradeAccount}
      />
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
        name={ROOT_SCREEN.myListJoins}
        component={MyListJoins}
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
      <Stack.Screen name={ROOT_SCREEN.scanResult} component={ScanResult} />
      <Stack.Screen name={ROOT_SCREEN.joinsHistory} component={JoinHistory} />
      <Stack.Screen name={ROOT_SCREEN.listJoining} component={ListJoining} />
      <Stack.Screen
        name={ROOT_SCREEN.editSalePrice}
        component={EditSalePrice}
      />

      <Stack.Screen
        name={ROOT_SCREEN.webView}
        component={WebViewScreen}
        options={{
          cardStyle: [
            {
              backgroundColor: theme.background,
            },
          ],
        }}
      />

      <Stack.Screen
        name={ROOT_SCREEN.loginRoute}
        component={LoginRoute}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid,
          gestureEnabled: false,
        }}
      />

      {__DEV__ && (
        <Stack.Screen name={ROOT_SCREEN.svgIcons} component={ListSvgIcon} />
      )}
    </Stack.Navigator>
  );
};

export default RootScreen;
