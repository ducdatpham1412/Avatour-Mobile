import {useIsFocused} from '@react-navigation/native';
import {
  apiCheckOTP,
  apiOpenAccount,
  apiRegister,
  apiRequestOTP,
} from 'api/authentication';
import {apiChangeInformation} from 'api/setting';
import {updatePassport} from 'app-redux';
import {TYPE_OTP} from 'asset/enum';
import {BORDER_RADIUS, standValue} from 'asset/standardValue';
import {
  StyleButton,
  StyleContainer,
  StyleText,
  StyleTouchable,
} from 'components/base';
import {useLoading, useTheme} from 'hook';
import useCountdown from 'hook/useCountdown';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE, SETTING_ROUTE} from 'navigation/config/routes';
import {navigate, replace} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Text,
  TextInput,
  TextStyle,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
  CodeField,
  Cursor,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import {validateIsEmail, validateIsPhone} from 'utility/validate';

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
  const shouldSendAgain = countdown <= 0;

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
          type: TYPE_OTP.resetPassword,
        });
        navigate(LOGIN_ROUTE.forgetPasswordForm, {
          username: paramsOTP.username,
          code,
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
    if (
      paramsOTP.type_otp === TYPE_OTP.register &&
      paramsOTP.password &&
      paramsOTP.confirm_password
    ) {
      try {
        setLoading(true);
        const res = await apiRegister({
          username: paramsOTP.username,
          password: paramsOTP.password,
          confirm_password: paramsOTP.confirm_password,
          code,
        });
        const itemLoginSuccess: TypeItemLoginSuccess = {
          username: paramsOTP.username,
          password: paramsOTP.password,
          token: res.data.token,
          refreshToken: res.data.refreshToken,
        };
        replace(LOGIN_ROUTE.agreeTermOfService, {
          itemLoginSuccess,
        });
      } catch (err) {
        handleWrongOtp();
      } finally {
        setLoading(false);
      }
      return;
    }

    /**
     * Open account
     */
    if (paramsOTP.type_otp === TYPE_OTP.requestOpenAccount) {
      try {
        setLoading(true);
        await apiOpenAccount({
          username: paramsOTP.username,
          code,
        });
        ModalAlert.success({
          i18Content: 'login.openAccountSuccess',
          onClose: () => navigate(LOGIN_ROUTE.loginScreen),
        });
      } catch (err) {
        handleWrongOtp();
        ModalAlert.error({
          content: err,
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    /**
     * Change information
     */
    if (paramsOTP.type_otp === TYPE_OTP.changeInfo && paramsOTP?.new_username) {
      try {
        setLoading(true);
        await apiChangeInformation({
          username: paramsOTP.new_username,
          code,
        });

        if (validateIsEmail(paramsOTP.new_username)) {
          updatePassport({
            profile: {
              information: {
                email: paramsOTP.new_username,
              },
            },
          });
        } else if (validateIsPhone(paramsOTP.new_username)) {
          updatePassport({
            profile: {
              information: {
                phone: paramsOTP.new_username,
              },
            },
          });
        }
        ModalAlert.success({
          i18Content: 'alert.successUpdatePro',
          onClose: () => navigate(SETTING_ROUTE.personalInformation),
        });
      } catch (err) {
        handleWrongOtp();
        ModalAlert.error({
          content: err,
        });
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
        title: 'login.confirmOTP',
      }}>
      <View style={$wrapNotification}>
        <StyleText i18Text="login.notiOTP" customStyle={$textNotification} />
        <StyleText
          originValue={params.paramsOTP.username}
          customStyle={[$textDestination]}
        />
      </View>

      <Animatable.View animation={isAnimation ? 'shake' : ''} style={$viewCode}>
        <CodeField
          ref={codeRef}
          {...props}
          value={code}
          onChangeText={setCode}
          cellCount={standValue.OTP_LENGTH}
          rootStyle={$inputView}
          keyboardType={'number-pad'}
          textContentType="oneTimeCode"
          renderCell={({index, symbol, isFocused}) => (
            <View
              key={index}
              onLayout={getCellOnLayoutHandler(index)}
              style={[$input, {backgroundColor: theme.white}]}>
              <Text style={[$textInput, {color: theme.p_800}]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
      </Animatable.View>

      <StyleButton
        title="login.component.sendOTP.confirmButton"
        onPress={onPressConfirm}
        containerStyle={$confirmButton}
        disable={code.length !== standValue.OTP_LENGTH}
        isLoading={loading}
      />

      <StyleTouchable
        customStyle={$btnSendAgain}
        disable={!shouldSendAgain}
        onPress={onSendAgain}>
        <StyleText
          i18Text={
            shouldSendAgain
              ? 'login.component.sendOTP.sendAgain'
              : 'login.component.sendOTP.sendAgainNoCount'
          }
          i18Params={{countdown}}
          customStyle={$textSendAgain}
        />
      </StyleTouchable>
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  alignItems: 'center',
};
const $wrapNotification: ViewStyle = {
  marginTop: verticalScale(36),
  alignItems: 'center',
};
const $textNotification: TextStyle = {
  marginBottom: '2%',
};
const $textDestination: TextStyle = {
  fontWeight: 'bold',
};
const $inputView: ViewStyle = {
  width: '100%',
};
const $input: ViewStyle = {
  width: scale(52),
  height: scale(52),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: BORDER_RADIUS.f4,
};
const $textInput: TextStyle = {
  fontSize: moderateScale(32),
};
const $viewCode: ViewStyle = {
  width: '100%',
  paddingHorizontal: scale(30),
  paddingVertical: verticalScale(2),
  marginTop: verticalScale(50),
  marginBottom: verticalScale(132),
};
const $btnSendAgain: ViewStyle = {
  marginTop: verticalScale(45),
};
const $confirmButton: ViewStyle = {
  paddingHorizontal: scale(50),
};
const $textSendAgain: TextStyle = {
  fontWeight: 'bold',
  textDecorationLine: 'underline',
};

export default SendOTP;
