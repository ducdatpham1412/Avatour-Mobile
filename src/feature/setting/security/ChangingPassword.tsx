import {apiChangePassword} from 'api/setting';
import {useAppSelector} from 'app-redux/store';
import {Eye} from 'components';
import {StyleButton} from 'components/base';
import {InputBox} from 'components/common';
import {useLoading, useTheme} from 'hook';
import {ModalAlert} from 'navigation/screen/modals';
import React, {useRef, useState} from 'react';
import {Keyboard, TextInput, TextStyle, ViewStyle} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {verticalScale} from 'react-native-size-matters';
import {useAsync} from 'react-use';
import AsyncStorage from 'utility/asyncStore';
import {scale} from 'utility/scale';
import {validatePassword} from 'utility/validate';

interface Props {
  isOpening: boolean;
  onChangeOpening: (value: boolean) => void;
}

const ChangingPassword = ({isOpening, onChangeOpening}: Props) => {
  const {modeExp} = useAppSelector(state => state.accountSlice);
  const theme = useTheme();
  const {loading, setLoading} = useLoading();

  const aim = useSharedValue(0);
  const heightStyle = useAnimatedStyle(() => ({
    height: aim.value,
  }));

  const newPwRef = useRef<TextInput>(null);
  const cfPwRef = useRef<TextInput>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [securePw, setSecurePw] = useState({
    curPw: true,
    pw: true,
    cfPw: true,
  });

  useAsync(async () => {
    aim.value = withTiming(isOpening ? verticalScale(250) : 0, {
      duration: 300,
    });
    setSecurePw({
      curPw: true,
      pw: true,
      cfPw: true,
    });
    Keyboard.dismiss();
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
      <InputBox
        value={currentPassword}
        i18Placeholder="setting.currentPassword"
        containerStyle={$moduleInput}
        style={{backgroundColor: theme.gray_100}}
        secureTextEntry={securePw.curPw}
        onSubmitEditing={() => newPwRef.current?.focus()}
        onChangeText={text => setCurrentPassword(text)}
        rightCpn={
          <Eye
            open={!securePw.curPw}
            onPress={() =>
              setSecurePw(pre => ({
                curPw: !pre.curPw,
                pw: pre.pw,
                cfPw: pre.cfPw,
              }))
            }
            style={{
              paddingHorizontal: scale(12),
              color: theme.gray_600,
            }}
          />
        }
      />

      <InputBox
        ref={newPwRef}
        value={newPassword}
        i18Placeholder="setting.newPassword"
        containerStyle={$moduleInput}
        style={{backgroundColor: theme.gray_100}}
        secureTextEntry={securePw.pw}
        onSubmitEditing={() => cfPwRef.current?.focus()}
        onChangeText={text => setNewPassword(text)}
        rightCpn={
          <Eye
            open={!securePw.pw}
            onPress={() =>
              setSecurePw(pre => ({
                curPw: pre.curPw,
                pw: !pre.pw,
                cfPw: pre.cfPw,
              }))
            }
            style={{
              paddingHorizontal: scale(12),
              color: theme.gray_600,
            }}
          />
        }
      />

      <InputBox
        ref={cfPwRef}
        value={confirmPassword}
        i18Placeholder="setting.confirmPassword"
        containerStyle={$moduleInput}
        style={{backgroundColor: theme.gray_100}}
        secureTextEntry={securePw.cfPw}
        onChangeText={text => setConfirmPassword(text)}
        rightCpn={
          <Eye
            open={!securePw.cfPw}
            onPress={() =>
              setSecurePw(pre => ({
                curPw: pre.curPw,
                pw: pre.pw,
                cfPw: !pre.cfPw,
              }))
            }
            style={{
              paddingHorizontal: scale(12),
              color: theme.gray_600,
            }}
          />
        }
      />

      <StyleButton
        containerStyle={$buttonConfirm}
        title="common.confirm"
        onPress={confirmChangePassword}
        isLoading={loading}
      />
    </Animated.View>
  );
};

const $container: ViewStyle = {
  width: '100%',
  alignItems: 'center',
  alignSelf: 'center',
  overflow: 'hidden',
};
const $moduleInput: TextStyle = {
  marginTop: verticalScale(8),
};
const $buttonConfirm: ViewStyle = {
  marginTop: verticalScale(16),
  paddingHorizontal: scale(30),
  paddingVertical: verticalScale(8),
};

export default ChangingPassword;
