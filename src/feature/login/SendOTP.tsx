import {useIsFocused} from '@react-navigation/native';
import {
  apiCheckOTP,
  apiOpenAccount,
  apiRegister,
  apiRequestOTP,
} from 'api/authentication';
import {TYPE_OTP} from 'asset/enum';
import {standValue} from 'asset/standardValue';
import {
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useLoading, useTheme} from 'hook';
import useCountdown from 'hook/useCountdown';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Keyboard, Text, TextInput, Vibration, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {ScaledSheet} from 'react-native-size-matters';
import {TypeItemLoginSuccess} from 'utility/login/loginService';

const SendOTP = ({
  route: {params},
}: RouteParams<AppParamsList[LOGIN_ROUTE.sendOTP]>) => {
  const {paramsOTP} = params;
  const theme = useTheme();
  const isFocusedScreen = useIsFocused();
  const codeRef = useRef<TextInput>(null);
  const {loading, setLoading} = useLoading();
  const {countdown, resetCountdown, clearCountdown} = useCountdown(
    standValue.COUNT_DOWN,
  );

  const [isAnimation, setIsAnimation] = useState(false);
  const [code, setCode] = useState('');

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    if (!isFocusedScreen) {
      clearCountdown();
    }
  }, [isFocusedScreen]);

  useEffect(() => {
    codeRef.current?.focus();
  }, []);

  useEffect(() => {
    if (code.length === 1) {
      setIsAnimation(false);
    }
    if (code.length === standValue.OTP_LENGTH) {
      Keyboard.dismiss();
    }
  }, [code]);

  const handleWrongOtp = () => {
    Vibration.vibrate();
    setIsAnimation(true);
    setCode('');
  };

  const onPressConfirm = async () => {
    /**
     * Reset password
     */
    if (paramsOTP.type_otp === TYPE_OTP.resetPassword) {
      try {
        setLoading(true);
        await apiCheckOTP({
          username: paramsOTP.username,
          code,
        });
        navigate(LOGIN_ROUTE.forgetPasswordForm, {
          username: paramsOTP.username,
        });
      } catch (err) {
        handleWrongOtp();
      } finally {
        setLoading(false);
      }
      return;
    }

    /**
     * Register
     */
    if (paramsOTP.type_otp === TYPE_OTP.register) {
      try {
        setLoading(true);
        const res = await apiRegister({
          username: paramsOTP.username,
          password: paramsOTP?.password || '',
          confirm_password: paramsOTP?.confirm_password || '',
          code,
        });
        const itemLoginSuccess: TypeItemLoginSuccess = {
          username: paramsOTP.username,
          password: paramsOTP.password,
          token: res.data.token,
          refreshToken: res.data.refreshToken,
        };
        navigate(LOGIN_ROUTE.agreeTermOfService, {
          itemLoginSuccess,
        });
      } catch (err) {
        handleWrongOtp();
      } finally {
        setLoading(false);
      }
    }

    /**
     * Open account
     */
    if (paramsOTP.type_otp === TYPE_OTP.requestOpenAccount) {
      try {
        setLoading(true);
        await apiOpenAccount({
          username: paramsOTP.username,
          verifyCode: code,
        });
        appAlert('login.loginScreen.openAccountSuccess', {
          actionClickOk: () => navigate(LOGIN_ROUTE.loginScreen),
        });
      } catch (err) {
        handleWrongOtp();
        appAlert(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onSendAgain = async () => {
    try {
      setLoading(true);
      if (code.length) {
        setCode('');
      }
      resetCountdown();
      await apiRequestOTP(paramsOTP);
    } catch (err) {
      appAlert(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render view
   */
  const TextSendAgain = useMemo(() => {
    return countdown > 0
      ? 'login.component.sendOTP.sendAgain'
      : 'login.component.sendOTP.sendAgainNoCount';
  }, [countdown > 0]);

  return (
    <StyleContainer
      customStyle={styles.container}
      headerProps={{
        title: 'login.component.sendOTP.header',
      }}>
      <View style={styles.wrapTextNotification}>
        <StyleText
          i18Text="login.component.sendOTP.notiOTP"
          customStyle={styles.textNotification}
        />
        <StyleText
          originValue={params.paramsOTP.username}
          customStyle={[styles.textDestination]}
        />
      </View>

      {/* OTP Code Field */}
      <Animatable.View
        animation={isAnimation ? 'shake' : ''}
        style={styles.wrapViewCode}>
        <CodeField
          ref={codeRef}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={standValue.OTP_LENGTH}
          rootStyle={styles.otpInputBox}
          keyboardType={'number-pad'}
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <View
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              style={[styles.codeInput, {backgroundColor: theme.white}]}>
              <Text style={[styles.codeInputText, {color: theme.p_800}]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </Animatable.View>

      <StyleButton
        title="login.component.sendOTP.confirmButton"
        onPress={onPressConfirm}
        containerStyle={styles.confirmButton}
        disable={code.length !== standValue.OTP_LENGTH}
        isLoading={loading}
      />

      <StyleTouchable
        customStyle={styles.buttonSendAgain}
        disable={countdown > 0}
        onPress={onSendAgain}>
        <StyleText
          i18Text={TextSendAgain}
          i18Params={{countdown}}
          customStyle={styles.titleSendAgain}
        />
      </StyleTouchable>
    </StyleContainer>
  );
};

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
  },
  wrapTextNotification: {
    marginTop: '36@vs',
    alignItems: 'center',
  },
  textNotification: {
    marginBottom: '2%',
  },
  textDestination: {
    fontWeight: 'bold',
  },
  enterCodeInputView: {
    width: '150@vs',
    marginTop: '30@vs',
  },
  enterCodeInput: {
    paddingHorizontal: '20@vs',
    textAlign: 'center',
    fontSize: '20@ms',
  },
  buttonSendAgain: {
    marginTop: '45@vs',
  },
  confirmButton: {
    paddingHorizontal: '50@vs',
  },
  titleSendAgain: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  codeInput: {
    width: '52@s',
    height: '52@s',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5@s',
  },
  codeInputText: {
    fontSize: '32@ms',
  },
  otpInputBox: {
    width: '100%',
  },
  wrapViewCode: {
    width: '100%',
    paddingHorizontal: '30@s',
    paddingVertical: '2@vs',
    marginTop: '50@vs',
    marginBottom: '132@vs',
  },
});

export default SendOTP;
