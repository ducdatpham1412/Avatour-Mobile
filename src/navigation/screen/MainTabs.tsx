import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import FindmeStore from 'app-redux/store';
import ModalCommentLike, {
  TypeModalCommentPost,
} from 'components/ModalCommentLike';
import NotificationScreen from 'feature/notification/NotificationScreen';
import RootReputation from 'feature/reputation/RootReputation';
import Redux from 'hook/useRedux';
import TabNavigator from 'navigation/components/TabNavigator';
import {MAIN_SCREEN} from 'navigation/config/routes';
import React from 'react';
import {View} from 'react-native';
import DiscoveryRoute from './tabs/DiscoveryRoute';
import FavoriteRoute from './tabs/FavoriteRoute';
import ProfileRoute from './tabs/ProfileRoute';

const BottomTab = createBottomTabNavigator();

// This modal use for modal in 2 screen: DiscoveryScreen and MyProfileScreen
const modalRef = React.createRef<ModalCommentLike>();
export const showCommentDiscovery = (params: TypeModalCommentPost) => {
  modalRef.current?.show(params);
};

const MainTabs: React.FunctionComponent = () => {
  const theme = Redux.getTheme();
  const bubbleFocusing = Redux.getBubbleFocusing();

  return (
    <View
      style={{
        flex: 1,
        overflow: 'visible',
        backgroundColor: theme.backgroundColor,
      }}>
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

        <BottomTab.Screen
          name={MAIN_SCREEN.favorite}
          component={FavoriteRoute}
        />

        <BottomTab.Screen
          name={MAIN_SCREEN.reputation}
          component={RootReputation}
        />

        <BottomTab.Screen
          name={MAIN_SCREEN.notificationRoute}
          component={NotificationScreen}
        />

        <BottomTab.Screen
          name={MAIN_SCREEN.profileRoute}
          component={ProfileRoute}
        />
      </BottomTab.Navigator>

      <ModalCommentLike
        ref={modalRef}
        theme={theme}
        bubbleFocusing={bubbleFocusing}
        updateBubbleFocusing={(value: any) => Redux.updateBubbleFocusing(value)}
        setTotalComments={value => {
          Redux.updateBubbleFocusing({
            totalComments: value,
          });
        }}
        increaseTotalComments={value => {
          const currentComments =
            FindmeStore.getState().logicSlice.bubbleFocusing.totalComments;
          Redux.updateBubbleFocusing({
            totalComments: currentComments + value,
          });
        }}
      />
    </View>
  );
};

export default MainTabs;
