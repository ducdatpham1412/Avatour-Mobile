import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
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
    </Stack.Navigator>
  );
};

export default SettingRoute;
