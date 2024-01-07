import {StyleContainer} from 'components/base';
import TypeDetailSetting from 'components/common/TypeDetailSetting';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {SETTING_ROUTE} from 'navigation/config/routes';
import React, {useState} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import {moderateScale, scale} from 'utility/scale';
import ChangingPassword from './ChangingPassword';
import UserBlocked from './UserBlocked';

const SecurityAndLogin = () => {
  const theme = useTheme();

  const [firstLoadPassword, setFirstLoadPassword] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const openCloseChangingPassword = () => {
    setFirstLoadPassword(true);
    setOpenChangePassword(!openChangePassword);
  };

  const [firstLoadBlocked, setFirstLoadBlocked] = useState(false);
  const [isOpeningBlocked, setIsOpeningBlocked] = useState(false);
  const openCloseBlockUser = () => {
    setFirstLoadBlocked(true);
    setIsOpeningBlocked(!isOpeningBlocked);
  };

  return (
    <StyleContainer
      customStyle={$container}
      headerProps={{
        title: 'setting.securityAndLogin.headerTitle',
      }}>
      {/* Change password */}
      <TypeDetailSetting
        title="setting.securityAndLogin.changePass"
        onPress={openCloseChangingPassword}
        icon={<Foundation name="key" style={[$icon, {color: theme.black}]} />}
      />
      {(firstLoadPassword || openChangePassword) && (
        <ChangingPassword
          isOpening={openChangePassword}
          onChangeOpening={value => setOpenChangePassword(value)}
        />
      )}

      {/* User blocked */}
      <TypeDetailSetting
        title="setting.securityAndLogin.userBlocked"
        onPress={openCloseBlockUser}
        icon={<Entypo name="block" style={[$icon, {color: theme.black}]} />}
      />
      {(firstLoadBlocked || isOpeningBlocked) && (
        <UserBlocked isOpening={isOpeningBlocked} />
      )}

      {/* Lock my account */}
      <TypeDetailSetting
        title="setting.securityAndLogin.lockAccount"
        onPress={() => navigate(SETTING_ROUTE.confirmLockAccount)}
        icon={<Feather name="lock" style={[$icon, {color: theme.black}]} />}
      />

      {/* Delete my account */}
      <TypeDetailSetting
        title="setting.securityAndLogin.deleteAccount"
        onPress={() => navigate(SETTING_ROUTE.confirmDeleteAccount)}
        icon={<Feather name="delete" style={[$icon, {color: theme.black}]} />}
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  paddingHorizontal: scale(32),
};
const $icon: TextStyle = {
  fontSize: moderateScale(20),
};

export default SecurityAndLogin;
