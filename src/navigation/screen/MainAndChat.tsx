import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useAppSelector} from 'app-redux/store';
import ROOT_SCREEN from 'navigation/config/routes';
import React from 'react';
import MainTabs from './MainTabs';
import MessRoute from './tabs/MessRoute';

const Tab = createMaterialTopTabNavigator();

const MainAndChat = () => {
  const {scrollMainAndChatEnable} = useAppSelector(state => state.logicSlice);

  return (
    <Tab.Navigator
      tabBar={() => null}
      screenOptions={{
        swipeEnabled: scrollMainAndChatEnable,
      }}>
      <Tab.Screen name={ROOT_SCREEN.mainScreen} component={MainTabs} />
      <Tab.Screen name={ROOT_SCREEN.chatRoute} component={MessRoute} />
    </Tab.Navigator>
  );
};

export default MainAndChat;
