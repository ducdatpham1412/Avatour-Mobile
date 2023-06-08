import {apiRequestOTP} from 'api/authentication';
import {TYPE_OTP} from 'asset/enum';
import Theme from 'asset/theme/Theme';
import {StyleButton, StyleContainer} from 'components/base';
import InputBox from 'components/common/InputBox';
import {useLoading} from 'hook';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {validateIsEmail, validateIsPhone} from 'utility/validate';

const ForgetPasswordType = () => {
  const timeOut = useRef<number>(0);
  const {loading, setLoading} = useLoading();
  const [username, setUsername] = useState('');
  const [disable, setDisable] = useState(true);

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
      customStyle={styles.container}
      headerProps={{
        title: 'login.forgetPassword.type.header',
      }}>
      <View style={styles.contentView}>
        <InputBox
          i18Placeholder="login.forgetPassword.type.username"
          value={username}
          onChangeText={text => {
            setUsername(text);
            clearTimeout(timeOut.current);
            timeOut.current = setTimeout(() => {
              const textTrim = text.trim();
              setDisable(
                !validateIsEmail(textTrim) && !validateIsPhone(textTrim),
              );
            }, 400);
          }}
          autoFocus
        />

        <StyleButton
          title="login.forgetPassword.type.continue"
          containerStyle={styles.btnSendBox}
          onPress={onRequestOTP}
          disable={disable}
          isLoading={loading}
        />
      </View>
    </StyleContainer>
  );
};

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginTop: '50@vs',
  },
  textNotification: {
    fontSize: '17@ms',
    marginTop: '20@vs',
  },
  iconsBox: {
    width: '90%',
    flexDirection: 'row',
    marginTop: '30@vs',
    justifyContent: 'space-around',
  },
  contentView: {
    height: '100%',
    width: '100%',
    marginTop: '170@vs',
    alignItems: 'center',
  },
  btnSendBox: {
    paddingHorizontal: '30@s',
    marginTop: '70@vs',
  },
  textComeToFacebook: {
    fontSize: '20@ms',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  wrapTextTitle: {
    color: Theme.common.white,
    fontSize: '16@ms0.3',
    fontWeight: '400',
    marginLeft: '35@s',
    marginBottom: '10@vs',
  },
});

export default ForgetPasswordType;
