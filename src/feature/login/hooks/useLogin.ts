import appleAuth from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useIsFocused} from '@react-navigation/native';
import {RootState, useAppSelector} from 'app-redux/store';
import {TYPE_SOCIAL_LOGIN} from 'asset/enum';
import {ModalAlert} from 'navigation/screen/modals';
import {useEffect, useRef, useState} from 'react';
import AsyncStorage from 'utility/asyncStore';
import AuthenticateService from 'utility/login/loginService';

const loginForm = __DEV__
  ? {
      username: 'ducdat@gmail.com',
      password: 'ducdat123',
    }
  : {username: '', password: ''};

const useLogin = () => {
  const {username: initUserName, password: initPassword} = useAppSelector(
    state => state.accountSlice.login,
  );
  const isFocused = useIsFocused();

  const [username, setUsername] = useState(initUserName || loginForm?.username);
  const [password, setPassword] = useState(initPassword || loginForm?.password);

  const [loading, setLoading] = useState(false);

  const [listSavedAccounts, setListSavedAccount] = useState<
    Array<RootState['accountSlice']['login']>
  >([]);

  const getListAcc = async () => {
    const res = await AsyncStorage.getStorageAcc();
    setListSavedAccount(res);
  };

  useEffect(() => {
    if (isFocused) {
      getListAcc();
    }
  }, [isFocused]);

  const signInWithGoogle = useRef(async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      AuthenticateService.requestLoginSocial({
        tokenSocial: userInfo.idToken,
        typeSocial: TYPE_SOCIAL_LOGIN.google,
      });
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    } finally {
      setLoading(false);
    }
  }).current;

  const signInWithApple = useRef(async () => {
    try {
      setLoading(true);
      const res = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const tokenSocial = res.authorizationCode;
      // console.log('token haha: ', res);
      AuthenticateService.requestLoginSocial({
        tokenSocial,
        typeSocial: TYPE_SOCIAL_LOGIN.apple,
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoading(false);
    }
  }).current;

  const submitLogin = async (isKeepSign: boolean) => {
    setLoading(true);
    await AuthenticateService.requestLogin({
      username: username.trim(),
      password: password.trim(),
      isKeepSign,
    });
    setLoading(false);
  };

  const selectSavedAccount = (index: number) => {
    setUsername(listSavedAccounts[index].username);
    setPassword(listSavedAccounts[index].password);
  };

  const deleteSavedAccount = async (index: number) => {
    const tempt = listSavedAccounts.slice();
    tempt.splice(index, 1);
    setListSavedAccount(tempt);
    await AsyncStorage.deleteAccAtIndex(index);
  };

  return [
    {username, password, listSavedAccounts, loading},
    {
      setUsername,
      setPassword,
      signInWithGoogle,
      signInWithApple,
      submitLogin,
      selectSavedAccount,
      deleteSavedAccount,
    },
  ] as const;
};

export default useLogin;
