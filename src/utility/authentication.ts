import {apiLogOut, apiLoginSocial} from 'api/authentication';
import {apiGetPassport, apiGetResource} from 'api/discovery';
import {
  logOut as reduxLogOut,
  setModeExp,
  setToken,
  updatePassport,
  updateResource,
} from 'app-redux';
import Store from 'app-redux/store';
import {TYPE_SOCIAL_LOGIN} from 'asset/enum';
import SocketManager from 'hook/sockets/SocketManager';
import {navigate} from 'navigation/NavigationService';
import {LOGIN_ROUTE} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import AsyncStorage from 'utility/asyncStore';
import I18Next from './I18Next';
import {chooseLanguageFromId, isIOS} from './assistant';

interface TypeParamsLoginSuccess {
  itemLoginSuccess: TypeItemLoginSuccess;
  isKeepSign: boolean;
  isLoginSocial: boolean;
}

interface RequestLoginSocialParams {
  tokenSocial: string | null;
  typeSocial: TYPE_SOCIAL_LOGIN;
}

interface LogOutParams {
  callApiLogOut: boolean;
  callBack?(): void;
}

export const loginSuccess = async (params: TypeParamsLoginSuccess) => {
  const {itemLoginSuccess, isKeepSign, isLoginSocial} = params;
  await AsyncStorage.updateActiveUser(itemLoginSuccess);

  if (
    isKeepSign &&
    itemLoginSuccess.username &&
    itemLoginSuccess.password &&
    !isLoginSocial
  ) {
    await AsyncStorage.addStorageAcc({
      username: itemLoginSuccess.username,
      password: itemLoginSuccess.password,
    });
  }
  if (isLoginSocial) {
    await AsyncStorage.setIsHavingSocialAccount(true);
  }

  const passport = await apiGetPassport();
  const resource = await apiGetResource();

  updatePassport(passport.data);
  updateResource(resource.data);

  setToken(itemLoginSuccess.token);
  setModeExp(false);
  I18Next.changeLanguage(chooseLanguageFromId(passport.data.profile.language));
};

export const requestLoginSocial = async (params: RequestLoginSocialParams) => {
  const {tokenSocial, typeSocial} = params;

  try {
    const res = await apiLoginSocial(
      {
        os: Number(isIOS),
        provider: typeSocial,
      },
      tokenSocial,
    );
    if (res.data?.token && res.data?.refreshToken) {
      const itemLoginSuccess: TypeItemLoginSuccess = {
        username: res.data.username,
        password: '',
        token: res.data.token,
        refreshToken: res.data?.refreshToken,
      };
      if (res.data?.isNewUser) {
        navigate(LOGIN_ROUTE.editBasicInformation, {
          itemLoginSuccess,
          isLoginSocial: true,
        });
      } else {
        await loginSuccess({
          itemLoginSuccess,
          isKeepSign: false,
          isLoginSocial: true,
        });
      }
    }
  } catch (error) {
    ModalAlert.error({
      i18Content: 'alert.loginFail',
    });
  }
};

export const logOut = async (params?: LogOutParams) => {
  const {callApiLogOut = true, callBack} = params ?? {};
  try {
    const isModeExp = Store.getState().accountSlice.modeExp;

    // logout google
    // const isGoogleSignedIn = await GoogleSignin.isSignedIn();
    // if (isGoogleSignedIn) {
    //     await GoogleSignin.revokeAccess();
    //     await GoogleSignin.signOut();
    // }

    if (!isModeExp && callApiLogOut) {
      const {refreshToken} = await AsyncStorage.getActiveUser();
      await apiLogOut(refreshToken || '');
    }
    await AsyncStorage.logOut();
    reduxLogOut();
    const socketManager = SocketManager.getInstance();
    socketManager.close();
    callBack?.();
  } catch (err) {
    ModalAlert.error({
      content: err,
    });
  }
};
