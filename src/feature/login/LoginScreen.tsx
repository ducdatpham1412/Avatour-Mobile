import {FONT_SIZE} from 'asset';
import {StyleButton, StyleContainer, StyleText} from 'components/base';
import StyleTouchable from 'components/base/StyleTouchable';
import InputBox from 'components/common/InputBox';
import {useTheme} from 'hook';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useRef, useState} from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ms, s, vs} from 'utility/scale';
import ListSaveAcc from './components/ListSaveAcc';
import {useLogin} from './hooks';

const LoginScreen = () => {
  const {
    states: {username, password, listSavedAccounts},
    actions: {
      setUsername,
      setPassword,
      selectSavedAccount,
      deleteSavedAccount,
      submitLogin,
    },
  } = useLogin();
  const theme = useTheme();

  const inputPasswordRef = useRef<any>(null);
  const [userRef, setUserRef] = useState(false);
  const [isKeepSign, setIsKeepSign] = useState(false);

  return (
    <StyleContainer containerStyle={$container}>
      <View style={$inputView}>
        <InputBox
          i18Placeholder="login.loginScreen.username"
          value={username}
          onChangeText={value => setUsername(value)}
          onFocus={() => setUserRef(true)}
          onBlur={() => setUserRef(false)}
          onSubmitEditing={() => inputPasswordRef.current.focus()}
        />

        <InputBox
          ref={inputPasswordRef}
          i18Placeholder="login.loginScreen.password"
          value={password}
          onChangeText={value => setPassword(value)}
          style={styles.inputForm}
          returnKeyType="default"
          secureTextEntry
        />

        <View style={$rememberView}>
          <StyleTouchable
            customStyle={[$rememberButton, {borderColor: theme.gray_600}]}
            onPress={() => setIsKeepSign(!isKeepSign)}>
            {isKeepSign && (
              <AntDesign
                name="check"
                style={[$checkIcon, {color: theme.black}]}
              />
            )}
          </StyleTouchable>
          <StyleText
            i18Text="login.loginScreen.keepSignIn"
            style={{color: theme.gray_500}}
          />
        </View>
      </View>

      <StyleButton
        title="login.loginScreen.signIn"
        containerStyle={styles.loginButton}
        disable={!username || !password}
        onPress={() => submitLogin(isKeepSign)}
      />

      <StyleTouchable
        customStyle={styles.forgotPasswordView}
        onPress={() => navigate(LOGIN_ROUTE.forgetPasswordType)}>
        <StyleText
          i18Text="login.forgotPassword"
          customStyle={[styles.forgotPasswordText, {color: theme.gray_500}]}
        />
      </StyleTouchable>

      {/* <View style={styles.signUpView}>
        <StyleText i18Text="login.orSignIn" customStyle={styles.textOrSignIn} />
        <View style={styles.signUpBox}>
          {isIOS && (
            <StyleTouchable onPress={signInWithApple}>
              <StyleImage
                source={Images.icons.apple}
                customStyle={styles.iconSignIn}
              />
            </StyleTouchable>
          )}
          <StyleTouchable onPress={() => null}>
            <StyleImage
              source={Images.icons.facebook}
              customStyle={styles.iconSignIn}
            />
          </StyleTouchable>
          <StyleTouchable onPress={signInWithGoogle}>
            <StyleImage
              source={Images.icons.email}
              customStyle={styles.iconSignIn}
            />
          </StyleTouchable>
        </View>
      </View> */}

      {userRef && !username && !!listSavedAccounts.length && (
        <ListSaveAcc
          listAcc={listSavedAccounts}
          selectAcc={selectSavedAccount}
          deleteAcc={deleteSavedAccount}
        />
      )}
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  backgroundColor: 'transparent',
};
const $inputView: ViewStyle = {
  width: '100%',
  marginTop: vs(50),
};
const $rememberView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: '10%',
  marginTop: vs(20),
};
const $rememberButton: ViewStyle = {
  width: vs(20),
  height: vs(20),
  borderWidth: ms(0.5),
  borderRadius: ms(5),
  marginRight: s(7),
  alignItems: 'center',
  justifyContent: 'center',
};
const $checkIcon: TextStyle = {
  fontSize: ms(20),
};

const styles = ScaledSheet.create({
  inputForm: {
    marginTop: '15@vs',
  },
  // button login
  loginButton: {
    marginTop: '30@vs',
  },
  // forgot password
  forgotPasswordView: {
    alignSelf: 'center',
    marginTop: '20@vs',
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.f3,
    textDecorationLine: 'underline',
  },
  // question sign up
  signUpView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOrSignIn: {
    fontWeight: 'bold',
  },
  signUpBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '10@vs',
  },
  iconSignIn: {
    width: '45@ms',
    height: '45@ms',
    marginHorizontal: '7@ms',
  },
});

export default LoginScreen;
