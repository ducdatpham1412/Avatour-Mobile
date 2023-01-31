import {apiRequestOTP} from 'api/module';
import {TYPE_OTP} from 'asset/enum';
import Theme from 'asset/theme/Theme';
import {StyleButton, StyleContainer} from 'components/base';
import InputBox from 'components/common/InputBox';
import LoadingScreen from 'components/LoadingScreen';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {validateIsEmail, validateIsPhone} from 'utility/validate';
import BackgroundAuthen from '../components/BackgroundAuthen';

const EnterUsername = () => {
    const usernameRef = useRef<TextInput>(null);

    const [username, setUsername] = useState('');
    const trimUsername = username.trim();

    const disable =
        !validateIsEmail(trimUsername) && !validateIsPhone(trimUsername);

    useEffect(() => {
        usernameRef.current?.focus();
    }, []);

    const onRequestOTP = async () => {
        try {
            Redux.setIsLoading(true);
            await apiRequestOTP({
                username: trimUsername,
                typeOTP: TYPE_OTP.resetPassword,
            });
            navigate(LOGIN_ROUTE.sendOTP, {
                name: trimUsername,
                isResetPassword: true,
                username: trimUsername,
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <View style={styles.contentView}>
            <InputBox
                i18Placeholder="login.forgetPassword.type.username"
                value={username}
                onChangeText={text => setUsername(text)}
                selectionColor={Theme.darkTheme.textHightLight}
            />

            <StyleButton
                title="login.forgetPassword.type.continue"
                containerStyle={styles.btnSendBox}
                onPress={onRequestOTP}
                disable={disable}
            />
        </View>
    );
};

const ForgetPasswordType = () => {
    const insets = useSafeAreaInsets();
    const isLoading = Redux.getIsLoading();

    return (
        <StyleContainer
            customStyle={styles.container}
            containerStyle={{backgroundColor: Theme.darkTheme.backgroundColor}}
            TopComponent={<BackgroundAuthen />}
            headerProps={{
                title: 'login.forgetPassword.type.header',
                containerStyle: {
                    marginTop: insets?.top || 0,
                    backgroundColor: 'transparent',
                },
                iconStyle: {color: Theme.common.white},
                titleStyle: {color: Theme.common.white},
            }}>
            {<EnterUsername />}
            {isLoading && <LoadingScreen />}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        marginTop: '50@vs',
    },
    textNotification: {
        fontSize: '17@ms',
        marginTop: '20@vs',
    },
    iconsBox: {
        width: '90%',
        flexDirection: 'row',
        marginTop: '30@vs',
        justifyContent: 'space-around',
    },
    contentView: {
        height: '100%',
        width: '100%',
        marginTop: '170@vs',
    },
    btnSendBox: {
        paddingHorizontal: '30@s',
        marginTop: '70@vs',
    },
    textComeToFacebook: {
        fontSize: '20@ms',
        fontStyle: 'italic',
        textDecorationLine: 'underline',
    },
    wrapTextTitle: {
        color: Theme.common.white,
        fontSize: '16@ms0.3',
        fontWeight: '400',
        marginLeft: '35@s',
        marginBottom: '10@vs',
    },
});

export default ForgetPasswordType;
