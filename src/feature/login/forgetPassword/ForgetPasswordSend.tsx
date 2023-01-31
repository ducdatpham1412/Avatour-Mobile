import {apiRequestOTP} from 'api/module';
import {SIGN_UP_TYPE, TYPE_OTP} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleContainer, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import HeaderLogo from '../components/HeaderLogo';
import IconType from '../components/IconType';

interface ForgetPasswordProps {
    route: {
        params: {
            username: string;
        };
    };
}

const ForgetPasswordSend = ({route}: ForgetPasswordProps) => {
    const theme = Redux.getTheme();
    const {username} = route.params;

    const onRequestOTP = async (targetInfo: number) => {
        try {
            Redux.setIsLoading(true);
            const res = await apiRequestOTP({
                username,
                targetInfo,
                typeOTP: TYPE_OTP.resetPassword,
            });

            let name = '';
            if (targetInfo === SIGN_UP_TYPE.email) {
                name = res.data.email;
            } else if (targetInfo === SIGN_UP_TYPE.phone) {
                name = res.data.phone;
            }
            navigate(LOGIN_ROUTE.sendOTP, {
                name,
                isResetPassword: true,
                username,
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <StyleContainer>
            <HeaderLogo />

            <View style={styles.contentView}>
                <StyleText
                    i18Text="login.forgetPassword.send.receiveThrow"
                    customStyle={[
                        styles.textNotification,
                        {color: theme.textColor},
                    ]}
                />

                {/* FACEBOOK, GOOGLE OR PHONE */}
                <View style={styles.iconsBox}>
                    {/* EMAIL */}
                    <IconType
                        source={Images.icons.email}
                        title="Email"
                        onPress={() => onRequestOTP(SIGN_UP_TYPE.email)}
                    />

                    {/* PHONE */}
                    <IconType
                        source={Images.icons.phone}
                        title="login.forgetPassword.send.phone"
                        onPress={() => onRequestOTP(SIGN_UP_TYPE.phone)}
                    />
                </View>
            </View>
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    inputBox: {
        flex: 3,
        alignItems: 'center',
    },
    contentView: {
        flex: 2.4,
        alignItems: 'center',
    },
    textNotification: {
        fontSize: '20@ms',
        marginTop: '20@vs',
    },
    iconsBox: {
        width: '90%',
        flexDirection: 'row',
        marginTop: '60@vs',
        justifyContent: 'space-around',
    },
});

export default ForgetPasswordSend;
