import {apiGetIdEnjoyMode, apiGetResource} from 'api/module';
import Images from 'asset/img/images';
import {PRIVACY_URL, TERMS_URL} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';

const ChoosingLoginOrEnjoy = () => {
    const win = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(win, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
        }).start();
    }, []);

    const onEnjoyModeExp = async () => {
        try {
            const res = await apiGetIdEnjoyMode();
            const resource = await apiGetResource();

            Redux.updatePassport({profile: {id: res.data}});
            Redux.updateResource(resource.data);
            Redux.setModeExp(true);
        } catch (err) {
            appAlert(err);
        }
    };

    const onGoToTermsOfUse = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.aboutUs.termsOfUse',
            linkWeb: TERMS_URL,
        });
    };

    const onGoToPrivacyPolicy = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.aboutUs.privacyPolicy',
            linkWeb: PRIVACY_URL,
        });
    };

    /**
     * Render view
     */
    const RenderLoginIcon = () => {
        return (
            <Animated.View
                style={[
                    styles.twoSideBox,
                    {
                        transform: [{scale: win}],
                    },
                ]}>
                <StyleTouchable
                    onPress={onEnjoyModeExp}
                    customStyle={styles.buttonChoose}>
                    <StyleText
                        i18Text="login.enjoyModeNoAcc"
                        customStyle={[styles.text, {color: Theme.common.white}]}
                    />
                    <StyleImage
                        source={Images.images.squirrelLogin}
                        customStyle={styles.imgChoose}
                        resizeMode="contain"
                    />
                </StyleTouchable>
            </Animated.View>
        );
    };

    const RenderAgreeTerms = () => {
        return (
            <View style={styles.ageeTermsView}>
                <StyleText
                    i18Text="login.loginScreen.byLoginOrTappingEnjoy"
                    customStyle={[
                        styles.textTermAndPolicy,
                        {color: Theme.common.white},
                    ]}>
                    {' '}
                    <StyleText
                        i18Text="login.loginScreen.termsOfUse"
                        onPress={onGoToTermsOfUse}
                        customStyle={[
                            styles.textTermAndPolicy,
                            styles.textLink,
                            {color: Theme.common.white},
                        ]}
                    />
                    <StyleText
                        i18Text="login.loginScreen.learnMore"
                        onPress={onGoToTermsOfUse}
                        customStyle={[
                            styles.textTermAndPolicy,
                            {color: Theme.common.white},
                        ]}
                    />{' '}
                    <StyleText
                        i18Text="login.loginScreen.privacyPolicy"
                        onPress={onGoToPrivacyPolicy}
                        customStyle={[
                            styles.textTermAndPolicy,
                            styles.textLink,
                            {color: Theme.common.white},
                        ]}
                    />
                    {'.'}
                </StyleText>
            </View>
        );
    };

    return (
        <View style={[styles.container]}>
            {RenderLoginIcon()}
            {RenderAgreeTerms()}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: '30@vs',
    },
    choosingView: {
        flexDirection: 'row',
        marginTop: '40@vs',
    },
    twoSideBox: {
        alignItems: 'center',
        marginTop: '40@vs',
    },
    buttonChoose: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: '15@ms',
        fontWeight: 'bold',
        marginBottom: '20@vs',
        textAlign: 'center',
    },
    imgChoose: {
        width: '150@s',
        height: '200@s',
    },
    ageeTermsView: {
        width: '100%',
        paddingHorizontal: '30@s',
        marginTop: '50@vs',
    },
    textTermAndPolicy: {
        fontSize: '10@ms',
        lineHeight: '20@ms',
        textAlign: 'center',
    },
    textLink: {
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});

export default ChoosingLoginOrEnjoy;
