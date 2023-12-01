import {useAppSelector} from 'app-redux/store';
import {ACCOUNT} from 'asset/enum';
import {StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {navigate} from 'navigation/NavigationService';
import {PROFILE_ROUTE} from 'navigation/config';
import React from 'react';
import {TextStyle, View, ViewStyle} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {moderateScale, scale} from 'utility/scale';

const IconLeftMyProfile = () => {
  const theme = useTheme();
  const {account_type} = useAppSelector(
    state => state.accountSlice.passport.profile,
  );

  return (
    <View style={$container}>
      {account_type === ACCOUNT.shop && (
        <StyleTouchable
          customStyle={$buttonQr}
          onPress={() => navigate(PROFILE_ROUTE.myQRCode)}>
          <AntDesign name="qrcode" style={[$iconQr, {color: theme.black}]} />
        </StyleTouchable>
      )}

      <View style={$buttonRequest}>
        <StyleTouchable onPress={() => navigate(PROFILE_ROUTE.listMyRequests)}>
          <AntDesign name="mail" style={[$iconQr, {color: theme.black}]} />
        </StyleTouchable>
        {/* {!!data.length && <TagRed value={data.length} />} */}
      </View>
    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $buttonQr: ViewStyle = {
  height: moderateScale(27),
  width: moderateScale(22),
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: scale(10),
};
const $iconQr: TextStyle = {
  fontSize: moderateScale(20),
};
const $buttonRequest: ViewStyle = {
  height: moderateScale(27),
  width: moderateScale(22),
  justifyContent: 'center',
  alignItems: 'center',
};

export default IconLeftMyProfile;
