import {setNumberNewNotifications} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {FONT_SIZE} from 'asset';
import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import ROOT_SCREEN, {
  MAIN_SCREEN,
  PROFILE_ROUTE,
} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {ModalScanQr} from 'navigation/screen/modals';
import React, {useMemo, useRef} from 'react';
import {Animated, TextStyle, Vibration, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'react-native-size-matters';
import {borderWidthTiny, logger} from 'utility/assistant';
import {moderateScale, scale} from 'utility/scale';

const iconSize = 27;

const showModalQr = async () => {
  try {
    const res = await ModalScanQr.show();
    if (res) {
      const dataQR: QrData = JSON.parse(res.data);
      ModalScanQr.hide();
      Vibration.vibrate();
      navigate(ROOT_SCREEN.scanResult, {
        shop_id: dataQR.user_id,
        mode: 'join-result',
      });
    }
  } catch (err) {
    logger(err);
  }
};

const TabNavigator = (props: any) => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  const {numberNewNotifications} = useAppSelector(state => state.logicSlice);

  const tabIndexFocus = props.state.index;

  const isFocusDiscovery = tabIndexFocus === 0;
  const isFocusHeart = tabIndexFocus === 1;
  const isFocusNotification = tabIndexFocus === 2;
  const isFocusProfile = tabIndexFocus === 3;

  /**
   * Render view
   */
  const DiscoveryButton = useMemo(() => {
    const tintColor = isFocusDiscovery ? theme.p_600 : theme.gray_500;
    return (
      <StyleTouchable
        customStyle={$button}
        onPress={() => {
          if (!isFocusDiscovery) {
            navigate(MAIN_SCREEN.discoveryRoute);
          }
        }}>
        <StyleIcon
          source={isFocusDiscovery ? Images.icons.homeFocus : Images.icons.home}
          size={iconSize}
          customStyle={{tintColor}}
        />
        <StyleText
          i18Text="discovery.home"
          customStyle={[$textTitle, {color: tintColor}]}
        />
      </StyleTouchable>
    );
  }, [isFocusDiscovery, theme]);

  const FavoriteButton = useMemo(() => {
    const tintColor = isFocusHeart ? theme.p_600 : theme.gray_500;
    return (
      <StyleTouchable
        customStyle={$button}
        onPress={() => navigate(MAIN_SCREEN.orderRoute)}>
        <StyleIcon
          source={
            isFocusHeart
              ? Images.icons.tourTabBarFocus
              : Images.icons.tourTabBar
          }
          size={iconSize}
          customStyle={{tintColor}}
        />
        <StyleText
          i18Text="order.order"
          customStyle={[$textTitle, {color: tintColor}]}
        />
      </StyleTouchable>
    );
  }, [isFocusHeart, theme]);

  const ScanButton = useRef(() => (
    <StyleTouchable
      customStyle={[$button, {justifyContent: 'flex-start'}]}
      onPress={showModalQr}>
      <StyleIcon source={Images.icons.scan} size={30} />
    </StyleTouchable>
  ));

  const NotificationButton = useMemo(() => {
    const tintColor = isFocusNotification ? theme.p_600 : theme.gray_500;
    return (
      <StyleTouchable
        customStyle={$button}
        onPress={() => {
          setNumberNewNotifications(0);
          navigate(MAIN_SCREEN.notificationRoute);
        }}>
        <View>
          <StyleIcon
            source={
              isFocusNotification
                ? Images.icons.notificationFocus
                : Images.icons.notification
            }
            size={25}
            customStyle={{tintColor}}
          />
          {numberNewNotifications > 0 && (
            <View style={$newNotificationBox}>
              <StyleText
                originValue={
                  numberNewNotifications > 99 ? 99 : numberNewNotifications
                }
                customStyle={$textNewMessages}
              />
            </View>
          )}
        </View>
        <StyleText
          i18Text="notification.title"
          customStyle={[$textTitle, {color: tintColor}]}
        />
      </StyleTouchable>
    );
  }, [isFocusNotification, theme, numberNewNotifications]);

  const ProfileButton = useMemo(() => {
    const tintColor = isFocusProfile ? theme.p_600 : theme.gray_500;
    return (
      <StyleTouchable
        onPress={() => {
          if (isFocusProfile) {
            navigate(MAIN_SCREEN.profileRoute, {
              screen: PROFILE_ROUTE.myProfile,
            });
          } else {
            navigate(MAIN_SCREEN.profileRoute);
          }
        }}
        customStyle={$button}>
        <StyleIcon
          source={
            isFocusProfile ? Images.icons.profileFocus : Images.icons.profile
          }
          size={iconSize}
          customStyle={{tintColor}}
        />
        <StyleText
          i18Text="profile.title"
          customStyle={[$textTitle, {color: tintColor}]}
        />
      </StyleTouchable>
    );
  }, [isFocusProfile, theme]);

  return (
    <Animated.View
      style={[
        $tabBarDown,
        {
          paddingBottom: bottom || safePaddingNotZero,
          paddingTop: verticalScale(8),
          backgroundColor: theme.white,
          borderTopColor: theme.gray_200,
        },
      ]}>
      {DiscoveryButton}
      {FavoriteButton}
      {ScanButton.current()}
      {NotificationButton}
      {ProfileButton}
    </Animated.View>
  );
};

const $newNotificationBox: ViewStyle = {
  position: 'absolute',
  width: moderateScale(15),
  height: moderateScale(15),
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Theme.common.red,
  top: 0,
  right: 0,
};
const $textNewMessages: TextStyle = {
  fontSize: moderateScale(10),
  color: 'white',
  fontFamily: undefined,
};
const $tabBarDown: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  overflow: 'hidden',
  paddingHorizontal: scale(4),
  borderTopWidth: borderWidthTiny,
};
const $button: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
};
const $textTitle: TextStyle = {
  fontSize: FONT_SIZE.f5,
  marginTop: verticalScale(4),
};

export default TabNavigator;
