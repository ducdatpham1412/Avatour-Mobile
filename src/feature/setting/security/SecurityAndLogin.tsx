import {StyleContainer} from 'components/base';
import TypeDetailSetting from 'components/common/TypeDetailSetting';
import Redux from 'hook/useRedux';
import React, {useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import Foundation from 'react-native-vector-icons/Foundation';
import Entypo from 'react-native-vector-icons/Entypo';
import StyleHeader from 'navigation/components/StyleHeader';
import {navigate} from 'navigation/NavigationService';
import {SETTING_ROUTE} from 'navigation/config/routes';
import Feather from 'react-native-vector-icons/Feather';
import UserBlocked from './UserBlocked';
import ChangingPassword from './ChangingPassword';

const SecurityAndLogin = () => {
    const theme = Redux.getTheme();

    const [firstLoadPassword, setFirstLoadPassword] = useState(false);
    const [isOpeningChangingPassword, setIsOpeningChangingPassword] =
        useState(false);
    const openCloseChangingPassword = () => {
        setFirstLoadPassword(true);
        setIsOpeningChangingPassword(!isOpeningChangingPassword);
    };

    const [firstLoadBlocked, setFirstLoadBlocked] = useState(false);
    const [isOpeningBlocked, setIsOpeningBlocked] = useState(false);
    const openCloseBlockUser = () => {
        setFirstLoadBlocked(true);
        setIsOpeningBlocked(!isOpeningBlocked);
    };

    const onGoToLockAccount = () => {
        navigate(SETTING_ROUTE.confirmLockAccount);
    };

    const onGoToDeleteAccount = () => {
        navigate(SETTING_ROUTE.confirmDeleteAccount);
    };

    return (
        <>
            <StyleHeader title="setting.securityAndLogin.headerTitle" />

            <StyleContainer customStyle={styles.container}>
                {/* Change password */}
                <TypeDetailSetting
                    title="setting.securityAndLogin.changePass"
                    onPress={openCloseChangingPassword}
                    icon={
                        <Foundation
                            name="key"
                            style={[
                                styles.stylesIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                />
                {(firstLoadPassword || isOpeningChangingPassword) && (
                    <ChangingPassword isOpening={isOpeningChangingPassword} />
                )}

                {/* User blocked */}
                <TypeDetailSetting
                    title="setting.securityAndLogin.userBlocked"
                    onPress={openCloseBlockUser}
                    icon={
                        <Entypo
                            name="block"
                            style={[
                                styles.stylesIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                />
                {(firstLoadBlocked || isOpeningBlocked) && (
                    <UserBlocked isOpening={isOpeningBlocked} />
                )}

                {/* Lock my account */}
                <TypeDetailSetting
                    title="setting.securityAndLogin.lockAccount"
                    onPress={onGoToLockAccount}
                    icon={
                        <Feather
                            name="lock"
                            style={[
                                styles.stylesIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                />

                {/* Delete my account */}
                <TypeDetailSetting
                    title="setting.securityAndLogin.deleteAccount"
                    onPress={onGoToDeleteAccount}
                    icon={
                        <Feather
                            name="delete"
                            style={[
                                styles.stylesIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                />
            </StyleContainer>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        paddingHorizontal: '27@s',
        alignItems: 'center',
    },
    stylesIcon: {
        fontSize: '20@ms',
    },
});

export default SecurityAndLogin;
