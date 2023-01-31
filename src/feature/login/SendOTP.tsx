import {useIsFocused} from '@react-navigation/native';
import {TypeRegisterReq, TypeRequestOTPRequest} from 'api/interface';
import {
    apiCheckOTP,
    apiOpenAccount,
    apiRegister,
    apiRequestOTP,
} from 'api/module';
import {TYPE_OTP} from 'asset/enum';
import {standValue} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleButton,
    StyleContainer,
    StyleText,
    StyleTouchable,
} from 'components/base';
import LoadingScreen from 'components/LoadingScreen';
import useCountdown from 'hook/useCountdown';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Vibration, Keyboard, Text, TextInput, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
    CodeField,
    Cursor,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {TypeItemLoginSuccess} from 'utility/login/loginService';
import BackgroundAuthen from './components/BackgroundAuthen';

interface ParamsType {
    name: string;

    // for reset password
    isResetPassword?: boolean;
    username?: string;

    // for register
    itemSignUp?: TypeRegisterReq; // transmitted from "SignUpForm"
    paramsOTP: TypeRequestOTPRequest;

    // for open account
    isOpenAccount?: boolean;
    // username?: string
}

const SendOTP = ({route}: any) => {
    const params: ParamsType = route?.params;
    const {
        name,
        isResetPassword,
        username,
        itemSignUp,
        paramsOTP,
        isOpenAccount,
    } = params;

    const insets = useSafeAreaInsets();
    const isFocusedScreen = useIsFocused();
    const isLoading = Redux.getIsLoading();
    const [isAnimation, setIsAnimation] = useState(false);

    const {countdown, resetCountdown, clearCountdown} = useCountdown(
        standValue.COUNT_DOWN,
    );
    const codeRef = useRef<TextInput>(null);
    const [code, setCode] = useState('');
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    useEffect(() => {
        if (!isFocusedScreen) {
            clearCountdown();
        }
    }, [isFocusedScreen]);

    useEffect(() => {
        codeRef.current?.focus();
    }, []);

    useEffect(() => {
        if (code.length === 1) {
            setIsAnimation(false);
        }
        if (code.length === standValue.OTP_LENGTH) {
            Keyboard.dismiss();
        }
    }, [code]);

    const handleWrongOtp = () => {
        Vibration.vibrate();
        setIsAnimation(true);
        setCode('');
    };

    const onPressConfirm = async () => {
        /**
         * Reset password
         */
        if (isResetPassword && username) {
            try {
                Redux.setIsLoading(true);
                await apiCheckOTP({
                    username,
                    code,
                });
                navigate(LOGIN_ROUTE.forgetPasswordForm, {
                    username,
                });
            } catch (err) {
                handleWrongOtp();
            } finally {
                Redux.setIsLoading(false);
            }
            return;
        }

        /**
         * Register
         */
        if (itemSignUp) {
            try {
                Redux.setIsLoading(true);
                const res = await apiRegister({
                    ...itemSignUp,
                    code,
                });
                const itemLoginSuccess: TypeItemLoginSuccess = {
                    username: itemSignUp.email || itemSignUp.phone,
                    password: itemSignUp.password,
                    token: res.data.token,
                    refreshToken: res.data.refreshToken,
                };
                navigate(LOGIN_ROUTE.agreeTermOfService, {
                    itemLoginSuccess,
                });
            } catch (err) {
                handleWrongOtp();
            } finally {
                Redux.setIsLoading(false);
            }
        }

        /**
         * Open account
         */
        if (isOpenAccount && username) {
            try {
                Redux.setIsLoading(true);
                await apiOpenAccount({
                    username,
                    verifyCode: code,
                });
                appAlert('login.loginScreen.openAccountSuccess', {
                    actionClickOk: () => navigate(LOGIN_ROUTE.loginScreen),
                });
            } catch (err) {
                handleWrongOtp();
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        }
    };

    const onSendAgain = async () => {
        try {
            if (code.length) {
                setCode('');
            }
            if (itemSignUp) {
                resetCountdown();
                await apiRequestOTP(paramsOTP);
            } else if (isResetPassword && username) {
                await apiRequestOTP({
                    username,
                    typeOTP: TYPE_OTP.resetPassword,
                });
            }
        } catch (err) {
            appAlert(err);
        }
    };

    /**
     * Render view
     */
    const TextSendAgain = useMemo(() => {
        return countdown > 0
            ? 'login.component.sendOTP.sendAgain'
            : 'login.component.sendOTP.sendAgainNoCount';
    }, [countdown > 0]);

    const RenderTextNotification = useMemo(() => {
        return (
            <View style={styles.wrapTextNotification}>
                <StyleText
                    i18Text="login.component.sendOTP.notiOTP"
                    customStyle={styles.textNotification}
                />
                <StyleText
                    originValue={name}
                    customStyle={[styles.textDestination]}
                />
            </View>
        );
    }, []);

    return (
        <StyleContainer
            customStyle={styles.container}
            containerStyle={{backgroundColor: Theme.darkTheme.backgroundColor}}
            TopComponent={<BackgroundAuthen />}
            headerProps={{
                title: 'login.component.sendOTP.header',
                containerStyle: {
                    marginTop: insets?.top || 0,
                    backgroundColor: 'transparent',
                },
                iconStyle: {color: Theme.common.white},
                titleStyle: {color: Theme.common.white},
            }}>
            {RenderTextNotification}

            {/* OTP Code Field */}
            <Animatable.View
                animation={isAnimation ? 'shake' : ''}
                style={styles.wrapViewCode}>
                <CodeField
                    ref={codeRef}
                    {...props}
                    value={code}
                    onChangeText={setCode}
                    cellCount={standValue.OTP_LENGTH}
                    rootStyle={styles.otpInputBox}
                    keyboardType={'number-pad'}
                    textContentType="oneTimeCode"
                    renderCell={({index, symbol, isFocused}) => (
                        <View
                            key={index}
                            onLayout={getCellOnLayoutHandler(index)}
                            style={styles.codeInput}>
                            <Text style={styles.codeInputText}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        </View>
                    )}
                />
            </Animatable.View>

            <StyleButton
                title="login.component.sendOTP.confirmButton"
                onPress={onPressConfirm}
                containerStyle={styles.confirmButton}
                disable={code.length !== standValue.OTP_LENGTH}
            />

            <StyleTouchable
                customStyle={styles.buttonSendAgain}
                disable={countdown > 0}
                onPress={onSendAgain}>
                <StyleText
                    i18Text={TextSendAgain}
                    i18Params={{countdown}}
                    customStyle={[styles.titleSendAgain]}
                />
            </StyleTouchable>
            {isLoading && <LoadingScreen />}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    wrapTextNotification: {
        marginTop: '36@vs',
        alignItems: 'center',
    },
    textNotification: {
        fontSize: '17@ms',
        marginBottom: '2%',
        color: Theme.common.white,
    },
    textDestination: {
        fontSize: '13@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    enterCodeInputView: {
        width: '150@vs',
        marginTop: '30@vs',
    },
    enterCodeInput: {
        paddingHorizontal: '20@vs',
        textAlign: 'center',
        fontSize: '20@ms',
    },
    buttonSendAgain: {
        marginTop: '45@vs',
    },
    confirmButton: {
        paddingHorizontal: '50@vs',
    },
    titleSendAgain: {
        fontSize: '15@ms',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: Theme.common.white,
    },
    codeInput: {
        width: '52@s',
        height: '52@s',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Theme.common.blueInput,
        borderRadius: '5@s',
    },
    codeInputText: {
        fontSize: '32@ms0.3',
        color: Theme.common.white,
    },
    otpInputBox: {
        width: '100%',
    },
    wrapViewCode: {
        width: '100%',
        paddingHorizontal: '30@s',
        paddingVertical: '2@vs',
        marginTop: '105@vs',
        marginBottom: '132@vs',
    },
});

export default SendOTP;
