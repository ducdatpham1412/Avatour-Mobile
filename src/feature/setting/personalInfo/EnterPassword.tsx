import {
  apiLockAccount,
  apiRequestDeleteAccount,
  apiRequestOTP,
} from 'api/authentication';
import {apiChangeInformation} from 'api/setting';
import {updatePassport} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {TYPE_OTP} from 'asset/enum';
import {AppInput, StyleButton, StyleContainer} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE, SETTING_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ViewStyle} from 'react-native';
import {borderWidthTiny} from 'utility/assistant';
import AsyncStorage from 'utility/asyncStore';
import Authentication from 'utility/authentication';
import {scale, verticalScale} from 'utility/scale';

const EnterPassword = ({
  route,
}: RouteParams<AppParamsList[SETTING_ROUTE.enterPassword]>) => {
  const {newInfo, mode} = route.params ?? {};
  const {t} = useTranslation();
  const theme = useTheme();
  const {loading, setLoading} = useLoading();
  const {email} = useAppSelector(
    state => state.accountSlice.passport.profile.information,
  );
  const [password, setPassword] = useState('');

  const onConfirmPassword = async () => {
    const activeUser = await AsyncStorage.getActiveUser();

    if (activeUser?.password !== password) {
      ModalAlert.error({
        i18Content: 'setting.personalInfo.passwordNotTrue',
      });
      return;
    }

    /**
     * Change information
     */
    if (mode === 'change-information' && newInfo) {
      if (newInfo.email) {
        try {
          setLoading(true);
          await apiRequestOTP({
            username: email,
            type_otp: TYPE_OTP.changeInfo,
            new_username: newInfo.email,
          });
          navigate(LOGIN_ROUTE.sendOTP, {
            paramsOTP: {
              username: email,
              type_otp: TYPE_OTP.changeInfo,
              new_username: newInfo.email,
            },
          });
        } catch (err) {
          ModalAlert.error({
            content: err,
          });
        } finally {
          setLoading(false);
        }
      } else if (newInfo.phone) {
        try {
          setLoading(true);
          await apiChangeInformation({
            username: newInfo.phone,
          });
          updatePassport({
            profile: {
              information: {
                phone: newInfo.phone,
              },
            },
          });
          ModalAlert.success({
            i18Content: 'alert.successChange',
            onClose: () => navigate(SETTING_ROUTE.personalInformation),
          });
        } catch (err) {
          ModalAlert.error({
            content: err,
          });
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    /**
     * Lock account
     */
    if (mode === 'lock-account') {
      try {
        setLoading(true);
        await apiLockAccount();
        await Authentication.logOut();
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    /**
     * Delete account
     */
    if (mode === 'delete-account') {
      try {
        setLoading(true);
        await apiRequestDeleteAccount();
        await Authentication.logOut();
      } catch (err) {
        ModalAlert.error({
          content: err,
        });
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  return (
    <StyleContainer
      headerProps={{
        title: 'setting.personalInfo.enterPassword',
      }}
      backgroundColor={theme.white}>
      <AppInput
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        style={$inputView}
        onSubmitEditing={onConfirmPassword}
        autoFocus
        placeholder={t('setting.personalInfo.password')}
      />

      <StyleButton
        title="setting.personalInfo.confirm"
        containerStyle={$button}
        onPress={onConfirmPassword}
        isLoading={loading}
      />
    </StyleContainer>
  );
};

const $inputView: ViewStyle = {
  width: '70%',
  marginTop: verticalScale(150),
  alignSelf: 'center',
  borderBottomWidth: borderWidthTiny,
  paddingHorizontal: scale(8),
  paddingBottom: verticalScale(8),
};
const $button: ViewStyle = {
  marginTop: verticalScale(100),
};

export default EnterPassword;
