import {yupResolver} from '@hookform/resolvers/yup';
import {apiResetPassword} from 'api/module';
import {standValue} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleButton, StyleContainer, StyleInputForm} from 'components/base';
import LoadingScreen from 'components/LoadingScreen';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useRef} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {TextInput} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {yupValidate} from 'utility/validate';
import * as yup from 'yup';
import BackgroundAuthen from '../components/BackgroundAuthen';

const ForgetPasswordForm = ({route}: any) => {
    const {username} = route.params;
    const insets = useSafeAreaInsets();
    const isLoading = Redux.getIsLoading();

    const newRef = useRef<TextInput>(null);
    const confirmRef = useRef<TextInput>(null);

    const passwordSchema = yup.object().shape({
        newPass: yupValidate.password(),
        confirmPass: yupValidate.password('newPass'),
    });
    const form = useForm({
        mode: 'all',
        resolver: yupResolver(passwordSchema),
    });
    const {
        handleSubmit,
        formState: {isValid},
    } = form;

    const submitChangePass = async (data: any) => {
        try {
            Redux.setIsLoading(true);
            await apiResetPassword({
                username,
                newPassword: data.newPass,
                confirmPassword: data.confirmPass,
            });
            appAlert('alert.successChangePass', {
                actionClickOk: () => navigate(LOGIN_ROUTE.loginScreen),
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <StyleContainer
            customStyle={styles.container}
            containerStyle={{backgroundColor: Theme.darkTheme.backgroundColor}}
            TopComponent={<BackgroundAuthen />}
            headerProps={{
                title: 'login.forgetPassword.form.header',
                containerStyle: {
                    marginTop: insets?.top || 0,
                    backgroundColor: 'transparent',
                },
                iconStyle: {color: Theme.common.white},
                titleStyle: {color: Theme.common.white},
            }}>
            <FormProvider {...form}>
                <StyleInputForm
                    name="username"
                    value={username}
                    containerStyle={[
                        styles.inputForm,
                        {marginTop: verticalScale(100)},
                    ]}
                    editable={false}
                />

                <StyleInputForm
                    ref={newRef}
                    name="newPass"
                    i18Placeholder="login.forgetPassword.form.newPass"
                    secureTextEntry={true}
                    containerStyle={styles.inputForm}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                    onSubmitEditing={() => confirmRef.current?.focus()}
                    selectionColor={Theme.darkTheme.textHightLight}
                />

                <StyleInputForm
                    ref={confirmRef}
                    name="confirmPass"
                    i18Placeholder="login.forgetPassword.form.confirmPass"
                    secureTextEntry={true}
                    containerStyle={styles.inputForm}
                    maxLength={standValue.PASSWORD_MAX_LENGTH}
                    selectionColor={Theme.darkTheme.textHightLight}
                />
            </FormProvider>

            <StyleButton
                title="login.forgetPassword.form.buttonDone"
                containerStyle={styles.buttonConfirm}
                disable={!isValid}
                onPress={handleSubmit(submitChangePass)}
            />

            {isLoading && <LoadingScreen />}
        </StyleContainer>
    );
};
export default ForgetPasswordForm;

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    inputForm: {
        width: '85%',
    },
    buttonConfirm: {
        marginTop: '10%',
        paddingHorizontal: '40@vs',
    },
    textButton: {
        fontSize: 25,
    },
});
