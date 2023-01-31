import {GoogleSignin} from '@react-native-google-signin/google-signin';
import FindmeStore from 'app-redux/store';
import Config from 'asset/env';
import {SocketProvider} from 'hook/useSocketIO';
import TabBarProvider from 'navigation/config/TabBarProvider';
import AppModal from 'navigation/screen/AppModal';
import RootScreen from 'navigation/screen/RootScreen';
import React from 'react';
import {I18nextProvider} from 'react-i18next';
import {LogBox, ViewStyle} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';
import {addMenuClearAsyncStorage} from 'utility/assistant';
import {LanguageProvider} from 'utility/format';
import I18Next from 'utility/I18Next';

if (__DEV__) {
  LogBox.ignoreLogs([
    'componentWillMount',
    'Non-serializable',
    'VirtualizedLists should never be nested',
    'source.uri should not be an empty string',
  ]);
  addMenuClearAsyncStorage();
}

GoogleSignin.configure({
  webClientId: Config.WEB_CLIENT_ID_GOOGLE_SIGN_IN,
});

const App = () => {
  return (
    <GestureHandlerRootView style={$container}>
      <SafeAreaProvider>
        <I18nextProvider i18n={I18Next}>
          <LanguageProvider>
            <TabBarProvider>
              <ReduxProvider store={FindmeStore}>
                <SocketProvider>
                  {/* App navigator */}
                  <RootScreen />

                  {/* App Function */}
                  {/* <DynamicLink /> */}
                  <AppModal />
                </SocketProvider>
              </ReduxProvider>
            </TabBarProvider>
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
