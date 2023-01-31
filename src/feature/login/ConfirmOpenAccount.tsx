import {apiRequestOTP} from 'api/module';
import {TYPE_OTP} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {
    StyleButton,
    StyleContainer,
    StyleIcon,
    StyleText,
} from 'components/base';
import LoadingScreen from 'components/LoadingScreen';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import BackgroundAuthen from './components/BackgroundAuthen';

interface Props {
    route: {
        params: {
            username: string;
        };
    };
}

const ConfirmOpenAccount = ({route}: Props) => {
    const isLoading = Redux.getIsLoading();

    const onOpenAccount = async () => {
        try {
            Redux.setIsLoading(true);
            await apiRequestOTP({
                username: route.params.username,
                typeOTP: TYPE_OTP.requestOpenAccount,
            });
            navigate(LOGIN_ROUTE.sendOTP, {
                name: route.params.username,
                isOpenAccount: true,
                username: route.params.username,
            });
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    return (
        <StyleContainer
            TopComponent={<BackgroundAuthen />}
            customStyle={styles.container}
            headerProps={{
                title: 'setting.securityAndLogin.lockAccount',
                iconStyle: {
                    color: Theme.common.white,
                },
                titleStyle: {
                    color: Theme.common.white,
                },
                containerStyle: styles.headerView,
            }}>
            <StyleIcon
                source={Images.images.successful}
                size={100}
                customStyle={styles.iconAlert}
            />

            <View
                style={[
                    styles.alertView,
                    {backgroundColor: Theme.darkTheme.backgroundButtonColor},
                ]}>
                <StyleText
                    i18Text="login.loginScreen.yourAccountIsBeingLock"
                    customStyle={[
                        styles.textAlert,
                        {color: Theme.darkTheme.textColor},
                    ]}
                />
            </View>

            <StyleButton
                title="login.loginScreen.continue"
                containerStyle={styles.buttonDelete}
                onPress={onOpenAccount}
            />

            {isLoading && <LoadingScreen />}
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    container: {
        alignItems: 'center',
    },
    headerView: {
        backgroundColor: 'transparent',
        marginTop: Metrics.safeTopPadding,
    },
    alertView: {
        paddingHorizontal: '10@s',
        paddingVertical: '30@vs',
        borderRadius: '14@s',
        marginTop: '40@vs',
    },
    textAlert: {
        fontSize: '14@ms',
    },
    iconAlert: {
        marginTop: '30@vs',
    },
    buttonDelete: {
        marginTop: '60@vs',
        paddingHorizontal: '40@s',
    },
});

export default ConfirmOpenAccount;
