import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import Alert from 'components/Alert';
import AlertYesNo from 'components/AlerYesNo';
import StylePicker from 'components/base/picker/StylePicker';
import LoadingScreen from 'components/LoadingScreen';
import {useInitApp, useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigationRef} from 'navigation/NavigationService';
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
  const {loading, error, isInApp} = useInitApp();

  if (loading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <LoadingScreen />;
  }

  const ChooseRoute = isInApp ? AppStack : LoginRoute;

  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen name="check" component={ChooseRoute} />

        {/* Alert */}
        <RootStack.Screen
          options={{
            ...alertOption,
            cardStyle: {
              backgroundColor: theme.backgroundOpacity(),
            },
          }}
          name={ROOT_SCREEN.alert}
          component={Alert}
        />
        {/* Alert yes no */}
        <RootStack.Screen
          options={{
            ...alertOption,
            cardStyle: {
              backgroundColor: theme.backgroundOpacity(),
            },
          }}
          name={ROOT_SCREEN.alertYesNo}
          component={AlertYesNo}
        />

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
    </NavigationContainer>
  );
};

export default RootScreen;
