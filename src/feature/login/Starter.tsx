import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {SafeView} from 'components/base';
import LoadingScreen from 'components/LoadingScreen';
import {useTheme} from 'hook';
import Redux from 'hook/useRedux';
import TopTabNavigator from 'navigation/components/TopTabNavigator';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import ChoosingLoginOrEnjoy from './ChoosingLoginOrEnjoy';
import BackgroundAuthen from './components/BackgroundAuthen';
import LoginScreen from './LoginScreen';
import SignUpForm from './signUp/SignUpForm';

const TopTab = createMaterialTopTabNavigator();

const Starter = () => {
  const isLoading = Redux.getIsLoading();
  const theme = useTheme();

  return (
    <SafeView>
      <TopTab.Navigator
        tabBar={(props: MaterialTopTabBarProps) => (
          <TopTabNavigator
            materialProps={props}
            containerStyle={$tabBarContainer}
            listRouteName={['login.enjoy', 'login.login', 'login.register']}
            titleStyle={{color: theme.black}}
          />
        )}
        initialRouteName={LOGIN_ROUTE.loginScreen}
        sceneContainerStyle={$sceneContainer}>
        <TopTab.Screen
          name={LOGIN_ROUTE.choosingLoginOrEnjoy}
          component={ChoosingLoginOrEnjoy}
          options={{lazy: true}}
        />
        <TopTab.Screen name={LOGIN_ROUTE.loginScreen} component={LoginScreen} />
        <TopTab.Screen
          name={LOGIN_ROUTE.signUpForm}
          component={SignUpForm}
          options={{lazy: true}}
        />
      </TopTab.Navigator>

      {isLoading && <LoadingScreen />}
    </SafeView>
  );
};

const $tabBarContainer: ViewStyle = {
  width: '90%',
  backgroundColor: 'transparent',
  alignSelf: 'center',
};
const $sceneContainer: ViewStyle = {
  backgroundColor: 'transparent',
};

export default Starter;
