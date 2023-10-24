import {apiRequestOTP} from 'api/authentication';
import {TYPE_OTP} from 'asset/enum';
import {verticalMargin} from 'asset/metrics';
import {FONT_SIZE, standValue, TERMS_URL} from 'asset/standardValue';
import {Eye} from 'components';
import {
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {InputBox} from 'components/common';
import {useTheme} from 'hook';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import {TextInput, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ms, s, scale, vs} from 'utility/scale';
import {validateIsEmail, validatePassword} from 'utility/validate';

const onSignUp = async (
  data: TypeRegisterReq,
  setLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    const paramsOTP: TypeRequestOTPRequest = {
      username: data.username,
      password: data.password,
      confirm_password: data.confirm_password,
      type_otp: TYPE_OTP.register,
    };
    setLoading(true);
    await apiRequestOTP(paramsOTP);
    navigate(LOGIN_ROUTE.sendOTP, {
      paramsOTP,
    });
  } catch (err) {
    ModalAlert.error({
      content: err,
    });
  } finally {
    setLoading(false);
  }
};

const SignUpForm = () => {
  const theme = useTheme();
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [haveAgreed, setHaveAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [securePw, setSecurePw] = useState({
    pw: true,
    cfPw: true,
  });

  const isValidEmail = validateIsEmail(username);
  const isValidPassword = validatePassword(password);
  const isValidConfirmPw = confirmPassword === password;
  const isValidButton =
    isValidEmail && isValidPassword && isValidConfirmPw && haveAgreed;

  return (
    <StyleContainer
      headerProps={{
        title: 'login.register',
      }}>
      <View style={$inputView}>
        <InputBox
          i18Placeholder="login.email"
          onChangeText={value => setUsername(value)}
          onSubmitEditing={() => passwordRef.current?.focus()}
          errorProps={{
            isError: !!username && !isValidEmail,
            textError: 'alert.inValidEmail',
          }}
          width="90%"
        />
        <InputBox
          ref={passwordRef}
          i18Placeholder="login.password"
          onChangeText={value => setPassword(value)}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          maxLength={standValue.PASSWORD_MAX_LENGTH}
          errorProps={{
            isError: !!password && !isValidPassword,
            textError: 'alert.regexPass',
          }}
          rightCpn={
            <Eye
              open={!securePw.pw}
              onPress={() =>
                setSecurePw(pre => ({
                  pw: !pre.pw,
                  cfPw: pre.cfPw,
                }))
              }
              style={{
                color: theme.gray_600,
                paddingHorizontal: scale(12),
              }}
            />
          }
          containerStyle={$inputPassword}
          secureTextEntry={securePw.pw}
          width="90%"
        />
        <InputBox
          ref={confirmPasswordRef}
          i18Placeholder="login.confirmPassword"
          onChangeText={value => setConfirmPassword(value)}
          maxLength={standValue.PASSWORD_MAX_LENGTH}
          errorProps={{
            isError: !!confirmPassword && confirmPassword !== password,
            textError: 'alert.passNotMatch',
          }}
          containerStyle={$inputPassword}
          secureTextEntry={securePw.cfPw}
          width="90%"
          rightCpn={
            <Eye
              open={!securePw.cfPw}
              onPress={() =>
                setSecurePw(pre => ({
                  pw: pre.pw,
                  cfPw: !pre.cfPw,
                }))
              }
              style={{
                color: theme.gray_600,
                paddingHorizontal: scale(12),
              }}
            />
          }
        />
      </View>

      <View style={$termPolicyView}>
        <StyleTouchable
          customStyle={[$boxTappingAgree, {borderColor: theme.gray_600}]}
          onPress={() => setHaveAgreed(!haveAgreed)}>
          {haveAgreed && <AntDesign name="check" style={$iconCheck} />}
        </StyleTouchable>
        <View style={$boxTitleAgree}>
          <StyleText
            i18Text="login.signUp.hadReadAndAgree"
            customStyle={$titleAgree}>
            {' '}
            <StyleText
              i18Text="login.signUp.doffyTermsAndPolicy"
              customStyle={[
                $titleAgree,
                {
                  textDecorationLine: 'underline',
                  fontWeight: 'bold',
                },
              ]}
              onPress={() =>
                navigate(ROOT_SCREEN.webView, {
                  title: 'setting.aboutUs.termsOfUse',
                  linkWeb: TERMS_URL,
                })
              }
            />
          </StyleText>
        </View>
      </View>

      <StyleButton
        title="common.confirm"
        containerStyle={$button}
        onPress={() =>
          onSignUp(
            {
              username,
              password,
              confirm_password: confirmPassword,
            },
            setLoading,
          )
        }
        disable={!isValidButton}
        isLoading={loading}
      />
    </StyleContainer>
  );
};

const $inputView: ViewStyle = {
  width: '100%',
  marginTop: vs(20),
};
const $inputPassword: ViewStyle = {
  marginTop: verticalMargin,
};
const $termPolicyView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  paddingHorizontal: '7%',
  marginTop: verticalMargin,
};
const $titleAgree: TextStyle = {
  fontSize: FONT_SIZE.f3,
};
const $boxTappingAgree: ViewStyle = {
  width: ms(20),
  height: ms(20),
  borderWidth: ms(0.5),
  borderRadius: ms(4),
  alignItems: 'center',
  justifyContent: 'center',
};
const $iconCheck: TextStyle = {
  fontSize: ms(20),
};
const $boxTitleAgree: ViewStyle = {
  flex: 1,
  paddingLeft: s(7),
  justifyContent: 'center',
};
const $button: ViewStyle = {
  marginTop: vs(60),
  width: '90%',
};

export default SignUpForm;
