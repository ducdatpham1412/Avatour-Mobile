import {
  FEEDBACK_URL,
  PRIVACY_URL,
  SUPPORT_URL,
  TERMS_URL,
} from 'asset/standardValue';
import {StyleContainer} from 'components/base';
import TypeDetailSetting from 'components/common/TypeDetailSetting';
import {useTheme} from 'hook';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, scale} from 'utility/scale';

const AboutUs = () => {
  const theme = useTheme();

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
      <StyleContainer
        customStyle={$container}
        headerProps={{
          title: 'setting.aboutUs.headerTitle',
        }}>
        <TypeDetailSetting
          title="setting.aboutUs.privacyPolicy"
          onPress={onOpenPolicy}
          icon={
            <MaterialIcons
              name="privacy-tip"
              style={[$icon, {color: theme.blue}]}
            />
          }
        />

        <TypeDetailSetting
          title="setting.aboutUs.termsOfUse"
          onPress={onOpenTerms}
          icon={
            <MaterialIcons
              name="description"
              style={[$icon, {color: theme.blue}]}
            />
          }
        />

        <TypeDetailSetting
          title="setting.aboutUs.contactUs"
          onPress={onOpenDoffySuport}
          icon={
            <MaterialIcons
              name="contact-support"
              style={[$icon, {color: theme.pink}]}
            />
          }
        />

        <TypeDetailSetting
          title="setting.aboutUs.feedback"
          onPress={onOpenFeedback}
          icon={
            <MaterialIcons
              name="feedback"
              style={[$icon, {color: theme.orange}]}
            />
          }
        />
      </StyleContainer>
    </>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: scale(40),
};
const $icon: TextStyle = {
  fontSize: moderateScale(23),
};

export default AboutUs;
