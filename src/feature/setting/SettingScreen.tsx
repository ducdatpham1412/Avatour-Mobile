import {useAppSelector} from 'app-redux/store';
import Images from 'asset/img/images';
import {StyleContainer} from 'components/base';
import {navigate} from 'navigation/NavigationService';
import StyleHeader from 'navigation/components/StyleHeader';
import {SETTING_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import {renderIconGender} from 'utility/assistant';
import AuthenticateService from 'utility/login/loginService';
import TypeMainSetting from './components/TypeMainSetting';

const SettingScreen = () => {
  const {gender} = useAppSelector(state => state.accountSlice.passport.profile);
  const logOut = async () => {
    await AuthenticateService.logOut({hadRefreshTokenBlacked: false});
  };

  return (
    <>
      <StyleHeader title="setting.title" />

      <StyleContainer customStyle={styles.container}>
        <TypeMainSetting
          icon={Images.icons.security}
          title="setting.component.typeMainSetting.security"
          onPress={() => navigate(SETTING_ROUTE.security)}
        />

        <TypeMainSetting
          icon={renderIconGender(gender)}
          title="setting.component.typeMainSetting.personalInfo"
          onPress={() => navigate(SETTING_ROUTE.personalInformation)}
        />

        <TypeMainSetting
          icon={Images.icons.extend}
          title="setting.component.typeMainSetting.extend"
          onPress={() => navigate(SETTING_ROUTE.setTheme)}
        />

        <TypeMainSetting
          icon={Images.icons.logo}
          title="setting.component.typeMainSetting.aboutFindme"
          onPress={() => navigate(SETTING_ROUTE.aboutUs)}
        />

        <TypeMainSetting
          icon={Images.icons.logout}
          title="setting.component.typeMainSetting.logOut"
          onPress={logOut}
        />
      </StyleContainer>
    </>
  );
};

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '25@s',
  },
});

export default SettingScreen;
