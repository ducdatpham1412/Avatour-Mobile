import {apiChangePassword} from 'api/setting';
import {useAppSelector} from 'app-redux/store';
import {AppInput, StyleButton} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, TextInput} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {useAsync} from 'react-use';
import {borderWidthTiny} from 'utility/assistant';
import AppAsyncStorage from 'utility/asyncStore';
import {scale} from 'utility/scale';
import {validatePassword} from 'utility/validate';

interface Props {
  isOpening: boolean;
  onChangeOpening: (value: boolean) => void;
}

const ChangingPassword = ({isOpening, onChangeOpening}: Props) => {
  const {t} = useTranslation();
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const theme = useTheme();
  const {loading, setLoading} = useLoading();

  const aim = useRef(new Animated.Value(0)).current;
  const [height, setHeight] = useState(0);
  aim.addListener(({value}) => setHeight(value));

  const ref_newPassword = useRef<TextInput>(null);
  const ref_passwordCf = useRef<TextInput>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useAsync(async () => {
    Animated.timing(aim, {
      toValue: isOpening ? verticalScale(250) : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpening]);

  const confirmChangePassword = async () => {
    const savedPassword = (await AppAsyncStorage.getActiveUser()).password;
    try {
      setLoading(true);

      if (currentPassword !== savedPassword) {
        ModalAlert.error({
          i18Content: 'alert.nowPassError',
        });
        return;
      }

      if (!validatePassword(newPassword)) {
        ModalAlert.error({
          i18Content: 'alert.regexPass',
        });
        return;
      }

      if (!modeExp) {
        await apiChangePassword({
          old_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        });
        await AppAsyncStorage.updateActiveUser({
          password: newPassword,
        });
        await AppAsyncStorage.editIndexNowAccount({
          password: newPassword,
        });
      }
      ModalAlert.success({
        i18Content: 'alert.successChange',
        onClose: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          onChangeOpening(false);
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
    <Animated.View style={[styles.container, {height}]}>
      <AppInput
        value={currentPassword}
        placeholder={t('setting.securityAndLogin.nowPass')}
        style={[
          styles.moduleInput,
          {
            borderColor: theme.gray_500,
          },
        ]}
        secureTextEntry
        onSubmitEditing={() => ref_newPassword.current?.focus()}
        onChangeText={text => setCurrentPassword(text)}
      />
      <AppInput
        value={newPassword}
        ref={ref_newPassword}
        placeholder={t('setting.securityAndLogin.newPass')}
        style={[
          styles.moduleInput,
          {
            borderColor: theme.gray_500,
          },
        ]}
        secureTextEntry
        onSubmitEditing={() => ref_passwordCf.current?.focus()}
        onChangeText={text => setNewPassword(text)}
      />
      <AppInput
        value={confirmPassword}
        ref={ref_passwordCf}
        placeholder={t('setting.securityAndLogin.confirmPass')}
        style={[
          styles.moduleInput,
          {
            borderColor: theme.gray_500,
          },
        ]}
        secureTextEntry
        onChangeText={text => setConfirmPassword(text)}
      />

      <StyleButton
        containerStyle={styles.buttonConfirm}
        titleStyle={styles.textButtonCf}
        title="setting.securityAndLogin.buttonChangePass"
        onPress={confirmChangePassword}
        isLoading={loading}
      />
    </Animated.View>
  );
};

const styles = ScaledSheet.create({
  container: {
    width: '90%',
    paddingHorizontal: '20@s',
    alignItems: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  moduleInput: {
    width: '100%',
    borderWidth: borderWidthTiny,
    borderRadius: '10@ms',
    marginVertical: '5@vs',
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(8),
    paddingHorizontal: scale(10),
  },
  buttonConfirm: {
    marginVertical: '15@vs',
    paddingHorizontal: '30@s',
    paddingVertical: '7@vs',
  },
  textButtonCf: {
    fontSize: '14@ms',
  },
  inputStyle: {
    paddingHorizontal: '10@s',
    backgroundColor: 'transparent',
    paddingTop: '7@vs',
    paddingBottom: '7@vs',
  },
});

export default ChangingPassword;
