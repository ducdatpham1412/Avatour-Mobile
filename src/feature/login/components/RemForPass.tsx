import Theme from 'asset/theme/Theme';
import {StyleText, StyleTouchable} from 'components/base';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface RemForPassProps {
    isKeepSignIn: boolean;
    onClickKeepSignIn(): void;
}

const RemForPass = (props: RemForPassProps) => {
    const {isKeepSignIn, onClickKeepSignIn} = props;

    return (
        <View style={styles.container}>
            <StyleTouchable
                customStyle={styles.rememberButton}
                onPress={onClickKeepSignIn}>
                {isKeepSignIn && (
                    <AntDesign name="check" style={styles.checkIcon} />
                )}
            </StyleTouchable>

            <StyleText
                i18Text="login.loginScreen.keepSignIn"
                customStyle={styles.keepSignInText}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '10%',
        marginTop: '20@vs',
    },
    rememberButton: {
        width: '20@vs',
        height: '20@vs',
        borderWidth: 0.5,
        borderRadius: '5@vs',
        marginRight: '7@vs',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Theme.darkTheme.textColor,
    },
    checkIcon: {
        fontSize: '20@ms',
        color: Theme.darkTheme.textColor,
    },
    keepSignInText: {
        fontSize: '13@ms',
        color: Theme.darkTheme.textHightLight,
    },
    forgotButton: {
        position: 'absolute',
        right: 0,
    },
    forgotButtonText: {
        fontSize: '13@ms',
        fontStyle: 'italic',
    },
});

export default RemForPass;
