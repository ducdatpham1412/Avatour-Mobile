import {appleAuth} from '@invertase/react-native-apple-authentication';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import {useIsFocused} from '@react-navigation/native';
import {TYPE_SOCIAL_LOGIN} from 'asset/enum';
import Images from 'asset/img/images';
import Theme from 'asset/theme/Theme';
import {
    StyleButton,
    StyleContainer,
    StyleImage,
    StyleText,
} from 'components/base';
import StyleTouchable from 'components/base/StyleTouchable';
import InputBox from 'components/common/InputBox';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {isIOS} from 'utility/assistant';
import FindmeAsyncStorage from 'utility/FindmeAsyncStorage';
import AuthenticateService from 'utility/login/loginService';
import ListSaveAcc from './components/ListSaveAcc';
import RemForPass from './components/RemForPass';

const loginForm = __DEV__
    ? {
          username: 'ducdat@gmail.com',
          password: 'ducdat123',
      }
    : {username: '', password: ''};

const signInWithGoogle = async () => {
    try {
        Redux.setIsLoading(true);
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
        Redux.setIsLoading(false);
    }
};

const onSignInWithApple = async () => {
    try {
        Redux.setIsLoading(true);
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
        appAlert(err);
    } finally {
        Redux.setIsLoading(false);
    }
};

const LoginScreen = () => {
    const [userRef, setUserRef] = useState(false);
    const isFocused = useIsFocused();
    const passRef = useRef<any>(null);

    const {username, password} = Redux.getLogin();
    const [user, setUser] = useState(username || loginForm?.username);
    const [pass, setPass] = useState(password || loginForm?.password);
    const [isKeepSign, setIsKeepSign] = useState(false);

    const getListAcc = async () => {
        const res = await FindmeAsyncStorage.getStorageAcc();
        setListSaveAcc(res);
    };

    useEffect(() => {
        if (isFocused) {
            getListAcc();
        }
    }, [isFocused]);

    /**
     * For list acc saved
     */
    const [listSaveAcc, setListSaveAcc] = useState<Array<any>>([]);
    const selectSaveAcc = (index: number) => {
        setUser(listSaveAcc[index].username);
        setPass(listSaveAcc[index].password);
    };

    const deleteSaveAcc = async (index: number) => {
        const tempt = listSaveAcc.slice();
        tempt.splice(index, 1);
        setListSaveAcc(tempt);
        await FindmeAsyncStorage.deleteAccAtIndex(index);
    };

    // Click login
    const onSubmitLogin = async () => {
        await AuthenticateService.requestLogin({
            username: user.trim(),
            password: pass.trim(),
            isKeepSign,
        });
    };

    /**
     * Render view
     */
    const SignInPlatforms = () => {
        return (
            <View style={styles.signUpView}>
                <StyleText
                    i18Text="login.orSignIn"
                    customStyle={styles.textOrSignIn}
                />
                <View style={styles.signUpBox}>
                    {isIOS && (
                        <StyleTouchable onPress={onSignInWithApple}>
                            <StyleImage
                                source={Images.icons.apple}
                                customStyle={styles.iconSignIn}
                            />
                        </StyleTouchable>
                    )}

                    {/* <StyleTouchable
                        onPress={() => {
                            navigate(LOGIN_ROUTE.signUpForm, {
                                typeSignUp: SIGN_UP_TYPE.email,
                            });
                        }}>
                        <StyleImage
                            source={Images.icons.facebook}
                            customStyle={styles.iconSignIn}
                        />
                    </StyleTouchable> */}

                    <StyleTouchable onPress={signInWithGoogle}>
                        <StyleImage
                            source={Images.icons.email}
                            customStyle={styles.iconSignIn}
                        />
                    </StyleTouchable>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StyleContainer containerStyle={styles.body}>
                <View style={styles.inputView}>
                    <InputBox
                        i18Placeholder="login.loginScreen.username"
                        value={user}
                        onChangeText={value => setUser(value)}
                        onFocus={() => setUserRef(true)}
                        onBlur={() => setUserRef(false)}
                        onSubmitEditing={() => passRef.current.focus()}
                        selectionColor={Theme.darkTheme.textHightLight}
                    />

                    <InputBox
                        ref={passRef}
                        i18Placeholder="login.loginScreen.password"
                        value={pass}
                        onChangeText={value => setPass(value)}
                        containerStyle={styles.inputForm}
                        returnKeyType="default"
                        secureTextEntry
                        selectionColor={Theme.darkTheme.textHightLight}
                    />

                    <RemForPass
                        isKeepSignIn={isKeepSign}
                        onClickKeepSignIn={() => setIsKeepSign(!isKeepSign)}
                    />
                </View>
                <StyleButton
                    title="login.loginScreen.signIn"
                    containerStyle={styles.loginButton}
                    disable={!user || !pass}
                    onPress={onSubmitLogin}
                />

                <StyleTouchable
                    customStyle={styles.forgotPasswordView}
                    onPress={() => navigate(LOGIN_ROUTE.forgetPasswordType)}>
                    <StyleText
                        i18Text="login.forgotPassword"
                        customStyle={styles.forgotPasswordText}
                    />
                </StyleTouchable>

                {SignInPlatforms()}

                {userRef && !user && (
                    <ListSaveAcc
                        listAcc={listSaveAcc}
                        selectAcc={selectSaveAcc}
                        deleteAcc={deleteSaveAcc}
                    />
                )}
            </StyleContainer>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    body: {
        backgroundColor: 'transparent',
    },
    // input
    inputView: {
        width: '100%',
        marginTop: '50@vs',
    },
    inputForm: {
        marginTop: '20@vs',
    },
    // button login
    loginButton: {
        marginTop: '30@vs',
    },
    loginText: {
        fontSize: 25,
    },
    // forgot password
    forgotPasswordView: {
        alignSelf: 'center',
        marginTop: '20@vs',
    },
    forgotPasswordText: {
        fontSize: '13@ms',
        textDecorationLine: 'underline',
        color: Theme.darkTheme.textHightLight,
    },
    // question sign up
    signUpView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textOrSignIn: {
        fontSize: '13@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    signUpBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '10@vs',
    },
    iconSignIn: {
        width: '45@ms',
        height: '45@ms',
        marginHorizontal: '7@ms',
    },
});

export default LoginScreen;
