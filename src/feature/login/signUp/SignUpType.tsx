import {SIGN_UP_TYPE} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleContainer, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import IconType from '../components/IconType';

const SignUpType = () => {
    const theme = Redux.getTheme();

    const navigateToSignForm = (type: number) => () => {
        navigate(LOGIN_ROUTE.signUpForm, {
            typeSignUp: type,
        });
    };

    return (
        <StyleContainer>
            <View style={styles.content}>
                <StyleText
                    i18Text="login.signUp.type.chooseMethod"
                    customStyle={[
                        styles.textChooseMethod,
                        {color: theme.textColor},
                    ]}
                />

                <View style={styles.iconsBox}>
                    {/* Facebook */}
                    <IconType
                        source={Images.icons.facebook}
                        title="Facebook"
                        onPress={navigateToSignForm(SIGN_UP_TYPE.facebook)}
                        disable
                    />

                    {/* Google */}
                    <IconType
                        source={Images.icons.email}
                        title="Email"
                        onPress={navigateToSignForm(SIGN_UP_TYPE.email)}
                    />

                    {/* Phone */}
                    <IconType
                        source={Images.icons.phone}
                        title="login.signUp.type.phone"
                        onPress={navigateToSignForm(SIGN_UP_TYPE.phone)}
                        disable
                    />
                </View>
            </View>
        </StyleContainer>
    );
};

const styles = ScaledSheet.create({
    content: {
        alignItems: 'center',
        marginTop: '70@vs',
    },
    textChooseMethod: {
        fontSize: '17@ms',
        marginTop: '25@vs',
    },
    iconsBox: {
        width: '90%',
        flexDirection: 'row',
        marginTop: '70@vs',
    },
});

export default SignUpType;
