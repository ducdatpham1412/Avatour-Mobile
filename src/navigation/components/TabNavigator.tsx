import {setBubblePalaceAction, setNumberNewNotifications} from 'app-redux';
import {useAppSelector} from 'app-redux/store';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {safePaddingNotZero} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleIcon, StyleText, StyleTouchable} from 'components/base';
import {useTheme} from 'hook';
import {MAIN_SCREEN, PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import {ModalScanQr} from 'navigation/screen/modals';
import React, {useMemo, useRef} from 'react';
import {Animated, TextStyle, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  moderateScale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';

const iconSize = 27;

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
    const tintColor = isFocusDiscovery ? theme.p_700 : theme.gray_500;
    return (
      <StyleTouchable
        customStyle={styles.buttonView}
        onPress={() => {
          if (!isFocusDiscovery) {
            navigate(MAIN_SCREEN.discoveryRoute);
          } else {
            setBubblePalaceAction({
              action: TYPE_BUBBLE_PALACE_ACTION.scrollToTopDiscovery,
              payload: null,
            });
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
  }, [isFocusDiscovery]);

  const FavoriteButton = useMemo(() => {
    const tintColor = isFocusHeart ? theme.p_700 : theme.gray_500;
    return (
      <StyleTouchable
        customStyle={styles.buttonView}
        onPress={() => navigate(MAIN_SCREEN.favorite)}>
        <StyleIcon
          source={
            isFocusHeart ? Images.icons.tourTabBar : Images.icons.tourTabBar
          }
          size={iconSize}
          customStyle={{tintColor}}
        />
        <StyleText
          i18Text="discovery.tour"
          customStyle={[$textTitle, {color: tintColor}]}
        />
      </StyleTouchable>
    );
  }, [isFocusHeart]);

  const ScanButton = useRef(() => (
    <StyleTouchable
      customStyle={[styles.buttonView, {justifyContent: 'flex-start'}]}
      onPress={ModalScanQr.show}>
      <StyleIcon source={Images.icons.scan} size={30} />
    </StyleTouchable>
  ));

  const NotificationButton = useMemo(() => {
    const tintColor = isFocusNotification ? theme.p_700 : theme.gray_500;
    return (
      <StyleTouchable
        customStyle={styles.buttonView}
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
            <View style={styles.newNotificationBox}>
              <StyleText
                originValue={
                  numberNewNotifications > 99 ? 99 : numberNewNotifications
                }
                customStyle={styles.textNewMessages}
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
  }, [isFocusNotification]);

  const ProfileButton = useMemo(() => {
    const tintColor = isFocusProfile ? theme.p_700 : theme.gray_500;
    return (
      <StyleTouchable
        onPress={() => {
          if (isFocusProfile) {
            navigate(MAIN_SCREEN.profileRoute, {
              screen: PROFILE_ROUTE.myProfile,
            });
            setBubblePalaceAction({
              action: TYPE_BUBBLE_PALACE_ACTION.scrollToTopMyProfile,
              payload: null,
            });
          } else {
            navigate(MAIN_SCREEN.profileRoute);
          }
        }}
        customStyle={styles.buttonView}>
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
  }, [isFocusProfile]);

  return (
    <Animated.View
      style={[
        styles.tabBarDown,
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

const styles = ScaledSheet.create({
  newNotificationBox: {
    position: 'absolute',
    width: '15@ms',
    height: '15@ms',
    borderRadius: '10@ms',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.common.red,
    top: '0@ms',
    right: '0@ms',
  },
  // Tab bar down
  tabBarDown: {
    width: '100%',
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: '5@s',
    borderTopWidth: borderWidthTiny,
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTabBar: {
    width: '25@ms',
    height: '25@ms',
  },
  createBox: {
    paddingHorizontal: '8@ms',
    paddingVertical: '2@ms',
    borderRadius: '7@ms',
  },
  iconCreate: {
    fontSize: '20@ms',
    color: Theme.common.white,
  },
  textNewMessages: {
    fontSize: '10@ms',
    color: 'white',
    fontFamily: undefined,
  },
});

const $textTitle: TextStyle = {
  fontSize: moderateScale(10),
  marginTop: verticalScale(4),
};

export default TabNavigator;
