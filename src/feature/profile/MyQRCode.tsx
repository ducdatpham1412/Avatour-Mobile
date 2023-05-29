import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT_MEDIUM} from 'asset';
import Images from 'asset/img/images';
import Theme from 'asset/theme/Theme';
import {BoxInformation} from 'components';
import {StyleContainer, StyleIcon, StyleText} from 'components/base';
import {useTheme} from 'hook';
import React from 'react';
import {ImageStyle, TextStyle, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale, verticalScale} from 'utility/scale';
import QRCode from 'react-native-qrcode-svg';

const MyQRCode = () => {
  const theme = useTheme();
  const {profile} = useAppSelector(state => state.accountSlice.passport);

  return (
    <LinearGradient
      style={$container}
      colors={['#DFA207', '#E7C606', '#F3E992']}>
      <StyleContainer
        headerProps={{
          title: 'profile.qrConfirm',
          containerStyle: $header,
          titleStyle: {color: theme.white},
          iconStyle: {color: theme.white},
        }}
        backgroundColor="transparent"
        customStyle={$content}>
        <View style={$qrView}>
          <StyleIcon
            source={Images.icons.fingerScan}
            size={244}
            customStyle={$iconFinger}
          />
          <StyleText
            originValue="SCAN ME"
            customStyle={[$textScan, {color: theme.white}]}
          />
          <View style={$qrBox}>
            <QRCode
              value={JSON.stringify({userId: profile.id})}
              size={scale(150)}
            />
          </View>
          <View style={$logo}>
            <View style={$logoBox}>
              <StyleIcon source={Images.icons.logo} size={17} />
            </View>
            <StyleText originValue="Avatour" customStyle={$textLogo} />
          </View>
        </View>

        <BoxInformation
          listInformation={[
            <StyleText
              i18Text="profile.scanWhenGoToShop"
              customStyle={[$textScanWhenGoShop, {color: theme.red}]}
            />,
            {
              title: 'profile.shopName',
              content: profile.name,
            },
            {
              title: 'profile.location',
              content: profile.location,
            },
          ]}
          containerStyle={$informationView}
        />
      </StyleContainer>
    </LinearGradient>
  );
};

const $container: ViewStyle = {
  flex: 1,
};
const $content: ViewStyle = {
  alignItems: 'center',
};
const $header: ViewStyle = {
  borderBottomWidth: 0,
};
const $qrView: ViewStyle = {
  width: scale(240),
  height: scale(240),
  marginTop: verticalScale(70),
  alignItems: 'center',
  justifyContent: 'space-between',
};
const $iconFinger: ImageStyle = {
  position: 'absolute',
};
const $textScan: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: FONT_WEIGHT_MEDIUM,
};
const $qrBox: ViewStyle = {
  width: scale(170),
  height: scale(170),
  backgroundColor: Theme.newTheme.white,
  borderRadius: BORDER_RADIUS.f3,
  alignItems: 'center',
  justifyContent: 'center',
};
const $logo: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};
const $logoBox: ViewStyle = {
  width: moderateScale(20),
  height: moderateScale(20),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  borderRadius: moderateScale(5),
};
const $textLogo: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontWeight: 'bold',
  marginLeft: scale(6),
  color: 'white',
};
const $informationView: ViewStyle = {
  marginTop: verticalScale(55),
};
const $textScanWhenGoShop: TextStyle = {
  fontWeight: FONT_WEIGHT_MEDIUM,
  textAlign: 'center',
};

export default MyQRCode;
