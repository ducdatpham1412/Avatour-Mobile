import {apiResetPassword} from 'api/authentication';
import {standValue} from 'asset/standardValue';
import {Eye} from 'components';
import {StyleButton, StyleContainer} from 'components/base';
import {InputBox} from 'components/common';
import {useLoading, useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {TextInput, View, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';
import {validatePassword} from 'utility/validate';

const ForgetPasswordForm = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.forgetPasswordForm]>) => {
  const {username, code} = route.params;
  const {loading, setLoading} = useLoading();
  const theme = useTheme();

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securePw, setSecurePw] = useState({
    pw: true,
    cfPw: true,
  });

  const isValidPassword = validatePassword(password);
  const isValidConfirmPw = confirmPassword === password;
  const isValidButton = isValidPassword && isValidConfirmPw;

  const submitChangePass = async () => {
    try {
      setLoading(true);
      await apiResetPassword({
        username,
        password,
        confirm_password: confirmPassword,
        code,
      });
      ModalAlert.success({
        i18Content: 'alert.successChangePass',
        onClose: () => navigate(LOGIN_ROUTE.loginScreen),
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyleContainer
      customStyle={$container}
      headerProps={{
        title: 'login.resetPassword',
      }}>
      <View style={$inputView}>
        <InputBox
          ref={passwordRef}
          i18Placeholder="login.newPassword"
          onChangeText={value => setPassword(value)}
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          maxLength={standValue.PASSWORD_MAX_LENGTH}
          errorProps={{
            isError: !!password && !isValidPassword,
            textError: 'alert.regexPass',
          }}
          secureTextEntry={securePw.pw}
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

      <StyleButton
        title="common.done"
        containerStyle={$buttonConfirm}
        disable={!isValidButton}
        onPress={submitChangePass}
        isLoading={loading}
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  alignItems: 'center',
};
const $inputView: ViewStyle = {
  width: '100%',
  marginTop: verticalScale(30),
  alignItems: 'center',
};
const $inputPassword: ViewStyle = {
  marginTop: verticalScale(15),
};
const $buttonConfirm: ViewStyle = {
  marginTop: '10%',
  paddingHorizontal: scale(40),
};

export default ForgetPasswordForm;
