import {TypeChatMessageResponse} from 'api/interface';
import {MESSAGE_TYPE, RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {DELAY_LONG_PRESS, FONT_SIZE} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React, {memo, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {Animated, Keyboard, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {seeDetailImage} from 'utility/assistant';
import {formatDateMessage} from 'utility/format';
import {checkIsSingleEmoji} from 'utility/validate';
import DatetimeMessage from './DatetimeMessage';
import MessageImage from './MessageImage';

interface Props {
    itemMessage: TypeChatMessageResponse;
    isSameMessageAfter: boolean;
    displayPartnerAvatar: boolean;
    displaySeenAvatar: boolean;
    chatColor: Array<string>;
    partnerAvatar: string;
    onDeleteMessage(idMessage: string): Promise<void>;
    // listMessagesLength: number;
}

const ItemMessage = (props: Props) => {
    const {
        itemMessage,
        isSameMessageAfter,
        displayPartnerAvatar,
        displaySeenAvatar,
        onDeleteMessage,
        chatColor,
        partnerAvatar,
    } = props;
    const theme = Redux.getTheme();
    const x = useRef<any>(null);

    const isMyMessage = itemMessage.relationship === RELATIONSHIP.self;
    const displayAvatar = isMyMessage
        ? displaySeenAvatar
        : displayPartnerAvatar;

    const isText = itemMessage.type === MESSAGE_TYPE.text;
    const isEmoji = isText && checkIsSingleEmoji(String(itemMessage.content));

    const isMessageText = isText && !isEmoji;
    const isMessageEmoji = isText && isEmoji;
    const isMessageImage =
        itemMessage.type === MESSAGE_TYPE.image && !!itemMessage.content.length;
    const isMessageChangeColor = itemMessage.type === MESSAGE_TYPE.changeColor;
    const isMessageChangeName = itemMessage.type === MESSAGE_TYPE.changeName;

    const backgroundColor = isMyMessage
        ? 'transparent'
        : theme.backgroundButtonColor;
    const textColor = isMyMessage ? Theme.common.textMe : theme.textColor;
    const paddingLeft = isMyMessage ? scale(17) : scale(10);
    const paddingRight = isMyMessage ? scale(10) : scale(17);
    const avatarSize = isMyMessage ? moderateScale(20) : moderateScale(27);

    /**
     * For animation message
     */
    const [isDisplayingOption, setIsDisplayingOption] = useState(false);
    const [isDisplayDatetime, setIsDisplayDatetime] = useState(false);
    const [mostHeightDateTime, setMostHeightDateTime] = useState(true);
    const pan: any = useRef(new Animated.Value(0)).current;

    const onPressMessage = (index = 0) => {
        if (!isDisplayingOption) {
            // message image
            if (isMessageImage) {
                if (typeof itemMessage.content === 'object') {
                    seeDetailImage({
                        images: itemMessage.content.map(url => url),
                        initIndex: index,
                    });
                }
            }
            // message text
            else if (!isDisplayDatetime) {
                setIsDisplayDatetime(true);
            } else {
                setMostHeightDateTime(!mostHeightDateTime);
            }
        } else {
            clearTimeout(x.current);
            Animated.timing(pan, {
                toValue: 0,
                useNativeDriver: true,
            }).start(() => setIsDisplayingOption(false));
        }
    };

    const onLongPressMessage = () => {
        clearTimeout(x.current);
        setIsDisplayingOption(true);
        Animated.spring(pan, {
            toValue: isMyMessage ? -scale(40) : scale(40),
            useNativeDriver: true,
        }).start(() => {
            x.current = setTimeout(() => {
                Animated.timing(pan, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }, 2000);
        });
        return () => clearTimeout(x.current);
    };

    /**
     * Render view
     */
    const RenderLinearGradient = () => {
        if (!isMyMessage) {
            return null;
        }
        return (
            <LinearGradient
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}
                colors={chatColor}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
            />
        );
    };

    const PartnerAvatar = () => {
        if (isMyMessage) {
            return null;
        }
        if (!displayAvatar) {
            return <View style={styles.avatarPartnerWithoutAvatar} />;
        }
        return (
            <View style={styles.avatarPartnerView}>
                <StyleImage
                    source={{uri: partnerAvatar}}
                    customStyle={styles.avatarPartnerView}
                />
            </View>
        );
    };

    const SeenAvatar = () => {
        if (!isMyMessage || !displayAvatar) {
            return null;
        }
        return (
            <View style={styles.seenAvatarView}>
                <StyleImage
                    source={{uri: partnerAvatar}}
                    customStyle={styles.seenAvatar}
                />
            </View>
        );
    };

    return (
        <>
            {SeenAvatar()}

            {isDisplayDatetime && !!itemMessage.created && (
                <DatetimeMessage
                    datetime={itemMessage.created}
                    isMyMessage={isMyMessage}
                    mostHeightDateTime={mostHeightDateTime}
                    senderName={itemMessage.creatorName}
                />
            )}

            <View
                style={[
                    styles.container,
                    {
                        flexDirection: isMyMessage ? 'row-reverse' : 'row',
                        opacity: itemMessage?.tag ? 0.4 : 1,
                    },
                ]}>
                {PartnerAvatar()}

                <View style={styles.spaceView} />

                {/* option delete message */}
                {isMyMessage && isDisplayingOption && (
                    <View style={styles.optionsBox}>
                        <StyleTouchable
                            onPress={() => onDeleteMessage(itemMessage.id)}>
                            <MaterialCommunityIcons
                                name="delete-sweep-outline"
                                style={[
                                    styles.iconDelete,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                )}

                <Animated.View
                    style={[
                        styles.contentView,
                        {
                            flexDirection: isMyMessage ? 'row-reverse' : 'row',
                            transform: [{translateX: pan}],
                        },
                    ]}
                    // {...panResponse.panHandlers}
                    // onResponderRelease={onResponderRelease}
                >
                    {isMessageImage && (
                        <View style={styles.imageBox}>
                            {itemMessage.content?.map(
                                (item: string, index: number) => (
                                    <MessageImage
                                        key={index}
                                        imageUrl={item}
                                        total={itemMessage.content.length}
                                        onPress={() => onPressMessage(index)}
                                        onLongPress={onLongPressMessage}
                                    />
                                ),
                            )}
                        </View>
                    )}

                    {isMessageEmoji && (
                        <StyleTouchable
                            activeOpacity={1}
                            normalOpacity={
                                isDisplayDatetime && mostHeightDateTime
                                    ? 0.6
                                    : 1
                            }
                            onPress={onPressMessage}
                            onLongPress={onLongPressMessage}
                            delayLongPress={DELAY_LONG_PRESS}>
                            <StyleText
                                originValue={itemMessage.content}
                                customStyle={{
                                    fontSize:
                                        itemMessage.content.length === 2
                                            ? moderateScale(90)
                                            : moderateScale(50),
                                }}
                            />
                        </StyleTouchable>
                    )}

                    {isMessageText && (
                        <StyleTouchable
                            customStyle={[
                                styles.messageBox,
                                {
                                    backgroundColor,
                                },
                            ]}
                            activeOpacity={1}
                            normalOpacity={
                                isDisplayDatetime && mostHeightDateTime
                                    ? 0.6
                                    : 1
                            }
                            onPress={onPressMessage}
                            onLongPress={onLongPressMessage}
                            delayLongPress={DELAY_LONG_PRESS}>
                            {RenderLinearGradient()}

                            <StyleText
                                originValue={itemMessage.content}
                                customStyle={[
                                    styles.messageText,
                                    {
                                        color: textColor,
                                        marginLeft: paddingLeft,
                                        marginRight: paddingRight,
                                    },
                                ]}
                            />
                        </StyleTouchable>
                    )}

                    {isMessageChangeColor && (
                        <View style={styles.notificationMessageView}>
                            <StyleText
                                originValue={`@${itemMessage.creatorName}`}
                                customStyle={[
                                    styles.textNotification,
                                    {
                                        color: theme.textColor,
                                        fontWeight: 'bold',
                                        marginLeft: isMyMessage
                                            ? avatarSize + scale(7)
                                            : -(avatarSize + scale(7)),
                                    },
                                ]}>
                                <StyleText
                                    i18Text="mess.changeColorOfChat"
                                    customStyle={[
                                        styles.textNotification,
                                        {
                                            color: theme.textColor,
                                            fontWeight: 'normal',
                                        },
                                    ]}
                                />
                            </StyleText>
                        </View>
                    )}

                    {isMessageChangeName && (
                        <View style={styles.notificationMessageView}>
                            <StyleText
                                originValue={`@${itemMessage.creatorName}`}
                                customStyle={[
                                    styles.textNotification,
                                    {
                                        color: theme.textColor,
                                        fontWeight: 'bold',
                                        marginLeft: isMyMessage
                                            ? avatarSize + scale(7)
                                            : -(avatarSize + scale(7)),
                                    },
                                ]}>
                                <StyleText
                                    i18Text="mess.changeNameOfChat"
                                    customStyle={[
                                        styles.textNotification,
                                        {
                                            color: theme.textColor,
                                            fontWeight: 'normal',
                                        },
                                    ]}
                                />
                            </StyleText>
                        </View>
                    )}

                    {/* only message text have this
                    because message image when press will show detail */}

                    <Text
                        style={styles.comeBackButtonBox}
                        onPress={Keyboard.dismiss}
                    />
                </Animated.View>
            </View>

            {!!itemMessage.created &&
                (!isSameMessageAfter ||
                    isMessageChangeName ||
                    isMessageChangeColor) && (
                    <StyleText
                        originValue={formatDateMessage(itemMessage.created)}
                        customStyle={[
                            styles.dateText,
                            {
                                color: theme.borderColor,
                            },
                        ]}
                    />
                )}
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: '2@vs',
    },
    // avatar
    avatarPartnerWithoutAvatar: {
        width: '40@ms',
        height: '100%',
    },
    avatarPartnerView: {
        width: '40@ms',
        height: '40@ms',
        borderRadius: '20@ms',
    },
    seenAvatarView: {
        alignSelf: 'flex-end',
        marginRight: '10@s',
    },
    seenAvatar: {
        width: '30@ms',
        height: '30@ms',
        borderRadius: '15@ms',
    },
    // space between
    spaceView: {
        width: '7@s',
        height: '100%',
    },
    // content view
    contentView: {
        flex: 1,
    },
    messageBox: {
        borderRadius: '10@ms',
        maxWidth: '70%',
        minWidth: '20%',
    },
    messageText: {
        fontSize: FONT_SIZE.normal,
        marginVertical: '6@ms',
    },
    dateText: {
        alignSelf: 'center',
        fontSize: '10@ms',
        marginTop: '20@vs',
        marginBottom: '10@vs',
    },
    imageBox: {
        maxWidth: Metrics.width * 0.7,
        flexDirection: 'row',
        paddingBottom: '4@vs',
    },
    optionsBox: {
        position: 'absolute',
        width: '40@s',
        height: '100%',
        left: '7@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconDelete: {
        fontSize: '25@ms',
    },
    notificationMessageView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textNotification: {
        fontSize: '10@ms',
        marginBottom: '10@vs',
    },
    // come back touch
    comeBackButtonBox: {
        flex: 1,
    },
});

export default memo(ItemMessage, (prevProps: Props, nextProps: Props) => {
    if (
        !isEqual(prevProps.itemMessage, nextProps.itemMessage) ||
        prevProps.isSameMessageAfter !== nextProps.isSameMessageAfter ||
        prevProps.displaySeenAvatar !== nextProps.displaySeenAvatar ||
        prevProps.displayPartnerAvatar !== nextProps.displayPartnerAvatar ||
        prevProps.chatColor !== nextProps.chatColor
    ) {
        return false;
    }

    // if (nextProps.listMessagesLength < prevProps.listMessagesLength) {
    //     return false;
    // }
    // if (prevProps.onDeleteMessage !== nextProps.onDeleteMessage) {
    //     return false;
    // }
    return true;
});

// const oldPan: any = useRef(new Animated.Value(0)).current;
// const panResponse = useRef(
//     PanResponder.create({
//         onMoveShouldSetPanResponder: () => true,
//         onPanResponderGrant: () => {
//             setDisplayOption(true);
//         },
//         onPanResponderMove: (evt, gesture) => {
//             clearTimeout(x);
//             const dx = gesture.dx;
//             const newPan = oldPan._value + dx;
//             if (isMyMessage) {
//                 if (newPan < -scale(70) || newPan > 0) {
//                     return;
//                 }
//             } else {
//                 if (newPan < 0 || newPan > scale(70)) {
//                     return;
//                 }
//             }
//             pan.setValue(newPan);
//         },
//     }),
// ).current;

// const onResponderRelease = () => {
//     if (isMyMessage) {
//         // come back to start position
//         if (pan._value > oldPan._value) {
//             Animated.spring(pan, {
//                 toValue: 0,
//                 useNativeDriver: true,
//             }).start(() => oldPan.setValue(0));
//         }
//         // auto come to -70 when move < - 30
//         else if (pan._value < -30) {
//             Animated.spring(pan, {
//                 toValue: -scale(70),
//                 useNativeDriver: true,
//             }).start(() => oldPan.setValue(-scale(70)));
//         }
//         // if move > -30, auto comeback to 0
//         else {
//             Animated.spring(pan, {
//                 toValue: 0,
//                 useNativeDriver: true,
//             }).start(() => oldPan.setValue(0));
//         }

//         // auto comeback 0 after 2 seconds
//         x = setTimeout(() => {
//             Animated.spring(pan, {
//                 toValue: 0,
//                 useNativeDriver: true,
//             }).start(() => oldPan.setValue(0));
//         }, 2000);
//     } else {
//         // come back to start position
//         if (pan._value < oldPan._value) {
//             Animated.spring(pan, {
//                 toValue: 0,
//                 useNativeDriver: true,
//             }).start(() => oldPan.setValue(0));
//         }
//         // auto come to -70 when move < - 30
//         else if (pan._value > 30) {
//             Animated.spring(pan, {
//                 toValue: scale(70),
//                 useNativeDriver: true,
//             }).start(() => oldPan.setValue(scale(70)));
//         }
//         // if move > -30, auto comeback to 0
//         else {
//             Animated.spring(pan, {
//                 toValue: 0,
//                 useNativeDriver: true,
//             }).start(() => oldPan.setValue(0));
//         }

//         // auto comeback 0 after 2 seconds
//         x = setTimeout(() => {
//             Animated.spring(pan, {
//                 toValue: 0,
//                 useNativeDriver: true,
//             }).start(() => oldPan.setValue(0));
//         }, 2000);
//     }
// };

// const onComeBackToInitPosition = () => {
//     clearTimeout(x);
//     Animated.spring(pan, {
//         toValue: 0,
//         useNativeDriver: true,
//     }).start(() => oldPan.setValue(0));
// };
