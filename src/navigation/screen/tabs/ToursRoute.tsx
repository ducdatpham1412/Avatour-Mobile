import ToursScreen from 'feature/favorite/ToursScreen';
import {AppParamsList} from 'navigation/config';
import {TOUR_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator<AppParamsList>();

const ToursRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={TOUR_ROUTE.favoriteScreen} component={ToursScreen} />
    </Stack.Navigator>
  );
};

export default ToursRoute;
