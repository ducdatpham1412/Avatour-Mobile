import {CardStyleInterpolators} from '@react-navigation/stack';
import DiscoveryScreen from 'feature/discovery/DiscoveryScreen';
import {AppParamsList} from 'navigation/config';
import {DISCOVERY_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator<AppParamsList>();

const DiscoveryRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        headerShown: false,
      }}>
      <Stack.Screen
        name={DISCOVERY_ROUTE.discoveryScreen}
        component={DiscoveryScreen}
      />
    </Stack.Navigator>
  );
};

export default DiscoveryRoute;
