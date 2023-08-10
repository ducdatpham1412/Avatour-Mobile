import {apiChangePassword} from 'api/setting';
import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS} from 'asset';
import {AppInput, StyleButton} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, TextStyle, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {verticalScale} from 'react-native-size-matters';
import {useAsync} from 'react-use';
import {borderWidthTiny} from 'utility/assistant';
import AsyncStorage from 'utility/asyncStore';
import {moderateScale, scale} from 'utility/scale';
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

  const aim = useSharedValue(0);
  const heightStyle = useAnimatedStyle(() => ({
    height: aim.value,
  }));

  const ref_newPassword = useRef<TextInput>(null);
  const ref_passwordCf = useRef<TextInput>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useAsync(async () => {
    aim.value = withTiming(isOpening ? verticalScale(250) : 0, {
      duration: 300,
    });
  }, [isOpening]);

  const confirmChangePassword = async () => {
    const activeAccount = await AsyncStorage.getActiveUser();

    if (activeAccount) {
      try {
        setLoading(true);

        if (currentPassword !== activeAccount.password) {
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
          await AsyncStorage.updateActiveUser({
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
    }
  };

  return (
    <Animated.View style={[$container, heightStyle]}>
      <AppInput
        value={currentPassword}
        placeholder={t('setting.securityAndLogin.nowPass')}
        style={[
          $moduleInput,
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
          $moduleInput,
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
          $moduleInput,
          {
            borderColor: theme.gray_500,
          },
        ]}
        secureTextEntry
        onChangeText={text => setConfirmPassword(text)}
      />

      <StyleButton
        containerStyle={$buttonConfirm}
        titleStyle={$textButtonCf}
        title="setting.securityAndLogin.buttonChangePass"
        onPress={confirmChangePassword}
        isLoading={loading}
      />
    </Animated.View>
  );
};

const $container: ViewStyle = {
  width: '90%',
  paddingHorizontal: scale(12),
  alignItems: 'center',
  alignSelf: 'center',
  overflow: 'hidden',
};
const $moduleInput: TextStyle = {
  width: '100%',
  borderWidth: borderWidthTiny,
  borderRadius: BORDER_RADIUS.f3,
  marginVertical: verticalScale(5),
  paddingTop: verticalScale(8),
  paddingBottom: verticalScale(8),
  paddingHorizontal: scale(10),
};
const $buttonConfirm: ViewStyle = {
  marginVertical: verticalScale(15),
  paddingHorizontal: scale(30),
  paddingVertical: verticalScale(8),
};
const $textButtonCf: TextStyle = {
  fontSize: moderateScale(14),
};

export default ChangingPassword;
