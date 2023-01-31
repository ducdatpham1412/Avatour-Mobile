import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useAppSelector} from 'app-redux/store';
import ROOT_SCREEN from 'navigation/config/routes';
import React from 'react';
import MainTabs from './MainTabs';
import MessRoute from './tabs/MessRoute';

const Tab = createMaterialTopTabNavigator();

const MainAndChat = () => {
  const swipeEnable = useAppSelector(
    state => state.logicSlice.scrollMainAndChatEnable,
  );

  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{
        swipeEnabled: swipeEnable,
      }}>
      <Tab.Screen name={ROOT_SCREEN.mainScreen} component={MainTabs} />
      <Tab.Screen name={ROOT_SCREEN.chatRoute} component={MessRoute} />
    </Tab.Navigator>
  );
};

export default MainAndChat;
