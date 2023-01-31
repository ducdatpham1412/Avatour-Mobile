import {yupResolver} from '@hookform/resolvers/yup';
import {TypeRegisterReq, TypeRequestOTPRequest} from 'api/interface';
import {apiRequestOTP} from 'api/module';
import {SIGN_UP_TYPE, TYPE_OTP} from 'asset/enum';
import {standValue, TERMS_URL} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleButton,
    StyleContainer,
    StyleInputForm,
    StyleText,
    StyleTouchable,
} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useMemo, useRef, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {TextInput, View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {yupValidate} from 'utility/validate';
import * as yup from 'yup';

const defaultFormSignUp = __DEV__
    ? {
          username: 'doffy@doffy.xyz',
          password: '12345678',
          confirmPass: '12345678',
      }
    : {};

const SignUpForm = () => {
    const isEmail = true;
    const isPhone = false;

    const usernameRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const [haveAgreed, setHaveAgreed] = useState(__DEV__);

    const chooseYupUsername = () => {
        if (isEmail) {
            return yupValidate.email();
        }
        if (isPhone) {
            return yupValidate.phone();
        }
        return yupValidate.default();
    };

    const signUpSchema = yup.object().shape({
        username: chooseYupUsername(),
        password: yupValidate.password(),
        confirmPass: yupValidate.password('password'),
    });

    const form = useForm({
        mode: 'all',
        resolver: yupResolver(signUpSchema),
        defaultValues: defaultFormSignUp,
    });
    const {
        handleSubmit,
        formState: {isValid},
    } = form;

    const onSignUp = async (data: any) => {
        const itemSignUp: TypeRegisterReq = {
            email: isEmail ? data.username : '',
            phone: isPhone ? data.username : '',
            password: data.password,
            confirmPassword: data.confirmPass,
            code: '',
        };

        // params to check code
        const params: TypeRequestOTPRequest = {
            username: data.username,
            targetInfo: SIGN_UP_TYPE.email,
            password: data.password,
            confirmPassword: data.confirmPass,
            typeOTP: TYPE_OTP.register,
        };

        try {
            Redux.setIsLoading(true);
            await apiRequestOTP(params);
            navigate(LOGIN_ROUTE.sendOTP, {
                name: data.username,
                itemSignUp,
                paramsOTP: params,
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    const UserNameHolder = useMemo(() => {
        if (isEmail) {
            return 'login.signUp.form.enterEmail';
        }
        if (isPhone) {
            return 'login.signUp.form.enterPhone';
        }
        return '';
    }, []);

    const RenderButtonCheckAgree = useMemo(() => {
        return (
            <StyleTouchable
                customStyle={styles.boxTappingAgree}
                onPress={() => setHaveAgreed(!haveAgreed)}>
                {haveAgreed && (
                    <AntDesign name="check" style={styles.iconCheck} />
                )}
            </StyleTouchable>
        );
    }, [haveAgreed]);

    const CheckAgreeOrSignIn = () => {
        return (
            <View style={styles.boxTitleAgree}>
                <StyleText
                    i18Text="login.signUp.hadReadAndAgree"
                    customStyle={styles.titleAgree}>
                    {' '}
                    <StyleText
                        i18Text="login.signUp.doffyTermsAndPolicy"
                        customStyle={[
                            styles.titleAgree,
                            {
                                textDecorationLine: 'underline',
                                fontWeight: 'bold',
                            },
                        ]}
                        onPress={() =>
                            navigate(ROOT_SCREEN.webView, {
                                title: 'setting.aboutUs.termsOfUse',
                                linkWeb: TERMS_URL,
                            })
                        }
                    />
                </StyleText>
            </View>
        );
    };

    return (
        <StyleContainer containerStyle={styles.container}>
            <FormProvider {...form}>
                <StyleInputForm
                    ref={usernameRef}
                    name="username"
                    i18Placeholder={UserNameHolder}
                    containerStyle={{marginTop: verticalScale(50)}}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                    selectionColor={Theme.darkTheme.textHightLight}
                />

                <StyleInputForm
                    ref={passwordRef}
                    name="password"
                    i18Placeholder="login.signUp.form.password"
                    containerStyle={styles.inputForm}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    secureTextEntry
                    selectionColor={Theme.darkTheme.textHightLight}
                />

                <StyleInputForm
                    ref={confirmPasswordRef}
                    name="confirmPass"
                    i18Placeholder="login.signUp.form.confirmPass"
                    containerStyle={styles.inputForm}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                    secureTextEntry
                    selectionColor={Theme.darkTheme.textHightLight}
                />
            </FormProvider>

            <View style={styles.termPolicyView}>
                {RenderButtonCheckAgree}
                {CheckAgreeOrSignIn()}
            </View>

            <StyleButton
                title="login.signUp.form.confirmButton"
                containerStyle={styles.button}
                onPress={handleSubmit(onSignUp)}
                disable={!isValid || !haveAgreed}
            />
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    inputForm: {
        marginTop: '7@vs',
    },
    // terms and policy
    termPolicyView: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: '10%',
        marginTop: '30@vs',
    },
    boxTappingAgree: {
        width: '20@ms',
        height: '20@ms',
        borderWidth: '0.5@s',
        borderRadius: '4@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Theme.darkTheme.textColor,
    },
    iconCheck: {
        fontSize: '15@ms',
        color: Theme.darkTheme.textHightLight,
    },
    boxTitleAgree: {
        flex: 1,
        paddingLeft: '7@s',
    },
    titleAgree: {
        fontSize: '14@ms',
        lineHeight: '20@ms',
        color: Theme.darkTheme.textHightLight,
    },
    // button
    button: {
        marginTop: '60@vs',
    },
});

export default SignUpForm;
