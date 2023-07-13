import {useAppSelector} from 'app-redux/store';
import Images from 'asset/img/images';
import {StyleContainer} from 'components/base';
import {navigate} from 'navigation/NavigationService';
import {SETTING_ROUTE} from 'navigation/config/routes';
import React from 'react';
import {ViewStyle} from 'react-native';
import {renderIconGender} from 'utility/assistant';
import AuthenticateService from 'utility/login/loginService';
import {scale} from 'utility/scale';
import TypeMainSetting from './components/TypeMainSetting';

const SettingScreen = () => {
  const {gender} = useAppSelector(state => state.accountSlice.passport.profile);

  return (
    <StyleContainer
      customStyle={$container}
      headerProps={{
        title: 'setting.title',
      }}>
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
        onPress={() => navigate(SETTING_ROUTE.extendSetting)}
      />

      <TypeMainSetting
        icon={Images.icons.logo}
        title="setting.component.typeMainSetting.aboutFindme"
        onPress={() => navigate(SETTING_ROUTE.aboutUs)}
      />

      <TypeMainSetting
        icon={Images.icons.logout}
        title="setting.logOut"
        onPress={() =>
          AuthenticateService.logOut({hadRefreshTokenBlacked: false})
        }
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: scale(25),
};

export default SettingScreen;
