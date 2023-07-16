import {useAppSelector} from 'app-redux/store';
import {BORDER_RADIUS} from 'asset';
import {SESSION} from 'asset/enum';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {useEstimatesAndJoinings, useTheme} from 'hook';
import ROOT_SCREEN, {
  MAIN_SCREEN,
  PROFILE_ROUTE,
} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef} from 'react';
import {
  Animated,
  ImageStyle,
  Platform,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {getSessionOfDay} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import {moderateScale, scale, verticalScale} from 'utility/scale';

interface IconEstimateProps {
  estimates: TypeJoinEstimate[];
}

const IconHavingEstimate = ({estimates}: IconEstimateProps) => {
  const theme = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = () => {
      Animated.timing(scale, {
        toValue: 1.3,
        useNativeDriver: true,
        duration: 300,
      }).start(() => {
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 7,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -7,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 7,
            duration: 80,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 80,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.timing(scale, {
            toValue: 1,
            useNativeDriver: true,
            duration: 300,
          }).start(() => {
            setTimeout(() => {
              loopAnimation();
            }, 2000);
          });
        });
      });
    };

    loopAnimation();
  }, []);

  return (
    <StyleTouchable
      customStyle={[$newEstimateBox, {backgroundColor: theme.white}]}
      onPress={() =>
        navigate(MAIN_SCREEN.profileRoute, {
          screen: PROFILE_ROUTE.myProfile,
          params: {
            initIndex: 'order',
          },
        })
      }>
      <Animated.View
        style={[$newEstimateBox, {transform: [{scale}, {translateX}]}]}>
        <StyleIcon
          source={Images.icons.bag}
          size={20}
          customStyle={{tintColor: theme.p_700}}
        />
        <View style={$newMessageBox}>
          <StyleText
            originValue={estimates.length}
            customStyle={[$textNewMessages, {color: theme.white}]}
          />
        </View>
      </Animated.View>
    </StyleTouchable>
  );
};

const HeaderDiscovery = () => {
  const theme = useTheme();
  const {
    accountSlice: {
      passport: {profile},
    },
    logicSlice: {numberNewMessages},
  } = useAppSelector(state => state);
  const {
    data: {estimates},
  } = useEstimatesAndJoinings();

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
        {!!estimates?.length ? (
          <IconHavingEstimate estimates={estimates} />
        ) : (
          <StyleIcon
            source={{uri: profile.avatar}}
            size={45}
            customStyle={$avatar}
          />
        )}
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
        onPress={() => navigate(ROOT_SCREEN.messScreen)}
        customStyle={[$buttonMessage, {backgroundColor: theme.white}]}>
        <StyleIcon
          source={Images.icons.chat}
          customStyle={{tintColor: theme.gray_500}}
          size={23}
        />
        {!!numberNewMessages && (
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
  paddingBottom: verticalScale(8),
};
const $leftView: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
};
const $avatar: ImageStyle = {
  borderRadius: BORDER_RADIUS.f3,
  width: moderateScale(48),
  height: moderateScale(48),
};
const $newEstimateBox: ViewStyle = {
  borderRadius: BORDER_RADIUS.f3,
  width: moderateScale(45),
  height: moderateScale(45),
  alignItems: 'center',
  justifyContent: 'center',
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
  borderRadius: BORDER_RADIUS.f3,
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
