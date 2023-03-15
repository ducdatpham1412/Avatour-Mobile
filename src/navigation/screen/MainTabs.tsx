import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import NotificationScreen from 'feature/notification/NotificationScreen';
import TabNavigator from 'navigation/components/TabNavigator';
import {MAIN_SCREEN} from 'navigation/config/routes';
import React from 'react';
import DiscoveryRoute from './tabs/DiscoveryRoute';
import FavoriteRoute from './tabs/FavoriteRoute';
import ProfileRoute from './tabs/ProfileRoute';

const BottomTab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <BottomTab.Navigator
      tabBar={(props: BottomTabBarProps) => <TabNavigator {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <BottomTab.Screen
        name={MAIN_SCREEN.discoveryRoute}
        component={DiscoveryRoute}
        options={{
          lazy: false,
        }}
      />

      <BottomTab.Screen name={MAIN_SCREEN.favorite} component={FavoriteRoute} />

      <BottomTab.Screen
        name={MAIN_SCREEN.notificationRoute}
        component={NotificationScreen}
      />

      <BottomTab.Screen
        name={MAIN_SCREEN.profileRoute}
        component={ProfileRoute}
      />
    </BottomTab.Navigator>
  );
};

export default MainTabs;
