import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import {Metrics} from 'asset/metrics';
import AboutUs from 'feature/setting/aboutUs/AboutUs';
import ExtendSetting from 'feature/setting/extend/ExtendSetting';
import EnterPassword from 'feature/setting/personalInfo/EnterPassword';
import PersonalInformation from 'feature/setting/personalInfo/PersonalInformation';
import SendOTPChangeInfo from 'feature/setting/personalInfo/SendOTPChangeInfo';
import ConfirmDeleteAccount from 'feature/setting/security/ConfirmDeleteAccount';
import ConfirmLockAccount from 'feature/setting/security/ConfirmLockAccount';
import SecurityAndLogin from 'feature/setting/security/SecurityAndLogin';
import SettingScreen from 'feature/setting/SettingScreen';
import Redux from 'hook/useRedux';
import {SETTING_ROUTE} from 'navigation/config/routes';
import React from 'react';

const SettingStack = createStackNavigator();
const {safeTopPadding} = Metrics;

const SettingRoute = () => {
    const theme = Redux.getTheme();

    return (
        <SettingStack.Navigator
            screenOptions={{
                gestureDirection: 'horizontal',
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                headerShown: false,
                cardStyle: {
                    backgroundColor: theme.backgroundColor,
                    paddingTop: safeTopPadding,
                },
            }}>
            <SettingStack.Screen
                name={SETTING_ROUTE.settingScreen}
                component={SettingScreen}
            />

            {/* Security and login */}
            <SettingStack.Screen
                name={SETTING_ROUTE.security}
                component={SecurityAndLogin}
            />
            <SettingStack.Screen
                name={SETTING_ROUTE.confirmLockAccount}
                component={ConfirmLockAccount}
            />
            <SettingStack.Screen
                name={SETTING_ROUTE.confirmDeleteAccount}
                component={ConfirmDeleteAccount}
            />

            {/* Personal information */}
            <SettingStack.Screen
                name={SETTING_ROUTE.personalInformation}
                component={PersonalInformation}
            />
            <SettingStack.Screen
                name={SETTING_ROUTE.enterPassword}
                component={EnterPassword}
            />
            <SettingStack.Screen
                name={SETTING_ROUTE.sendOTPChangeInfo}
                component={SendOTPChangeInfo}
            />

            {/* Extend setting */}
            <SettingStack.Screen
                name={SETTING_ROUTE.setTheme}
                component={ExtendSetting}
            />

            {/* About us */}
            <SettingStack.Screen
                name={SETTING_ROUTE.aboutUs}
                component={AboutUs}
            />
        </SettingStack.Navigator>
    );
};

export default SettingRoute;
