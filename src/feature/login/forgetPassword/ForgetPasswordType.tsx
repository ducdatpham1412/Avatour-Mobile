import {apiRequestOTP} from 'api/authentication';
import {TYPE_OTP} from 'asset/enum';
import {StyleButton, StyleContainer} from 'components/base';
import InputBox from 'components/common/InputBox';
import {useLoading} from 'hook';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useState} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {useDebounce} from 'react-use';
import {verticalScale} from 'utility/scale';
import {validateIsEmail, validateIsPhone} from 'utility/validate';

const ForgetPasswordType = () => {
  const {loading, setLoading} = useLoading();
  const [username, setUsername] = useState('');
  const [disable, setDisable] = useState(false);

  useDebounce(
    () => {
      setDisable(!(validateIsEmail(username) || validateIsPhone(username)));
    },
    100,
    [username],
  );

  const onRequestOTP = async () => {
    try {
      const trimUsername = username.trim();
      setLoading(true);
      await apiRequestOTP({
        username: trimUsername,
        type_otp: TYPE_OTP.resetPassword,
      });
      navigate(LOGIN_ROUTE.sendOTP, {
        paramsOTP: {
          username: trimUsername,
          type_otp: TYPE_OTP.resetPassword,
        },
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
        title: 'login.forgetPassword',
      }}>
      <InputBox
        i18Placeholder="login.emailPhone"
        value={username}
        onChangeText={text => {
          setUsername(text);
        }}
        autoFocus
        errorProps={{
          isError: disable && !!username,
          textError: 'alert.invalidUsername',
        }}
        width="90%"
        style={$input}
      />
      <StyleButton
        title="common.continue"
        onPress={onRequestOTP}
        disable={disable}
        isLoading={loading}
        containerStyle={$button}
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  alignItems: 'center',
};
const $input: TextStyle = {
  marginTop: verticalScale(160),
};
const $button: ViewStyle = {
  marginTop: verticalScale(100),
};

export default ForgetPasswordType;
