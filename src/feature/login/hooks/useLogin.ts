import appleAuth from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useIsFocused} from '@react-navigation/native';
import {apiLogin} from 'api/authentication';
import {useAppSelector} from 'app-redux/store';
import {TYPE_SOCIAL_LOGIN} from 'asset/enum';
import {navigate} from 'navigation/NavigationService';
import {LOGIN_ROUTE} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import {useRef, useState} from 'react';
import {useAsync} from 'react-use';
import AsyncStorage from 'utility/asyncStore';
import Authentication from 'utility/authentication';

const loginForm = __DEV__
  ? {
      username: 'ducdat.avatour@gmail.com',
      password: 'Ducdat@123',
    }
  : {username: '', password: ''};

const useLogin = () => {
  const {username: initUserName, password: initPassword} = useAppSelector(
    state => state.accountSlice.login,
  );
  const isFocused = useIsFocused();
  //   const {mutate} = useSWRConfig();

  const [username, setUsername] = useState(initUserName || loginForm?.username);
  const [password, setPassword] = useState(initPassword || loginForm?.password);

  const [loading, setLoading] = useState(false);
  const [listSavedAccounts, setListSavedAccount] = useState<TypeAccount[]>([]);

  useAsync(async () => {
    if (isFocused) {
      const res = await AsyncStorage.getAccounts();
      setListSavedAccount(res);
    }
  }, [isFocused]);

  const signInWithGoogle = useRef(async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      await Authentication.requestLoginSocial({
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
      Authentication.requestLoginSocial({
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

  const submitLogin = async (rememberAccount: boolean) => {
    try {
      setLoading(true);
      const res = await apiLogin({username, password});
      /**
       * Account is temporary locking
       */
      if (res.data?.isLocking && res.data?.username) {
        navigate(LOGIN_ROUTE.confirmOpenAccount, {
          username: res.data.username,
        });
        return;
      }

      /**
       * Login success
       */
      if (res.data?.token && res.data?.refreshToken) {
        await Authentication.loginSuccess({
          itemLoginSuccess: {
            username,
            password,
            token: res.data.token,
            refreshToken: res.data.refreshToken,
          },
          rememberAccount,
        });
        // await mutate(() => true);
        Authentication.callback?.();
      }
    } catch (err) {
      ModalAlert.error({
        i18Content: 'alert.loginFail',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectSavedAccount = (value: TypeAccount) => {
    setUsername(value.username);
    setPassword(value.password);
  };

  const deleteSavedAccount = async (deleteUsername: string) => {
    setListSavedAccount(pre =>
      pre.filter(item => item.username !== deleteUsername),
    );
    await AsyncStorage.deleteAccount(deleteUsername);
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
