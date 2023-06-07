import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import {StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {PROFILE_ROUTE} from 'navigation/config';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale, scale} from 'utility/scale';
import {useMyRequests} from '../hooks';

const IconLeftMyProfile = () => {
  const theme = useTheme();
  const {account_type} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );
  const [{data}] = useMyRequests();

  return (
    <View style={$container}>
      {account_type === ACCOUNT.shop && (
        <StyleTouchable
          customStyle={$buttonQr}
          onPress={() => navigate(PROFILE_ROUTE.myQRCode)}>
          <AntDesign name="qrcode" style={[$iconQr, {color: theme.black}]} />
        </StyleTouchable>
      )}

      <StyleTouchable
        customStyle={$buttonRequest}
        onPress={() => navigate(PROFILE_ROUTE.listMyRequests)}>
        <AntDesign name="mail" style={[$iconQr, {color: theme.black}]} />
        <View style={$numberRequest}>
          <StyleText originValue={data?.length} customStyle={$textNumber} />
        </View>
      </StyleTouchable>
    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $buttonQr: ViewStyle = {
  marginRight: scale(12),
};
const $iconQr: TextStyle = {
  fontSize: moderateScale(20),
};
const $buttonRequest: ViewStyle = {
  height: moderateScale(27),
  width: moderateScale(22),
  justifyContent: 'center',
};
const $numberRequest: ViewStyle = {
  position: 'absolute',
  right: 0,
  top: 0,
  backgroundColor: 'red',
  width: moderateScale(13.5),
  height: moderateScale(13.5),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 50,
};
const $textNumber: TextStyle = {
  fontSize: moderateScale(10),
  color: 'white',
};

export default IconLeftMyProfile;
