import {TypeChatTagResponse} from 'api/interface';
import {apiGetDetailConversation} from 'api/module';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import Redux from 'hook/useRedux';
import {useSocketChatTagBubble} from 'hook/useSocketIO';
import ROOT_SCREEN, {MESS_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {memo, useCallback, useEffect} from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {isTimeBefore} from 'utility/format';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatTag from './components/ChatTag';

const RenderMessages = () => {
    const chatTagFromNotification = Redux.getChatTagFromNotification();
    const myId = Redux.getPassport().profile.id;

    const {
        listChatTags,
        seenMessage,
        onRefresh,
        refreshing,
        onLoadMore,
        setListChatTags,
    } = useSocketChatTagBubble();

    const goToChatDetailFromNotification = async () => {
        if (chatTagFromNotification) {
            try {
                Redux.setChatTagFocusing(chatTagFromNotification);
                const res = await apiGetDetailConversation(
                    chatTagFromNotification,
                );
                seenMessage(chatTagFromNotification);

                navigate(MESS_ROUTE.chatDetail, {
                    itemChatTag: res.data,
                    setListChatTags,
                });

                Redux.setChatTagFromNotification(undefined);
                setListChatTags((preValue: Array<TypeChatTagResponse>) => {
                    const check = preValue.find(
                        item => item.id === chatTagFromNotification,
                    );
                    if (check) {
                        return preValue;
                    }
                    return [res.data].concat(preValue);
                });
            } catch (err) {
                appAlert(err);
            }
        }
    };

    useEffect(() => {
        goToChatDetailFromNotification();
    }, [chatTagFromNotification]);

    const onGoToChat = async (conversation: TypeChatTagResponse) => {
        try {
            const havingUpdate = isTimeBefore(
                conversation.userData[String(myId)].modified,
                conversation.modified,
            );
            if (havingUpdate) {
                seenMessage(conversation.id);
            }
            Redux.setChatTagFocusing(conversation.id);
            navigate(MESS_ROUTE.chatDetail, {
                itemChatTag: conversation,
                setListChatTags,
            });
        } catch (err) {
            appAlert(err);
        }
    };

    /**
     * Render view
     */

    const renderChatTag = useCallback((item: TypeChatTagResponse) => {
        return <ChatTag item={item} onGoToChat={onGoToChat} />;
    }, []);

    return (
        <StyleList
            data={listChatTags}
            renderItem={({item}) => {
                return renderChatTag(item);
            }}
            contentContainerStyle={styles.contentList}
            keyExtractor={item => item.id}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onLoadMore={onLoadMore}
        />
    );
};

/**
 * Boss here
 */
const MessScreen = () => {
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();
    const borderMessRoute = Redux.getBorderMessRoute();
    const theme = Redux.getTheme();

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View
                style={[
                    styles.headerView,
                    {borderBottomColor: theme.holderColor},
                ]}>
                <StyleTouchable
                    onPress={() => navigate(ROOT_SCREEN.mainScreen)}
                    hitSlop={10}>
                    <Ionicons
                        name="chevron-back-outline"
                        style={[styles.iconBack, {color: borderMessRoute}]}
                    />
                </StyleTouchable>
                <StyleText
                    i18Text="mess.messScreen.headerTitle"
                    customStyle={[styles.textTitle, {color: borderMessRoute}]}
                />
            </View>

            {/* List chat tags */}
            {!isModeExp && token && <RenderMessages />}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    headerView: {
        paddingHorizontal: '10@s',
        paddingVertical: '3@vs',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBack: {
        fontSize: '22@ms',
    },
    textTitle: {
        fontSize: '20@ms',
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    contentList: {
        paddingBottom: '50@vs',
    },
});

export default memo(MessScreen);
