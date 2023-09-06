import {OrderScreen} from 'feature/order';
import {AppParamsList} from 'navigation/config';
import {ORDER_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
const Stack = createSharedElementStackNavigator<AppParamsList>();

const OrderRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={ORDER_ROUTE.orderScreen} component={OrderScreen} />
    </Stack.Navigator>
  );
};

export default OrderRoute;
