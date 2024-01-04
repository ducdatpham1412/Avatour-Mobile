import {apiRequestOTP} from 'api/authentication';
import {BORDER_RADIUS} from 'asset';
import {TYPE_OTP} from 'asset/enum';
import Images from 'asset/img/images';
import {
  StyleButton,
  StyleContainer,
  StyleIcon,
  StyleText,
} from 'components/base';
import {useLoading, useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {ImageStyle, View, ViewStyle} from 'react-native';
import {scale, verticalScale} from 'utility/scale';

const ConfirmOpenAccount = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.confirmOpenAccount]>) => {
  const theme = useTheme();
  const {loading, setLoading} = useLoading();

  const onOpenAccount = async () => {
    try {
      setLoading(true);
      await apiRequestOTP({
        username: route.params.username,
        type_otp: TYPE_OTP.requestOpenAccount,
      });
      navigate(LOGIN_ROUTE.sendOTP, {
        paramsOTP: {
          username: route.params?.username,
          type_otp: TYPE_OTP.requestOpenAccount,
        },
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyleContainer
      customStyle={$container}
      headerProps={{
        title: 'setting.securityAndLogin.lockAccount',
      }}
      backgroundColor={theme.white}>
      <StyleIcon
        source={Images.images.successful}
        size={100}
        customStyle={$iconAlert}
      />

      <View style={[$alertView, {backgroundColor: theme.background}]}>
        <StyleText i18Text="login.yourAccountIsBeingLock" mode="html" />
      </View>

      <StyleButton
        title="common.continue"
        containerStyle={$btnDelete}
        onPress={onOpenAccount}
        isLoading={loading}
      />
    </StyleContainer>
  );
};

const $container: ViewStyle = {
  alignItems: 'center',
};
const $alertView: ViewStyle = {
  paddingHorizontal: scale(12),
  paddingVertical: verticalScale(28),
  borderRadius: BORDER_RADIUS.f3,
  marginTop: verticalScale(40),
};
const $iconAlert: ImageStyle = {
  marginTop: verticalScale(32),
};
const $btnDelete: ViewStyle = {
  marginTop: verticalScale(60),
  paddingHorizontal: scale(40),
};

export default ConfirmOpenAccount;
