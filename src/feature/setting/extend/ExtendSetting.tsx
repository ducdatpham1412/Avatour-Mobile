import {StyleContainer} from 'components/base';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TypeDetailSetting from '../../../components/common/TypeDetailSetting';
import LanguageSetting from './LanguageSetting';
import ThemeSetting from './ThemeSetting';
import {scale} from 'utility/scale';
import {useTheme} from 'hook';
import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';

const ExtendSetting = () => {
  const theme = useTheme();
  const {account_type} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const [isSettingTheme, setIsSettingTheme] = useState(false);
  const openCloseSettingTheme = () => setIsSettingTheme(!isSettingTheme);

  const [isSettingLanguage, setIsSettingLanguage] = useState(false);
  const openCloseSettingLanguage = () =>
    setIsSettingLanguage(!isSettingLanguage);

  return (
    <StyleContainer
      customStyle={styles.container}
      headerProps={{
        title: 'setting.extendSetting.headerTitle',
      }}
      backgroundColor={theme.white}>
      {/* <TypeDetailSetting
        title="setting.extendSetting.theme"
        onPress={openCloseSettingTheme}
        icon={
          <Ionicons
            name="color-palette-outline"
            style={[styles.stylesIcon, {color: theme.orange}]}
          />
        }
      />
      {isSettingTheme && <ThemeSetting />} */}

      <TypeDetailSetting
        title="setting.extendSetting.language"
        onPress={openCloseSettingLanguage}
        icon={
          <FontAwesome
            name="language"
            style={[styles.stylesIcon, {color: theme.pink}]}
          />
        }
      />
      {isSettingLanguage && <LanguageSetting />}

      {account_type === ACCOUNT.shop && (
        <TypeDetailSetting
          title="profile.updateBankAccount"
          onPress={() => navigate(ROOT_SCREEN.updateBankAccount)}
          icon={
            <FontAwesome
              name="credit-card"
              style={[styles.stylesIcon, {color: theme.blue}]}
            />
          }
        />
      )}
    </StyleContainer>
  );
};

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(40),
  },
  stylesIcon: {
    fontSize: '20@ms',
  },
});

export default ExtendSetting;
