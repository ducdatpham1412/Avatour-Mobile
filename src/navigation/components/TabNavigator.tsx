import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {MAIN_SCREEN, PROFILE_ROUTE} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    moderateScale,
    ScaledSheet,
    verticalScale,
} from 'react-native-size-matters';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const tabBarHeight = moderateScale(50);
const addMoreHeight = moderateScale(3);
const checkBottom = Metrics.safeBottomPadding - verticalScale(10);
const indicatorHeight = moderateScale(45);
const safeBottomHeight = checkBottom <= 0 ? 0 : checkBottom;
export const tabBarViewHeight = tabBarHeight + safeBottomHeight + addMoreHeight;

const TabNavigator = (props: any) => {
    const theme = Redux.getTheme();
    const numberNewNotifications = Redux.getNumberNewNotifications();

    // for indicator
    const tabIndexFocus = props.state.index;
    const [indicatorWidth, setIndicatorWidth] = useState(0);
    const indicatorTranslateX = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(indicatorTranslateX, {
            toValue: indicatorWidth * tabIndexFocus,
            useNativeDriver: true,
        }).start();
    }, [tabIndexFocus]);

    /**
     * Render view
     */
    const DiscoveryButton = () => {
        const isFocus = tabIndexFocus === 0;
        const tintColor = isFocus ? Theme.common.white : theme.tabBarIconColor;
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => {
                    if (!isFocus) {
                        navigate(MAIN_SCREEN.discoveryRoute);
                    } else {
                        Redux.setBubblePalaceAction({
                            action: TYPE_BUBBLE_PALACE_ACTION.scrollToTopDiscovery,
                            payload: null,
                        });
                    }
                }}
                onLayout={e => {
                    if (!indicatorWidth) {
                        setIndicatorWidth(e.nativeEvent.layout.width);
                    }
                }}>
                <StyleImage
                    source={Images.icons.home}
                    customStyle={[styles.iconTabBar, {tintColor}]}
                />
                <StyleText
                    i18Text="discovery.home"
                    customStyle={[styles.textTitle, {color: tintColor}]}
                />
            </StyleTouchable>
        );
    };

    const MessageButton = () => {
        const isFocus = tabIndexFocus === 1;
        const tintColor = isFocus ? Theme.common.white : theme.tabBarIconColor;
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => navigate(MAIN_SCREEN.favorite)}>
                <FontAwesome
                    name="heart-o"
                    style={[styles.profile, {color: tintColor}]}
                />
                <StyleText
                    i18Text="profile.favorite"
                    customStyle={[styles.textTitle, {color: tintColor}]}
                />
            </StyleTouchable>
        );
    };

    const ReviewCommunityButton = () => {
        const isFocus = tabIndexFocus === 2;
        const tintColor = isFocus ? Theme.common.white : theme.tabBarIconColor;
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => navigate(MAIN_SCREEN.reputation)}>
                <StyleImage
                    source={Images.icons.reputation}
                    customStyle={[styles.iconTabBar, {tintColor}]}
                />
                <StyleText
                    i18Text="reputation.community"
                    customStyle={[styles.textTitle, {color: tintColor}]}
                />
            </StyleTouchable>
        );
    };

    const ProfileButton = () => {
        const isFocus = tabIndexFocus === 4;
        const tintColor = isFocus ? Theme.common.white : theme.tabBarIconColor;
        return (
            <StyleTouchable
                onPress={() => {
                    if (isFocus) {
                        navigate(MAIN_SCREEN.profileRoute, {
                            screen: PROFILE_ROUTE.myProfile,
                        });
                        Redux.setBubblePalaceAction({
                            action: TYPE_BUBBLE_PALACE_ACTION.scrollToTopMyProfile,
                            payload: null,
                        });
                    } else {
                        navigate(MAIN_SCREEN.profileRoute);
                    }
                }}
                customStyle={styles.buttonView}>
                <FontAwesome
                    name="user-o"
                    style={[styles.profile, {color: tintColor}]}
                />
                <StyleText
                    i18Text="profile.title"
                    customStyle={[styles.textTitle, {color: tintColor}]}
                />
            </StyleTouchable>
        );
    };

    const NotificationButton = () => {
        const tintColor =
            tabIndexFocus === 3 ? Theme.common.white : theme.tabBarIconColor;
        return (
            <StyleTouchable
                customStyle={styles.buttonView}
                onPress={() => {
                    Redux.setNumberNewNotifications(0);
                    navigate(MAIN_SCREEN.notificationRoute);
                }}>
                <View>
                    <StyleImage
                        source={Images.icons.notification}
                        customStyle={[styles.iconTabBar, {tintColor}]}
                    />
                    {numberNewNotifications > 0 && (
                        <View style={styles.newNotificationBox}>
                            <StyleText
                                originValue={
                                    numberNewNotifications > 99
                                        ? 99
                                        : numberNewNotifications
                                }
                                customStyle={styles.textNewMessages}
                            />
                        </View>
                    )}
                </View>
                <StyleText
                    i18Text="notification.title"
                    customStyle={[styles.textTitle, {color: tintColor}]}
                />
            </StyleTouchable>
        );
    };

    const TabBarIndicator = () => {
        return (
            <Animated.View
                style={[
                    styles.indicatorView,
                    {
                        width: indicatorWidth,
                        height: indicatorHeight,
                        transform: [
                            {
                                translateX: indicatorTranslateX,
                            },
                            {
                                scale,
                            },
                        ],
                    },
                ]}>
                <LinearGradient
                    colors={[
                        Theme.common.gradientTabBar1,
                        Theme.common.gradientTabBar2,
                    ]}
                    style={styles.gradientBox}
                />
            </Animated.View>
        );
    };

    return (
        <>
            <View
                style={[
                    styles.addMoreView,
                    {
                        backgroundColor: theme.backgroundColor,
                        borderTopColor: theme.holderColor,
                    },
                ]}>
                {/* <AnimatedLinear
                    colors={[
                        Theme.common.gradientTabBar1,
                        Theme.common.gradientTabBar2,
                    ]}
                    style={[
                        styles.addMoreGradient,
                        {
                            width: addMoreWidth,
                        },
                    ]}
                /> */}
            </View>
            <Animated.View
                style={[
                    styles.tabBarDown,
                    {
                        height: tabBarHeight,
                    },
                ]}>
                {TabBarIndicator()}
                {DiscoveryButton()}
                {MessageButton()}
                {ReviewCommunityButton()}
                {NotificationButton()}
                {ProfileButton()}
            </Animated.View>
            <View
                style={[
                    styles.safeBottom,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
        </>
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
        top: '-3@ms',
        right: '-5@ms',
    },
    profile: {
        fontSize: '22@ms',
    },
    addMoreView: {
        width: '100%',
        height: addMoreHeight,
        alignItems: 'center',
        borderTopWidth: '0.25@ms',
    },
    addMoreGradient: {
        height: '100%',
    },
    // Tab bar down
    tabBarDown: {
        width: '100%',
        flexDirection: 'row',
        overflow: 'hidden',
        paddingHorizontal: '5@s',
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
        fontSize: '8@ms',
        color: 'white',
    },
    // tabBar indicator
    indicatorView: {
        position: 'absolute',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        left: '5@s',
    },
    gradientBox: {
        width: '75%',
        height: '90%',
        borderRadius: '20@ms',
    },
    safeBottom: {
        width: '100%',
        height: safeBottomHeight,
    },
    textTitle: {
        fontSize: '7@ms',
    },
});

export default TabNavigator;
