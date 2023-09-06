import {useAppSelector} from 'app-redux/store';
import Images from 'asset/img/images';
import {StyleContainer} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import ROOT_SCREEN, {SETTING_ROUTE} from 'navigation/config/routes';
import React, {useState} from 'react';
import {ActivityIndicator, ViewStyle} from 'react-native';
import {renderIconGender} from 'utility/assistant';
import {logOut} from 'utility/authentication';
import {scale} from 'utility/scale';
import TypeMainSetting from './components/TypeMainSetting';
import {useSWRConfig} from 'swr';
import {I18Normalize} from 'utility/I18Next';

const SettingScreen = () => {
  const theme = useTheme();
  const {mutate} = useSWRConfig();
  const {gender} = useAppSelector(state => state.accountSlice.passport.profile);
  const [loadingLogOut, setLoadingLogOut] = useState(false);

  const onLogOut = async () => {
    if (loadingLogOut) {
      return;
    }
    setLoadingLogOut(true);
    await logOut();
    await mutate(() => true, undefined, {revalidate: false});
    setLoadingLogOut(false);
  };

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
        icon={
          loadingLogOut ? (
            <ActivityIndicator color={theme.p_600} />
          ) : (
            Images.icons.logout
          )
        }
        title="setting.logOut"
        onPress={onLogOut}
      />

      {__DEV__ && (
        <TypeMainSetting
          icon={Images.icons.apple}
          title={'(DEV) Svg Icons' as I18Normalize}
          onPress={() => navigate(ROOT_SCREEN.svgIcons)}
        />
      )}
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: scale(25),
};

export default SettingScreen;
