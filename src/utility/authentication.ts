import {apiLogOut, apiLoginSocial} from 'api/authentication';
import {apiGetPassport, apiGetResource} from 'api/discovery';
import {
  logOut as reduxLogOut,
  setModeExp,
  setToken,
  updatePassport,
  updateResource,
} from 'app-redux';
import {TYPE_SOCIAL_LOGIN} from 'asset/enum';
import SocketManager from 'hook/sockets/SocketManager';
import {navigate} from 'navigation/NavigationService';
import {LOGIN_ROUTE, ROOT_SCREEN} from 'navigation/config';
import {ModalAlert} from 'navigation/screen/modals';
import AsyncStorage from 'utility/asyncStore';
import I18Next from './I18Next';
import {chooseLanguageFromId, isIOS} from './assistant';

interface TypeParamsLoginSuccess {
  itemLoginSuccess: TypeItemLoginSuccess;
  rememberAccount: boolean;
}

interface RequestLoginSocialParams {
  tokenSocial: string | null;
  typeSocial: TYPE_SOCIAL_LOGIN;
}

interface LogOutParams {
  callApiLogOut: boolean;
}

class Authentication {
  static callback: (() => void) | null = null;

  static open = (cb: () => void) => {
    navigate(ROOT_SCREEN.loginRoute);
    this.callback = cb;
  };

  static loginSuccess = async (params: TypeParamsLoginSuccess) => {
    const {itemLoginSuccess, rememberAccount} = params;
    await AsyncStorage.setActiveUser(itemLoginSuccess);

    if (
      rememberAccount &&
      itemLoginSuccess.username &&
      itemLoginSuccess.password
    ) {
      await AsyncStorage.addStorageAcc({
        username: itemLoginSuccess.username,
        password: itemLoginSuccess.password,
      });
    }

    setToken(itemLoginSuccess.token);

    const passport = await apiGetPassport();
    const resource = await apiGetResource();
    updatePassport(passport.data);
    updateResource(resource.data);

    setModeExp(false);

    I18Next.changeLanguage(
      chooseLanguageFromId(passport.data.profile.language),
    );
  };

  static requestLoginSocial = async (params: RequestLoginSocialParams) => {
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
          await this.loginSuccess({
            itemLoginSuccess,
            rememberAccount: false,
          });
        }
      }
    } catch (error) {
      ModalAlert.error({
        i18Content: 'alert.loginFail',
      });
    }
  };

  static logOut = async (params?: LogOutParams) => {
    const {callApiLogOut = true} = params ?? {};
    try {
      // logout google
      // const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      // if (isGoogleSignedIn) {
      //     await GoogleSignin.revokeAccess();
      //     await GoogleSignin.signOut();
      // }

      if (callApiLogOut) {
        const activeUser = await AsyncStorage.getActiveUser();
        await apiLogOut(activeUser?.refreshToken || '');
      }
      await AsyncStorage.logOut();
      reduxLogOut();
      const socketManager = SocketManager.getInstance();
      socketManager.close();
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    }
  };
}

export default Authentication;
