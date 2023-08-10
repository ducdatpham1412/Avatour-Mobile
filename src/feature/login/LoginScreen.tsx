import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {IconPaddingField} from 'asset/icons';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {AppModalize} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import InputBox from 'components/common/InputBox';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import React, {ElementRef, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalAccounts} from './components';
import {useLogin} from './hooks';
import {ModalAlert} from 'navigation/screen/modals';

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
  const {t} = useTranslation();

  const inputPasswordRef = useRef<any>(null);
  const modalRef = useRef<ElementRef<typeof AppModalize>>(null);

  const [rememberAccount, setRememberAccount] = useState(false);
  const [passwordPaddingRight, setPasswordPaddingRight] = useState(0);

  return (
    <View style={[$container, {backgroundColor: theme.p_600}]}>
      <View style={$paddingField}>
        <StyleText originValue="Avatour" customStyle={$textAvatour} />
        <StyleText
          originValue="Tôn vinh nét độc bản của du lịch Việt"
          customStyle={$textHonneur}
        />
        <IconPaddingField size={Metrics.width} />
      </View>

      <StyleContainer
        containerStyle={$styleContainer}
        customStyle={$body}
        extraHeight={verticalScale(30)}>
        <View
          style={[
            $modal,
            {
              backgroundColor: theme.white,
            },
          ]}>
          <View style={$inputView}>
            <StyleText i18Text="login.login" customStyle={$title} />
            <View style={$username}>
              <InputBox
                i18Placeholder="login.emailPhone"
                value={username}
                onChangeText={value => setUsername(value)}
                onSubmitEditing={() => inputPasswordRef.current.focus()}
                style={[
                  $input,
                  {
                    backgroundColor: theme.gray_100,
                    paddingRight: moderateScale(70),
                  },
                ]}
              />
              <StyleTouchable
                customStyle={$btnContact}
                onPress={() => {
                  Keyboard.dismiss();
                  modalRef.current?.show();
                }}>
                <AntDesign
                  name="contacts"
                  style={[$iconContact, {color: theme.gray_600}]}
                />
              </StyleTouchable>
            </View>
            <View style={$password}>
              <InputBox
                ref={inputPasswordRef}
                i18Placeholder="login.password"
                value={password}
                onChangeText={value => setPassword(value)}
                style={[
                  $input,
                  {
                    backgroundColor: theme.gray_100,
                    paddingRight: passwordPaddingRight,
                  },
                ]}
                returnKeyType="default"
                secureTextEntry
              />
              <StyleTouchable
                customStyle={$forgot}
                onLayout={e =>
                  setPasswordPaddingRight(
                    e.nativeEvent.layout.width + scale(36),
                  )
                }
                onPress={() => navigate(LOGIN_ROUTE.forgetPasswordType)}>
                <StyleText
                  i18Text="login.forgetPassword"
                  customStyle={[$forgotText, {color: theme.gray_600}]}
                />
              </StyleTouchable>
            </View>
            <View style={$rememberView}>
              <StyleTouchable
                customStyle={[$rememberButton, {borderColor: theme.gray_600}]}
                onPress={() => setRememberAccount(!rememberAccount)}>
                {rememberAccount && (
                  <AntDesign
                    name="check"
                    style={[$checkIcon, {color: theme.black}]}
                  />
                )}
              </StyleTouchable>
              <StyleText
                i18Text="login.keepSignIn"
                style={{color: theme.gray_500}}
              />
            </View>
          </View>

          <StyleButton
            title="login.login"
            containerStyle={$loginButton}
            isLoading={loading}
            onPress={() => submitLogin(rememberAccount)}
          />

          <StyleText
            i18Text="login.notHaveAccountYet"
            customStyle={$signUpText}>
            <StyleText
              originValue={` ${t('login.register')}`}
              customStyle={[$registerText, {color: theme.p_600}]}
              onPress={() => navigate(LOGIN_ROUTE.signUpForm)}
            />
          </StyleText>
        </View>
      </StyleContainer>

      <ModalAccounts
        ref={modalRef}
        listAccounts={listSavedAccounts}
        onSelect={value => {
          selectSavedAccount(value);
          modalRef.current?.hide();
        }}
        onDelete={value => {
          ModalAlert.options({
            i18Content: 'profile.post.sureDeletePost',
            onContinue: () => {
              deleteSavedAccount(value.username);
              modalRef.current?.hide();
            },
          });
        }}
      />
    </View>
  );
};

const spaceHeight = verticalScale(310);
const $container: ViewStyle = {
  flex: 1,
};
const $paddingField: ViewStyle = {
  position: 'absolute',
  top: 0,
  width: '100%',
  height: spaceHeight,
  justifyContent: 'flex-end',
  alignItems: 'center',
};
const $textAvatour: TextStyle = {
  color: Theme.common.white,
  fontSize: moderateScale(40),
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $textHonneur: TextStyle = {
  fontSize: FONT_SIZE.f3,
  color: Theme.common.white,
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $styleContainer: ViewStyle = {
  backgroundColor: 'transparent',
  paddingTop: 0,
};
const $body: ViewStyle = {
  paddingTop: spaceHeight - verticalScale(10),
  paddingHorizontal: 0,
};
const $modal: ViewStyle = {
  flex: 1,
  paddingHorizontal: scale(16),
  borderRadius: BORDER_RADIUS.f2,
};
const $inputView: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  marginTop: verticalScale(28),
};
const $title: TextStyle = {
  alignSelf: 'center',
  fontSize: FONT_SIZE.h2,
  fontWeight: 'bold',
};
const $username: TextStyle = {
  width: '100%',
  marginTop: verticalScale(20),
  justifyContent: 'center',
};
const $btnContact: ViewStyle = {
  position: 'absolute',
  width: moderateScale(30),
  right: scale(20),
  paddingVertical: verticalScale(4),
  alignItems: 'flex-end',
};
const $iconContact: TextStyle = {
  fontSize: moderateScale(20),
};
const $password: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(16),
  justifyContent: 'center',
};
const $input: TextStyle = {
  width: '100%',
};
const $forgot: ViewStyle = {
  position: 'absolute',
  right: scale(20),
  paddingVertical: scale(4),
};
const $forgotText: TextStyle = {
  fontSize: FONT_SIZE.f4,
  textDecorationLine: 'underline',
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $rememberView: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: verticalScale(20),
  alignSelf: 'flex-start',
};
const $rememberButton: ViewStyle = {
  width: verticalScale(20),
  height: verticalScale(20),
  borderWidth: moderateScale(0.5),
  borderRadius: moderateScale(5),
  marginRight: scale(7),
  alignItems: 'center',
  justifyContent: 'center',
};
const $checkIcon: TextStyle = {
  fontSize: moderateScale(20),
};
const $loginButton: ViewStyle = {
  marginTop: verticalScale(100),
};
const $signUpText: TextStyle = {
  fontSize: FONT_SIZE.f3,
  alignSelf: 'center',
  marginTop: verticalScale(40),
};
const $registerText: TextStyle = {
  fontSize: FONT_SIZE.f3,
  textDecorationLine: 'underline',
  fontWeight: 'bold',
};

export default LoginScreen;
