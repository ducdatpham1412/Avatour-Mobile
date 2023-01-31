import {
    FEEDBACK_URL,
    PRIVACY_URL,
    SUPPORT_URL,
    TERMS_URL,
} from 'asset/standardValue';
import {StyleContainer} from 'components/base';
import TypeDetailSetting from 'components/common/TypeDetailSetting';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AboutUs = () => {
    const theme = Redux.getTheme();

    const onOpenPolicy = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.aboutUs.privacyPolicy',
            linkWeb: PRIVACY_URL,
        });
    };

    const onOpenTerms = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.aboutUs.termsOfUse',
            linkWeb: TERMS_URL,
        });
    };

    const onOpenDoffySuport = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.aboutUs.contactUs',
            linkWeb: SUPPORT_URL,
        });
    };

    const onOpenFeedback = () => {
        navigate(ROOT_SCREEN.webView, {
            title: 'setting.aboutUs.feedback',
            linkWeb: FEEDBACK_URL,
        });
    };

    return (
        <>
            <StyleHeader title="setting.aboutUs.headerTitle" />
            <StyleContainer customStyle={styles.container}>
                <TypeDetailSetting
                    title="setting.aboutUs.privacyPolicy"
                    onPress={onOpenPolicy}
                    icon={
                        <MaterialIcons
                            name="privacy-tip"
                            style={[
                                styles.stylesIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                />

                <TypeDetailSetting
                    title="setting.aboutUs.termsOfUse"
                    onPress={onOpenTerms}
                    icon={
                        <MaterialIcons
                            name="description"
                            style={[
                                styles.stylesIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                />

                <TypeDetailSetting
                    title="setting.aboutUs.contactUs"
                    onPress={onOpenDoffySuport}
                    icon={
                        <MaterialIcons
                            name="contact-support"
                            style={[
                                styles.stylesIcon,
                                {color: theme.borderColor},
                            ]}
                        />
                    }
                />

                <TypeDetailSetting
                    title="setting.aboutUs.feedback"
                    onPress={onOpenFeedback}
                    icon={
                        <MaterialIcons
                            name="feedback"
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
        fontSize: '23@ms',
    },
});

export default AboutUs;
