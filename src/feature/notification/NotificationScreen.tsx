import {TypeNotificationResponse} from 'api/interface';
import {apiReadNotification} from 'api/module';
import {TYPE_FOLLOW, TYPE_NOTIFICATION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleIcon, StyleText} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import {useSocketNotification} from 'hook/useSocketIO';
import ROOT_SCREEN, {MAIN_SCREEN} from 'navigation/config/routes';
import {navigate} from 'navigation/NavigationService';
import React, {useCallback} from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {logger} from 'utility/assistant';
import ItemNotification from './components/ItemNotification';

/** ------------------------
 * Notification Enjoy
 * -------------------------
 */
const NotificationEnjoy = () => {
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View
                style={[
                    styles.titleView,
                    {borderBottomColor: theme.holderColor},
                ]}>
                <StyleIcon
                    source={Images.icons.notification}
                    size={20}
                    customStyle={{tintColor: theme.textHightLight}}
                />
                <StyleText
                    i18Text="notification.title"
                    customStyle={[styles.textTitle, {color: theme.borderColor}]}
                />
            </View>
        </View>
    );
};

/** ------------------------
 * Notification User
 * -------------------------
 */
const NotificationAccount = () => {
    const theme = Redux.getTheme();
    const {id, name} = Redux.getPassport().profile;

    const {list, setList, onRefresh, onLoadMore, refreshing} =
        useSocketNotification();

    const onGoToDetailNotification = async (item: TypeNotificationResponse) => {
        if (item.type === TYPE_NOTIFICATION.likePost) {
            if (item?.postId) {
                navigate(ROOT_SCREEN.detailBubble, {
                    bubbleId: item.postId,
                    displayLike: true,
                });
            }
        } else if (item.type === TYPE_NOTIFICATION.follow) {
            navigate(ROOT_SCREEN.listFollows, {
                userId: id,
                name,
                type: TYPE_FOLLOW.follower,
                onGoBack: () => navigate(MAIN_SCREEN.notificationRoute),
            });
        } else if (item.type === TYPE_NOTIFICATION.comment) {
            if (item?.postId) {
                navigate(ROOT_SCREEN.detailBubble, {
                    bubbleId: item.postId,
                    displayComment: true,
                });
            }
        } else if (item.type === TYPE_NOTIFICATION.likeGroupBuying) {
            if (item?.postId) {
                navigate(ROOT_SCREEN.detailGroupBuying, {
                    itemId: item.postId,
                });
            }
        }

        if (!item.isRead) {
            try {
                await apiReadNotification(item.id);
                setList((preValue: Array<TypeNotificationResponse>) => {
                    return preValue.map(__item => {
                        if (__item.id === item.id) {
                            return {
                                ...__item,
                                hadRead: true,
                            };
                        }
                        return __item;
                    });
                });
            } catch (err) {
                logger(err);
            }
        }
    };

    const renderItem = useCallback((item: TypeNotificationResponse) => {
        return (
            <ItemNotification
                item={item}
                onGoToDetailNotification={onGoToDetailNotification}
            />
        );
    }, []);

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View
                style={[
                    styles.titleView,
                    {borderBottomColor: theme.holderColor},
                ]}>
                <StyleIcon
                    source={Images.icons.notification}
                    size={20}
                    customStyle={{tintColor: theme.textHightLight}}
                />
                <StyleText
                    i18Text="notification.title"
                    customStyle={[
                        styles.textTitle,
                        {color: theme.textHightLight},
                    ]}
                />
            </View>

            <StyleList
                data={list}
                renderItem={({item}) => renderItem(item)}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                keyExtractor={item => item.id}
                scrollEnabled
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

/**
 * BOSS HERE
 */
const NotificationScreen = () => {
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();

    if (!isModeExp && token) {
        return <NotificationAccount />;
    }
    return <NotificationEnjoy />;
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    titleView: {
        paddingVertical: '3@vs',
        paddingHorizontal: '20@s',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        flexDirection: 'row',
        alignItems: 'center',
    },
    textTitle: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    listContainer: {
        paddingBottom: '20@vs',
        paddingHorizontal: '15@s',
        paddingTop: '10@vs',
    },
});

export default NotificationScreen;
