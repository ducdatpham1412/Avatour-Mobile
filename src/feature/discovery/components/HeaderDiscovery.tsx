import {useAppSelector} from 'app-redux/store';
import {SESSION} from 'asset/enum';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import ROOT_SCREEN from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React from 'react';
import {Platform, TextStyle, View, ViewStyle} from 'react-native';
import {getSessionOfDay} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, scale, verticalScale} from 'utility/scale';

const HeaderDiscovery = () => {
  const theme = useTheme();
  const {
    accountSlice: {
      passport: {profile},
    },
    logicSlice: {numberNewMessages},
  } = useAppSelector(state => state);

  const session = getSessionOfDay();
  let textSession: I18Normalize = 'discovery.goodMorning';
  if (session === SESSION.afternoon) {
    textSession = 'discovery.goodAfternoon';
  } else if (session === SESSION.evening) {
    textSession = 'discovery.goodEvening';
  }

  return (
    <View style={$container}>
      <View style={$leftView}>
        <StyleIcon
          source={{uri: profile.avatar}}
          size={48}
          customStyle={{tintColor: theme.white}}
        />
        <View style={$sessionBox}>
          <StyleText
            i18Text={textSession}
            customStyle={$textHello}
            numberOfLines={1}
          />
          <StyleText
            originValue={profile?.name?.toUpperCase()}
            customStyle={$textHello}
            numberOfLines={1}
          />
        </View>
      </View>

      <StyleTouchable
        onPress={() => navigate(ROOT_SCREEN.chatRoute)}
        customStyle={[$buttonMessage, {backgroundColor: theme.white}]}>
        <StyleIcon
          source={Images.icons.chat}
          customStyle={{tintColor: theme.gray_500}}
          size={23}
        />
        {!numberNewMessages && (
          <View style={$newMessageBox}>
            <StyleText
              originValue={numberNewMessages}
              customStyle={[$textNewMessages, {color: theme.white}]}
            />
          </View>
        )}
      </StyleTouchable>
    </View>
  );
};

const $container: ViewStyle = {
  width: scale(307),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  alignSelf: 'center',
  marginTop: verticalScale(14),
};
const $leftView: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};
const $sessionBox: ViewStyle = {
  marginLeft: scale(14),
};
const $textHello: TextStyle = {
  fontSize: FONT_SIZE.f1,
  fontWeight: 'bold',
};
const $buttonMessage: ViewStyle = {
  width: moderateScale(45),
  height: moderateScale(45),
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: moderateScale(12),
};
const $newMessageBox: ViewStyle = {
  position: 'absolute',
  width: moderateScale(16),
  height: moderateScale(15),
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Theme.common.red,
  top: Platform.select({
    android: moderateScale(3),
    ios: moderateScale(7),
  }),
  right: moderateScale(4),
};
const $textNewMessages: TextStyle = {
  fontSize: FONT_SIZE.f3,
  fontFamily: undefined,
  marginTop: -moderateScale(1),
  marginRight: -moderateScale(1),
};

export default HeaderDiscovery;
