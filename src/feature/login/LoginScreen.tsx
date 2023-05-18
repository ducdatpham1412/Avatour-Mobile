import {FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {
  SafeView,
  StyleButton,
  StyleContainer,
  StyleImage,
  StyleText,
} from 'components/base';
import StyleTouchable from 'components/base/StyleTouchable';
import InputBox from 'components/common/InputBox';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import React, {useRef, useState} from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale, ms, s, scale, verticalScale, vs} from 'utility/scale';
import ListSaveAcc from './components/ListSaveAcc';
import {useLogin} from './hooks';

const LoginScreen = () => {
  const [
    {username, password, listSavedAccounts, loading},
    {
      setUsername,
      setPassword,
      selectSavedAccount,
      deleteSavedAccount,
      submitLogin,
    },
  ] = useLogin();
  const theme = useTheme();

  const inputPasswordRef = useRef<any>(null);
  const [userRef, setUserRef] = useState(false);
  const [isKeepSign, setIsKeepSign] = useState(false);

  return (
    <StyleContainer contentContainerStyle={$container}>
      <StyleText
        originValue="We make your trip as easy as possible"
        customStyle={{
          fontWeight: 'bold',
          fontSize: moderateScale(30),
          width: '80%',
        }}
      />
      <StyleImage
        source={{
          uri: 'https://www.radfordmedicalpractice.co.uk/wp-content/uploads/sites/622/2022/02/travel.jpeg',
        }}
        customStyle={$imageBanner}
        defaultImageSource="image"
      />

      <View style={$inputView}>
        <InputBox
          i18Placeholder="login.loginScreen.username"
          value={username}
          onChangeText={value => setUsername(value)}
          onFocus={() => setUserRef(true)}
          onBlur={() => setUserRef(false)}
          onSubmitEditing={() => inputPasswordRef.current.focus()}
          style={$input}
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
        isLoading={loading}
        onPress={() => submitLogin(isKeepSign)}
      />

      <StyleTouchable
        customStyle={styles.forgotPasswordView}
        onPress={() => navigate(LOGIN_ROUTE.forgetPasswordType)}>
        <StyleText
          i18Text="login.forgotPassword"
          customStyle={[styles.forgotPasswordText, {color: theme.black}]}
        />
      </StyleTouchable>
      <StyleTouchable
        customStyle={[
          styles.forgotPasswordView,
          {marginTop: verticalScale(15)},
        ]}
        onPress={() => navigate(LOGIN_ROUTE.signUpForm)}>
        <StyleText
          i18Text="login.signUp.form.header"
          customStyle={[styles.forgotPasswordText, {color: theme.black}]}
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
  paddingHorizontal: scale(20),
};
const $inputView: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  marginTop: verticalScale(20),
};
const $input: TextStyle = {
  width: '100%',
};
const $rememberView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: vs(20),
  alignSelf: 'flex-start',
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
const $imageBanner: ImageStyle = {
  width: '100%',
  height: verticalScale(200),
  borderRadius: 30,
  marginTop: 20,
};

const styles = ScaledSheet.create({
  inputForm: {
    marginTop: '15@vs',
    width: '100%',
  },
  // button login
  loginButton: {
    marginTop: '20@vs',
  },
  // forgot password
  forgotPasswordView: {
    marginTop: '40@vs',
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.f3,
    textDecorationLine: 'underline',
    fontWeight: FONT_WEIGHT_MEDIUM,
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
