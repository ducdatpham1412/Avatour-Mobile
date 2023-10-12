import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import {IconPaddingField} from 'asset/icons';
import {Metrics, horizontalPadding, safePaddingNotZero} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {AppModalize, Eye} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {ButtonX} from 'components/common';
import InputBox from 'components/common/InputBox';
import {useSafeArea, useTheme} from 'hook';
import {goBack, navigate} from 'navigation/NavigationService';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React, {ElementRef, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {ModalAccounts} from './components';
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
  const {t} = useTranslation();
  const {top} = useSafeArea();

  const inputPasswordRef = useRef<any>(null);
  const modalRef = useRef<ElementRef<typeof AppModalize>>(null);

  const [rememberAccount, setRememberAccount] = useState(false);
  const [passwordPaddingRight, setPasswordPaddingRight] = useState(0);
  const [securePw, setSecurePw] = useState(true);

  return (
    <View style={[$container, {backgroundColor: theme.p_600}]}>
      <View style={$paddingField}>
        <StyleText originValue="Avatour" customStyle={$textAvatour} />
        <StyleText
          originValue="Tôn vinh nét độc bản của du lịch Việt"
          customStyle={$textHonneur}
        />
        <IconPaddingField size={Metrics.width} style={$field} />
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

            <InputBox
              i18Placeholder="login.emailPhone"
              value={username}
              onChangeText={value => setUsername(value)}
              onSubmitEditing={() => inputPasswordRef.current.focus()}
              rightCpn={
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
              }
              width="100%"
              containerStyle={$username}
              style={{
                backgroundColor: theme.gray_100,
                paddingRight: moderateScale(70),
              }}
            />

            <InputBox
              ref={inputPasswordRef}
              i18Placeholder="login.password"
              value={password}
              onChangeText={value => setPassword(value)}
              returnKeyType="default"
              secureTextEntry={securePw}
              width="100%"
              containerStyle={$password}
              style={{
                backgroundColor: theme.gray_100,
                paddingRight: passwordPaddingRight,
              }}
              rightCpn={
                <StyleTouchable
                  customStyle={$forgot}
                  onLayout={e =>
                    setPasswordPaddingRight(
                      e.nativeEvent.layout.width + scale(36),
                    )
                  }
                  onPress={() => {
                    if (password) {
                      setSecurePw(!securePw);
                    } else {
                      navigate(LOGIN_ROUTE.forgetPasswordType);
                    }
                  }}>
                  {password ? (
                    <Eye style={{color: theme.gray_600}} />
                  ) : (
                    <StyleText
                      i18Text="login.forgetPassword"
                      customStyle={[$forgotText, {color: theme.gray_600}]}
                    />
                  )}
                </StyleTouchable>
              }
            />

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

      <ButtonX
        size={20}
        containerStyle={{
          top: top || safePaddingNotZero,
          right: horizontalPadding,
          backgroundColor: theme.white_opacity(0.3),
        }}
        iconStyle={{color: theme.white}}
        onPress={goBack}
      />

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
const $field: ViewStyle = {
  marginBottom: -verticalScale(30),
  marginTop: verticalScale(10),
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
  marginLeft: scale(8),
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
  marginTop: verticalScale(72),
  height: verticalScale(54),
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
