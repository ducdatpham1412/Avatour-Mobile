import Images from 'asset/img/images';
import {StyleImage, StyleText} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

interface HeaderLogoProps {
    hasLogo?: boolean;
    hasName?: boolean;
    hasSlogan?: boolean;
}

const HeaderLogo = (props: HeaderLogoProps) => {
    const theme = Redux.getTheme();
    const {hasLogo = true, hasName = false, hasSlogan = false} = props;

    return (
        <View style={styles.logo}>
            {hasLogo && (
                <StyleImage
                    source={Images.images.logo}
                    customStyle={[styles.logoImg, {tintColor: theme.logoColor}]}
                    resizeMode="contain"
                />
            )}

            {hasName && (
                <StyleText
                    originValue="Doffy"
                    customStyle={[styles.logoText, {color: theme.textColor}]}
                />
            )}

            {hasSlogan && (
                <StyleText
                    i18Text="login.loginScreen.slogan"
                    customStyle={[styles.sloganText, {color: theme.textColor}]}
                />
            )}
        </View>
    );
};

const styles = ScaledSheet.create({
    logo: {
        width: '100%',
        minHeight: '130@vs',
        paddingVertical: '15@vs',
        alignItems: 'center',
        justifyContent: 'center',
    }, // Logo and Slogan part
    logoImg: {
        width: '50%',
        height: '60@vs',
    },
    logoText: {
        fontSize: '20@ms',
        fontWeight: 'bold',
    },
    sloganText: {
        fontSize: '10@ms',
        fontStyle: 'italic',
        marginTop: '10@vs',
    },
});

export default HeaderLogo;
