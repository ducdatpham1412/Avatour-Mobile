import {useIsFocused} from '@react-navigation/native';
import {
    CardStyleInterpolators,
    createStackNavigator,
} from '@react-navigation/stack';
import {Metrics} from 'asset/metrics';
import MessScreen from 'feature/mess/MessScreen';
import Redux from 'hook/useRedux';
import {MESS_ROUTE} from 'navigation/config/routes';
import React, {useEffect} from 'react';

const MessStack = createStackNavigator();

let x: any;

const MessRoute = () => {
    const theme = Redux.getTheme();
    const isFocused = useIsFocused();

    useEffect(() => {
        Redux.setBorderMessRoute(theme.borderColor);
    }, []);

    useEffect(() => {
        if (isFocused) {
            x = setTimeout(() => {
                Redux.setScrollMainAndChatEnable(true);
            }, 100);
        }

        return () => {
            clearTimeout(x);
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
            <MessStack.Screen
                name={MESS_ROUTE.messScreen}
                component={MessScreen}
            />
        </MessStack.Navigator>
    );
};

export default MessRoute;
