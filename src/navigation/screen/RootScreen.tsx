import {
  CardStyleInterpolators,
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import StylePicker from 'components/base/picker/StylePicker';
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

const alertOption: StackNavigationOptions = {
  animationEnabled: false,
  cardOverlayEnabled: true,
  headerShown: false,
};

const RootScreen = () => {
  const theme = useTheme();
  const {loading, error, isInApp, forceLogOut} = useInitApp();

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen onPress={forceLogOut} />;
  }

  const ChooseRoute = isInApp ? AppStack : LoginRoute;

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <RootStack.Screen name="check" component={ChooseRoute} />

      {/* Web view */}
      <RootStack.Screen
        name={ROOT_SCREEN.webView}
        component={WebViewScreen}
        options={{
          cardStyle: [
            {
              backgroundColor: theme.backgroundColor,
            },
          ],
        }}
      />

      {/* Picker */}
      <RootStack.Screen
        name={ROOT_SCREEN.picker}
        component={StylePicker}
        options={{
          cardStyle: [
            {
              backgroundColor: theme.backgroundOpacity(),
            },
          ],
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}
      />
    </RootStack.Navigator>
  );
};

export default RootScreen;
