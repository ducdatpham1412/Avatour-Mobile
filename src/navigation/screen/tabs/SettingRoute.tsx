import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import AboutUs from 'feature/setting/aboutUs/AboutUs';
import EnterPassword from 'feature/setting/personalInfo/EnterPassword';
import PersonalInformation from 'feature/setting/personalInfo/PersonalInformation';
import ConfirmDeleteAccount from 'feature/setting/security/ConfirmDeleteAccount';
import ConfirmLockAccount from 'feature/setting/security/ConfirmLockAccount';
import SecurityAndLogin from 'feature/setting/security/SecurityAndLogin';
import SettingScreen from 'feature/setting/SettingScreen';
import {AppParamsList} from 'navigation/config';
import {SETTING_ROUTE} from 'navigation/config/routes';
import React from 'react';

const Stack = createStackNavigator<AppParamsList>();

const SettingRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerShown: false,
      }}>
      <Stack.Screen
        name={SETTING_ROUTE.settingScreen}
        component={SettingScreen}
      />

      {/* Security and login */}
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

      {/* Personal information */}
      <Stack.Screen
        name={SETTING_ROUTE.personalInformation}
        component={PersonalInformation}
      />
      <Stack.Screen
        name={SETTING_ROUTE.enterPassword}
        component={EnterPassword}
      />

      {/* About us */}
      <Stack.Screen name={SETTING_ROUTE.aboutUs} component={AboutUs} />
    </Stack.Navigator>
  );
};

export default SettingRoute;
