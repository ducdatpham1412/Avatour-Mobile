import {apiRequestDeleteAccount} from 'api/authentication';
import Images from 'asset/img/images';
import {
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleText,
} from 'components/base';
import {useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AuthenticateService from 'utility/login/loginService';

const ConfirmDeleteAccount = () => {
  const theme = useTheme();

  const onRequestDeleteAccount = async () => {
    try {
      await apiRequestDeleteAccount();
      await AuthenticateService.logOut({hadRefreshTokenBlacked: false});
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };

  return (
    <StyleContainer
      customStyle={styles.container}
      headerProps={{
        title: 'setting.securityAndLogin.deleteAccount',
      }}
      backgroundColor={theme.white}>
      <StyleIcon
        source={Images.images.squirrelEnjoy}
        size={100}
        customStyle={styles.iconAlert}
      />

      <View style={[styles.alertView, {backgroundColor: theme.background}]}>
        <StyleText i18Text="setting.securityAndLogin.areYouSureDeleteAccount" />
      </View>

      <StyleButton
        title="setting.securityAndLogin.continueDelete"
        containerStyle={styles.buttonDelete}
        onPress={onRequestDeleteAccount}
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
  iconAlert: {
    marginTop: '30@vs',
  },
  buttonDelete: {
    marginTop: '60@vs',
    paddingHorizontal: '20@s',
  },
});

export default ConfirmDeleteAccount;
