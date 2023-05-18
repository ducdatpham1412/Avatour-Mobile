import {
  NavigationContainer,
  NavigationState,
  PartialState,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
  createStackNavigator,
} from '@react-navigation/stack';
import AlertYesNo from 'components/AlerYesNo';
import Alert from 'components/Alert';
import LoadingScreen from 'components/LoadingScreen';
import StylePicker from 'components/base/picker/StylePicker';
import ErrorScreen from 'feature/common/ErrorScreen';
import {useInitApp, useTheme} from 'hook';
import {navigationRef} from 'navigation/NavigationService';
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

const trackActiveRoute = (
  s?: NavigationState | PartialState<NavigationState>,
  level = 0,
) => {
  if (__DEV__) {
    if (s?.index === undefined) return;
    const {name, params, state} = s.routes[s.index];
    console.info(' '.repeat(level), level ? '⎿' : '', name, params || '');
    trackActiveRoute(state, level + 1);
  }
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
    <NavigationContainer ref={navigationRef} onStateChange={trackActiveRoute}>
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
