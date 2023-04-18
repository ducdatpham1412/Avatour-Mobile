import {useIsFocused} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {setBorderMessRoute, setScrollMainAndChatEnable} from 'app-redux';
import {Metrics} from 'asset/metrics';
import MessScreen from 'feature/mess/MessScreen';
import {useTheme} from 'hook';
import {MESS_ROUTE} from 'navigation/config/routes';
import React, {useEffect, useRef} from 'react';

const MessStack = createStackNavigator();

const MessRoute = () => {
  const theme = useTheme();
  const isFocused = useIsFocused();
  const timeOut = useRef<any>();

  useEffect(() => {
    setBorderMessRoute(theme.borderColor);
  }, []);

  useEffect(() => {
    if (isFocused) {
      timeOut.current = setTimeout(() => {
        setScrollMainAndChatEnable(true);
      }, 100);
    }

    return () => {
      clearTimeout(timeOut.current);
    };
  }, [isFocused]);

  return (
    <MessStack.Navigator
      // initialRouteName={MESS_ROUTE.publicChatting}
      screenOptions={{
        cardStyle: [
          {
            backgroundColor: theme.backgroundColor,
            paddingTop: Metrics.safeTopPadding,
          },
        ],
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <MessStack.Screen name={MESS_ROUTE.messScreen} component={MessScreen} />
    </MessStack.Navigator>
  );
};

export default MessRoute;
