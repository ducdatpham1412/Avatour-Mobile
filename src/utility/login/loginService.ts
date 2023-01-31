import {
    apiGetPassport,
    apiGetResource,
    apiLogin,
    apiLoginSocial,
    apiLogOut,
} from 'api/module';
import request from 'api/request';
import FindmeStore from 'app-redux/store';
import {TYPE_SOCIAL_LOGIN} from 'asset/enum';
import Redux from 'hook/useRedux';
import {closeSocket} from 'hook/useSocketIO';
import ROOT_SCREEN, {
    DISCOVERY_ROUTE,
    LOGIN_ROUTE,
} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import {chooseLanguageFromId, isIOS} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import I18Next from 'utility/I18Next';

const AUTH_URL_REFRESH_TOKEN = '/refreshToken';

interface requestLoginParams {
    username: string;
    password: string;
    isKeepSign: boolean;
}
interface RequestLoginSocialParams {
    tokenSocial: string | null;
    typeSocial: TYPE_SOCIAL_LOGIN;
}

export interface TypeItemLoginSuccess {
    username?: string;
    password?: string;
    token: string;
    refreshToken: string;
}

interface TypeParamsLoginSuccess {
    itemLoginSuccess: TypeItemLoginSuccess;
    isKeepSign: boolean;
    isLoginSocial: boolean;
}

const AuthenticateService = {
    loginSuccess: async (params: TypeParamsLoginSuccess) => {
        const {itemLoginSuccess, isKeepSign, isLoginSocial} = params;
        await FindmeAsyncStorage.updateActiveUser(itemLoginSuccess);

        if (isKeepSign && itemLoginSuccess.username && !isLoginSocial) {
            await FindmeAsyncStorage.addStorageAcc({
                username: itemLoginSuccess.username,
                password: itemLoginSuccess.password,
            });
        }
        if (isLoginSocial) {
            await FindmeAsyncStorage.setIsHavingSocialAccount(true);
        }

        const passport = await apiGetPassport();
        const resource = await apiGetResource();

        Redux.updatePassport(passport.data);
        Redux.updateResource(resource.data);

        // passport must be above token to set in SocketProvider
        Redux.setToken(itemLoginSuccess.token);
        Redux.setModeExp(false);
        Redux.setTheme(passport.data.setting.theme);
        const temp = chooseLanguageFromId(passport.data.setting.language);
        I18Next.changeLanguage(temp);
        await FindmeAsyncStorage.editLanguageModeExp(temp);

        navigate(ROOT_SCREEN.mainScreen, {
            screen: DISCOVERY_ROUTE.discoveryScreen,
        });
    },

    requestLogin: async (params: requestLoginParams) => {
        const {username, password, isKeepSign} = params;

        try {
            Redux.setIsLoading(true);

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
                AuthenticateService.loginSuccess({
                    itemLoginSuccess: {
                        username,
                        password,
                        token: res.data.token,
                        refreshToken: res.data.refreshToken,
                    },
                    isKeepSign,
                    isLoginSocial: false,
                });
            }
        } catch (err) {
            appAlert('alert.loginFail');
        } finally {
            Redux.setIsLoading(false);
        }
    },
    requestLoginSocial: async (params: RequestLoginSocialParams) => {
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
                    AuthenticateService.loginSuccess({
                        itemLoginSuccess,
                        isKeepSign: false,
                        isLoginSocial: true,
                    });
                }
            }
        } catch (error) {
            appAlert('alert.loginFail');
        }
    },

    refreshToken: (inputRefreshToken: string) => {
        request.post(AUTH_URL_REFRESH_TOKEN, {
            refresh_token: inputRefreshToken,
        });
    },

    logOut: async (params: {
        hadRefreshTokenBlacked: boolean;
        callBack?(): void;
    }) => {
        try {
            Redux.setIsLoading(true);
            const isModeExp = FindmeStore.getState().accountSlice.modeExp;

            // logout google
            // const isGoogleSignedIn = await GoogleSignin.isSignedIn();
            // if (isGoogleSignedIn) {
            //     await GoogleSignin.revokeAccess();
            //     await GoogleSignin.signOut();
            // }

            if (!isModeExp && !params.hadRefreshTokenBlacked) {
                const {refreshToken} = await FindmeAsyncStorage.getActiveUser();
                await apiLogOut(refreshToken || '');
            }
            await FindmeAsyncStorage.logOut();
            Redux.logOut();
            closeSocket();
            params?.callBack?.();
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    },
};

export default AuthenticateService;
