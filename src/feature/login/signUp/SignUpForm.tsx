import {FONT_SIZE, standValue, TERMS_URL} from 'asset/standardValue';
import {
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {InputBox} from 'components/common';
import {useTheme} from 'hook';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useMemo, useRef, useState} from 'react';
import {TextInput, TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {I18Normalize} from 'utility/I18Next';
import {ms, s, vs} from 'utility/scale';
import {validateIsEmail, validatePassword} from 'utility/validate';

const SignUpForm = () => {
  const theme = useTheme();
  const isEmail = useRef(true).current;
  const isPhone = useRef(false).current;
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [haveAgreed, setHaveAgreed] = useState(false);

  const isValidEmail = validateIsEmail(username);
  const isValidPassword = validatePassword(password);
  const isValidConfirmPw = confirmPassword === password;
  const isValidButton =
    isValidEmail && isValidPassword && isValidConfirmPw && haveAgreed;

  const UserNameHolder = useMemo((): I18Normalize => {
    if (isEmail) {
      return 'login.signUp.form.enterEmail';
    }
    if (isPhone) {
      return 'login.signUp.form.enterPhone';
    }
    return 'common.null';
  }, [isEmail, isPhone]);

  return (
    <StyleContainer containerStyle={$container}>
      <View style={$inputView}>
        <InputBox
          i18Placeholder={UserNameHolder}
          onChangeText={value => setUsername(value)}
          onSubmitEditing={() => passwordRef.current?.focus()}
          isError={!!username && !isValidEmail}
          textError="alert.inValidEmail"
        />
        <InputBox
          ref={passwordRef}
          i18Placeholder="login.loginScreen.password"
          onChangeText={value => setPassword(value)}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          maxLength={standValue.PASSWORD_MAX_LENGTH}
          isError={!!password && !isValidPassword}
          textError="alert.regexPass"
          style={$inputPassword}
          secureTextEntry
        />
        <InputBox
          ref={confirmPasswordRef}
          i18Placeholder="login.signUp.form.confirmPass"
          onChangeText={value => setConfirmPassword(value)}
          maxLength={standValue.PASSWORD_MAX_LENGTH}
          isError={!!confirmPassword && confirmPassword !== password}
          textError="alert.passNotMatch"
          style={$inputPassword}
          secureTextEntry
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
        title="login.signUp.form.confirmButton"
        containerStyle={$button}
        onPress={() => null}
        disable={!isValidButton}
      />
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
const $inputPassword: ViewStyle = {
  marginTop: vs(5),
};
const $termPolicyView: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  paddingHorizontal: '10%',
  marginTop: vs(15),
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
};

export default SignUpForm;
