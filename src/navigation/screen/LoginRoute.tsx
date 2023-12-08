import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {
  AgreeTermOfService,
  ConfirmOpenAccount,
  EditBasicInformation,
  ForgetPasswordForm,
  ForgetPasswordType,
  LoginScreen,
  SendOTP,
  SignUpForm,
} from 'feature/login';
import {HeaderLeftIcon} from 'navigation/components';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import React from 'react';

const Stack = createStackNavigator<AppParamsList>();

const renderHeader = (props: any) => {
  return <HeaderLeftIcon {...props} />;
};

const LoginRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerLeft: (props: any) => renderHeader(props),
        headerShown: false,
      }}>
      <Stack.Screen name={LOGIN_ROUTE.loginScreen} component={LoginScreen} />

      <Stack.Screen
        name={LOGIN_ROUTE.confirmOpenAccount}
        component={ConfirmOpenAccount}
      />
      <Stack.Screen name={LOGIN_ROUTE.signUpForm} component={SignUpForm} />
      <Stack.Screen
        name={LOGIN_ROUTE.editBasicInformation}
        component={EditBasicInformation}
      />

      {/* Send OTP */}
      <Stack.Screen name={LOGIN_ROUTE.sendOTP} component={SendOTP} />

      <Stack.Screen
        name={LOGIN_ROUTE.agreeTermOfService}
        component={AgreeTermOfService}
      />

      <Stack.Screen
        name={LOGIN_ROUTE.forgetPasswordType}
        component={ForgetPasswordType}
      />
      <Stack.Screen
        name={LOGIN_ROUTE.forgetPasswordForm}
        component={ForgetPasswordForm}
      />
    </Stack.Navigator>
  );
};

export default LoginRoute;
