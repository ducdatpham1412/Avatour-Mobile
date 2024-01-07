import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleContainer, StyleIcon} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import React, {useState} from 'react';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {scale} from 'utility/scale';
import TypeDetailSetting from '../../../components/common/TypeDetailSetting';
import LanguageSetting from './LanguageSetting';

const ExtendSetting = () => {
  const theme = useTheme();
  const {account_type} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  const [isSettingTheme, setIsSettingTheme] = useState(false);
  const [isSettingLanguage, setIsSettingLanguage] = useState(false);

  const isShopAccount = account_type === ACCOUNT.shop;

  const openCloseSettingTheme = () => setIsSettingTheme(!isSettingTheme);

  const openCloseSettingLanguage = () =>
    setIsSettingLanguage(!isSettingLanguage);

  return (
    <StyleContainer
      customStyle={styles.container}
      headerProps={{
        title: 'setting.extendSetting.headerTitle',
      }}>
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
      <LanguageSetting isOpening={isSettingLanguage} />

      {!isShopAccount && (
        <TypeDetailSetting
          title="profile.upgradeToShop"
          onPress={() => navigate(ROOT_SCREEN.upgradeAccount)}
          icon={
            <StyleIcon
              source={Images.icons.shop}
              size={17}
              customStyle={{tintColor: theme.blue}}
            />
          }
        />
      )}

      {isShopAccount && (
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

      <TypeDetailSetting
        title="profile.myRequests"
        onPress={() => navigate(PROFILE_ROUTE.listMyRequests)}
        icon={
          <AntDesign
            name="mail"
            style={[styles.stylesIcon, {color: theme.red}]}
          />
        }
      />
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
