import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  NavigationState,
  PartialState,
} from '@react-navigation/native';
import Store from 'app-redux/store';
import {SocketProvider} from 'hook/sockets';
import {navigationRef} from 'navigation/NavigationService';
import AppModal from 'navigation/screen/AppModal';
import RootScreen from 'navigation/screen/RootScreen';
import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {
  DevSettings,
  LogBox,
  NativeModules,
  StatusBar,
  ViewStyle,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';
import {LanguageProvider} from 'utility/format';
import I18Next from 'utility/I18Next';

if (__DEV__) {
  LogBox.ignoreLogs([
    'componentWillMount',
    'Non-serializable',
    'VirtualizedLists should never be nested',
    'source.uri should not be an empty string',
  ]);
  DevSettings.addMenuItem('Clear AsyncStorage', () => {
    AsyncStorage.clear();
    DevSettings.reload();
  });
  DevSettings.addMenuItem('Debug with Chrome', () => {
    NativeModules.DevSettings.setIsDebuggingRemotely(true);
  });
}

const trackActiveRoute = (
  s?: NavigationState | PartialState<NavigationState>,
  level = 0,
) => {
  if (__DEV__) {
    if (s?.index === undefined) {
      return;
    }
    const {name, params, state} = s.routes[s.index];
    console.info(' '.repeat(level), level ? '⎿' : '', name, params || '');
    trackActiveRoute(state, level + 1);
  }
};

// GoogleSignin.configure({
//   webClientId: Config.WEB_CLIENT_ID_GOOGLE_SIGN_IN,
// });

const App = () => {
  return (
    <GestureHandlerRootView style={$container}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <I18nextProvider i18n={I18Next}>
          <LanguageProvider>
            <ReduxProvider store={Store}>
              <NavigationContainer
                ref={navigationRef}
                onStateChange={trackActiveRoute}>
                <RootScreen />

                <AppModal />
                <SocketProvider />
                <StatusBar barStyle="dark-content" />
              </NavigationContainer>
            </ReduxProvider>
          </LanguageProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const $container: ViewStyle = {
  flex: 1,
};

export default App;
