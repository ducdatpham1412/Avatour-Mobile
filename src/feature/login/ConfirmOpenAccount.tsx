import {apiRequestOTP} from 'api/authentication';
import {TYPE_OTP} from 'asset/enum';
import Images from 'asset/img/images';
import {
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleText,
} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const ConfirmOpenAccount = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.confirmOpenAccount]>) => {
  const theme = useTheme();
  const {loading, setLoading} = useLoading();

  const onOpenAccount = async () => {
    try {
      setLoading(true);
      await apiRequestOTP({
        username: route.params.username,
        type_otp: TYPE_OTP.requestOpenAccount,
      });
      navigate(LOGIN_ROUTE.sendOTP, {
        paramsOTP: {
          username: route.params?.username,
          type_otp: TYPE_OTP.requestOpenAccount,
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
        title: 'setting.securityAndLogin.lockAccount',
      }}
      backgroundColor={theme.white}>
      <StyleIcon
        source={Images.images.successful}
        size={100}
        customStyle={styles.iconAlert}
      />

      <View style={[styles.alertView, {backgroundColor: theme.background}]}>
        <StyleText i18Text="login.yourAccountIsBeingLock" mode="html" />
      </View>

      <StyleButton
        title="common.continue"
        containerStyle={styles.buttonDelete}
        onPress={onOpenAccount}
        isLoading={loading}
      />
    </StyleContainer>
  );
};

const styles = ScaledSheet.create({
  container: {
    alignItems: 'center',
  },
  alertView: {
    paddingHorizontal: '10@s',
    paddingVertical: '30@vs',
    borderRadius: '14@s',
    marginTop: '40@vs',
  },
  textAlert: {
    fontSize: '14@ms',
  },
  iconAlert: {
    marginTop: '30@vs',
  },
  buttonDelete: {
    marginTop: '60@vs',
    paddingHorizontal: '40@s',
  },
});

export default ConfirmOpenAccount;
