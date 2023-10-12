import {apiRequestOTP} from 'api/authentication';
import {SIGN_UP_TYPE, TYPE_OTP} from 'asset/enum';
import Images from 'asset/img/images';
import {StyleContainer, StyleText} from 'components/base';
import {useTheme} from 'hook';
import Redux from 'hook/useRedux';
import {navigate} from 'navigation/NavigationService';
import {AppParamsList} from 'navigation/config';
import {LOGIN_ROUTE} from 'navigation/config/routes';
import {ModalAlert} from 'navigation/screen/modals';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, verticalScale} from 'utility/scale';
import IconType from '../components/IconType';

const ForgetPasswordSend = ({
  route,
}: RouteParams<AppParamsList[LOGIN_ROUTE.forgetPasswordSend]>) => {
  const theme = useTheme();
  const {username} = route.params;

  const onRequestOTP = async (targetInfo: number) => {
    try {
      Redux.setIsLoading(true);
      const paramsOTP: TypeRequestOTPRequest = {
        username,
        type_otp: TYPE_OTP.resetPassword,
      };
      const res = await apiRequestOTP(paramsOTP);

      let name = '';
      if (targetInfo === SIGN_UP_TYPE.email) {
        name = res.data.email;
      } else if (targetInfo === SIGN_UP_TYPE.phone) {
        name = res.data.phone;
      }
      navigate(LOGIN_ROUTE.sendOTP, {
        paramsOTP,
      });
    } catch (err) {
      ModalAlert.error({
        content: err,
      });
    } finally {
      Redux.setIsLoading(false);
    }
  };

  return (
    <StyleContainer>
      <View style={styles.contentView}>
        <StyleText
          i18Text="login.receiveThrow"
          customStyle={[styles.textNotification, {color: theme.black}]}
        />

        <View style={styles.iconsBox}>
          <IconType
            source={Images.icons.email}
            title={'Email' as I18Normalize}
            onPress={() => onRequestOTP(SIGN_UP_TYPE.email)}
          />

          <IconType
            source={Images.icons.phone}
            title="login.phone"
            onPress={() => onRequestOTP(SIGN_UP_TYPE.phone)}
          />
        </View>
      </View>
    </StyleContainer>
  );
};

const styles = ScaledSheet.create({
  inputBox: {
    flex: 3,
    alignItems: 'center',
  },
  contentView: {
    flex: 2.4,
    alignItems: 'center',
  },
  textNotification: {
    fontSize: moderateScale(20),
    marginTop: verticalScale(20),
  },
  iconsBox: {
    width: '90%',
    flexDirection: 'row',
    marginTop: verticalScale(60),
    justifyContent: 'space-around',
  },
});

export default ForgetPasswordSend;
