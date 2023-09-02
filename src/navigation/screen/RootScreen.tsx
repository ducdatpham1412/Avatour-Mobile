import {createStackNavigator} from '@react-navigation/stack';
import ErrorScreen from 'feature/common/ErrorScreen';
import {LoadingScreen} from 'feature/profile/screens';
import {useInitApp, useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN from 'navigation/config/routes';
import React from 'react';
import AppStack from './AppStack';
import LoginRoute from './LoginRoute';
import WebViewScreen from './WebViewScreen';

const RootStack = createStackNavigator<AppParamsList>();

const RootScreen = () => {
  const theme = useTheme();
  const {loading, error, isInApp, forceLogOut} = useInitApp();

  if (loading) {
    return <LoadingScreen size={200} />;
  }
  if (error) {
    return <ErrorScreen onPress={forceLogOut} title="setting.logOut" />;
  }

  const ChooseRoute = isInApp ? AppStack : LoginRoute;

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="Check" component={ChooseRoute} />

      <RootStack.Screen
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
    </RootStack.Navigator>
  );
};

export default RootScreen;
