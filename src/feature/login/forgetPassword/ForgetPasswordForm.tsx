import {apiResetPassword} from 'api/authentication';
import {standValue} from 'asset/standardValue';
import {StyleButton, StyleContainer} from 'components/base';
import {InputBox} from 'components/common';
import {useLoading} from 'hook';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {TextInput, View, ViewStyle} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {vs} from 'utility/scale';
import {validatePassword} from 'utility/validate';

const ForgetPasswordForm = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.forgetPasswordForm]>) => {
  const {username, code} = route.params;
  const {loading, setLoading} = useLoading();

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      customStyle={styles.container}
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
          isError={!!password && !isValidPassword}
          textError="alert.regexPass"
          secureTextEntry
        />
        <InputBox
          ref={confirmPasswordRef}
          i18Placeholder="login.confirmPassword"
          onChangeText={value => setConfirmPassword(value)}
          maxLength={standValue.PASSWORD_MAX_LENGTH}
          isError={!!confirmPassword && confirmPassword !== password}
          textError="alert.passNotMatch"
          style={$inputPassword}
          secureTextEntry
        />
      </View>

      <StyleButton
        title="common.done"
        containerStyle={styles.buttonConfirm}
        disable={!isValidButton}
        onPress={submitChangePass}
        isLoading={loading}
      />
    </StyleContainer>
  );
};

const $inputView: ViewStyle = {
  width: '100%',
  marginTop: vs(30),
  alignItems: 'center',
};
const $inputPassword: ViewStyle = {
  marginTop: vs(15),
};

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
  },
  inputForm: {
    width: '85%',
  },
  buttonConfirm: {
    marginTop: '10%',
    paddingHorizontal: '40@vs',
  },
  textButton: {
    fontSize: 25,
  },
});

export default ForgetPasswordForm;
