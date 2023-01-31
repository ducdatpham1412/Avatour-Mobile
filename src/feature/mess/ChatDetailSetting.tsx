import {TypeChatTagResponse} from 'api/interface';
import {
    apiBlockUser,
    apiChangeChatColor,
    apiChangeChatName,
    apiOpenConversation,
    apiStopConversation,
    apiUnBlockUser,
} from 'api/module';
import {CONVERSATION_STATUS, TYPE_COLOR} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import React, {useMemo, useRef, useState} from 'react';
import {Platform, ScrollView, TextInput, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet} from 'react-native-size-matters';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {
    chooseColorGradient,
    onGoToProfile,
    renderIconGender,
} from 'utility/assistant';
import ItemSetting from './components/ItemSetting';
import ItemSettingSwitch from './components/ItemSettingSwitch';

interface Props {
    route: {
        params: {
            itemChatTag: TypeChatTagResponse;
        };
    };
}

/**
 * Functions
 */
const onReportUser = (userId: number) => {
    navigate(ROOT_SCREEN.reportUser, {
        idUser: userId,
    });
};

let timeOut: any;

const ChatDetailSetting = ({route}: Props) => {
    const shouldRenderOtherProfile = Redux.getShouldRenderOtherProfile();
    const borderMessRoute = Redux.getBorderMessRoute();
    const theme = Redux.getTheme();
    const {profile, information} = Redux.getPassport();
    const {gradients} = Redux.getResource();
    const gradientAny: any = gradients;

    const modalizeThemeRef = useRef<Modalize>(null);
    const modalizeNameRef = useRef<Modalize>(null);
    const inputConversationNameRef = useRef<TextInput>(null);

    const [itemChatTag, setItemChatTag] = useState(route.params.itemChatTag);

    const [conversationName, setConversationName] = useState(
        itemChatTag.conversationName,
    );

    const partnerInfo = useMemo(() => {
        const result = itemChatTag.listUser.find(
            item => item.id !== profile.id,
        );
        return (
            result || {
                id: profile.id,
                name: profile.name,
                avatar: profile.avatar,
                gender: information.gender,
            }
        );
    }, []);

    const isChatTagOfMe = useMemo(() => {
        return itemChatTag.listUser[0]?.id === itemChatTag.listUser[1]?.id;
    }, []);

    /**
     * Function
     */
    const onChangeTheme = async (key: string) => {
        const typeColor: any = TYPE_COLOR;
        try {
            if (typeColor[key] !== undefined) {
                await apiChangeChatColor({
                    conversationId: itemChatTag.id,
                    color: typeColor[key],
                });
                setItemChatTag({
                    ...itemChatTag,
                    color: typeColor[key],
                });
                modalizeThemeRef.current?.close();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const onHandleBlock = async () => {
        try {
            if (itemChatTag.isBlocked) {
                await apiUnBlockUser(partnerInfo.id);
                Redux.setShouldRenderOtherProfile(!shouldRenderOtherProfile);
                setItemChatTag({
                    ...itemChatTag,
                    isBlocked: false,
                });
            } else {
                await apiBlockUser(partnerInfo.id);
                Redux.setShouldRenderOtherProfile(!shouldRenderOtherProfile);
                setItemChatTag({
                    ...itemChatTag,
                    isBlocked: true,
                });
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const onHandleStopConversation = async () => {
        try {
            if (itemChatTag.status === CONVERSATION_STATUS.stop) {
                await apiOpenConversation(itemChatTag.id);
                setItemChatTag({
                    ...itemChatTag,
                    status: CONVERSATION_STATUS.active,
                });
            } else {
                await apiStopConversation(itemChatTag.id);
                setItemChatTag({
                    ...itemChatTag,
                    status: CONVERSATION_STATUS.stop,
                });
            }
        } catch (err) {
            appAlert(err);
        }
    };

    /**
     * Render view
     */
    const IconPartnerGender = () => {
        return (
            <StyleImage
                source={renderIconGender(partnerInfo.gender)}
                customStyle={styles.iconGender}
            />
        );
    };

    const IconConversationName = () => {
        return (
            <Ionicons
                name="text"
                style={[
                    styles.textConversationName,
                    {color: theme.textHightLight},
                ]}
            />
        );
    };

    const IconTheme = () => {
        return (
            <LinearGradient
                colors={chooseColorGradient({
                    listGradients: gradients,
                    colorChoose: itemChatTag.color,
                })}
                style={styles.iconAvatar}
            />
        );
    };

    const IconStopChat = () => {
        return (
            <Octicons
                name="stop"
                style={[
                    styles.textConversationName,
                    {color: theme.textHightLight},
                ]}
            />
        );
    };

    const IconBlock = () => {
        return (
            <Entypo
                name="block"
                style={[
                    styles.textConversationName,
                    {color: theme.highlightColor},
                ]}
            />
        );
    };

    const IconReport = () => {
        return (
            <Octicons
                name="report"
                style={[
                    styles.textConversationName,
                    {color: theme.highlightColor},
                ]}
            />
        );
    };

    const ModalChangeTheme = () => {
        return (
            <Modalize
                ref={modalizeThemeRef}
                modalHeight={Metrics.height / 2}
                modalStyle={{
                    backgroundColor: theme.backgroundButtonColor,
                }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentModalScroll}>
                    {Object.keys(gradientAny).map((key, index) => {
                        const name = key[0].toUpperCase() + key.slice(1);
                        return (
                            <StyleTouchable
                                key={index}
                                customStyle={styles.chooseGradientBox}
                                onPress={() => onChangeTheme(key)}>
                                <LinearGradient
                                    colors={gradientAny[key]}
                                    style={styles.itemGradient}
                                />
                                <StyleText
                                    originValue={name}
                                    customStyle={[
                                        styles.textNameGradient,
                                        {color: theme.textColor},
                                    ]}
                                />
                            </StyleTouchable>
                        );
                    })}
                </ScrollView>
            </Modalize>
        );
    };

    const ModalEditConversationName = () => {
        const onCancel = () => {
            setConversationName(itemChatTag.conversationName);
            modalizeNameRef.current?.close();
        };

        const onSave = async () => {
            try {
                await apiChangeChatName({
                    conversationId: itemChatTag.id,
                    name: conversationName,
                });
                setItemChatTag({
                    ...itemChatTag,
                    conversationName,
                });
                modalizeNameRef.current?.close();
            } catch (err) {
                appAlert(err);
            }
        };

        return (
            <Modalize
                ref={modalizeNameRef}
                modalStyle={{
                    backgroundColor: 'transparent',
                }}
                withHandle={false}
                scrollViewProps={{
                    keyboardShouldPersistTaps: 'always',
                }}
                overlayStyle={{
                    backgroundColor: theme.backgroundOpacity(),
                }}>
                <View
                    style={[
                        styles.inputEditNameView,
                        {backgroundColor: theme.backgroundButtonColor},
                    ]}>
                    <StyleText
                        i18Text="mess.editConversationName"
                        customStyle={[
                            styles.titleConversationName,
                            {color: theme.textHightLight},
                        ]}
                    />
                    <StyleText
                        i18Text="mess.oneNameForBoth"
                        customStyle={[
                            styles.contentConversationName,
                            {color: theme.textColor},
                        ]}
                    />
                    <TextInput
                        ref={inputConversationNameRef}
                        style={[
                            styles.inputConversationName,
                            {
                                color: theme.textHightLight,
                                borderColor: theme.borderColor,
                            },
                        ]}
                        defaultValue={conversationName}
                        placeholder="Aa"
                        placeholderTextColor={theme.holderColorLighter}
                        onChangeText={text => setConversationName(text)}
                    />
                    <View
                        style={[
                            styles.buttonView,
                            {borderTopColor: theme.holderColorLighter},
                        ]}>
                        <StyleTouchable
                            customStyle={[
                                styles.buttonBox,
                                {
                                    borderRightWidth: 0.5,
                                    borderRightColor: theme.holderColorLighter,
                                },
                            ]}
                            onPress={onCancel}>
                            <StyleText
                                i18Text="common.cancel"
                                customStyle={[
                                    styles.textButton,
                                    {color: theme.highlightColor},
                                ]}
                            />
                        </StyleTouchable>
                        <StyleTouchable
                            customStyle={styles.buttonBox}
                            onPress={onSave}>
                            <StyleText
                                i18Text="common.save"
                                customStyle={[
                                    styles.textButton,
                                    {
                                        color: theme.highlightColor,
                                        fontWeight: 'bold',
                                    },
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                </View>
            </Modalize>
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <StyleHeader
                title={
                    itemChatTag.conversationName || 'mess.detailSetting.title'
                }
                titleStyle={{width: '60%'}}
            />

            <View style={styles.avatarNameView}>
                <StyleImage
                    source={{uri: partnerInfo.avatar}}
                    customStyle={styles.avatar}
                />
                <StyleText
                    originValue={partnerInfo.name}
                    customStyle={[styles.nameText, {color: borderMessRoute}]}
                />
            </View>

            <ScrollView style={styles.body}>
                <View
                    style={[
                        styles.customActionsView,
                        {backgroundColor: theme.backgroundTextInput},
                    ]}>
                    <ItemSetting
                        iconLeft={IconPartnerGender()}
                        title="mess.detailSetting.profile"
                        titleParams={{name: partnerInfo.name}}
                        hadIconRight
                        onPress={() => onGoToProfile(partnerInfo.id)}
                    />
                    <ItemSetting
                        iconLeft={IconConversationName()}
                        title="mess.detailSetting.conversationName"
                        titleParams={{name: partnerInfo.name}}
                        onPress={() => {
                            modalizeNameRef.current?.open();
                            timeOut = setTimeout(() => {
                                inputConversationNameRef.current?.focus();
                            }, 100);
                            return () => clearTimeout(timeOut);
                        }}
                    />
                    <ItemSetting
                        iconLeft={IconTheme()}
                        title="mess.detailSetting.theme"
                        titleParams={{name: partnerInfo.name}}
                        onPress={() => modalizeThemeRef.current?.open()}
                    />
                </View>

                {!isChatTagOfMe && (
                    <View
                        style={[
                            styles.customActionsView,
                            {backgroundColor: theme.backgroundTextInput},
                        ]}>
                        <ItemSettingSwitch
                            iconLeft={IconStopChat()}
                            title="mess.detailSetting.stopConversation"
                            value={
                                itemChatTag.status === CONVERSATION_STATUS.stop
                            }
                            onToggleSwitch={onHandleStopConversation}
                        />
                        <ItemSettingSwitch
                            iconLeft={IconBlock()}
                            title="mess.detailSetting.block"
                            titleStyle={{color: theme.highlightColor}}
                            value={itemChatTag.isBlocked}
                            onToggleSwitch={onHandleBlock}
                        />
                        <ItemSetting
                            iconLeft={IconReport()}
                            title="mess.detailSetting.report"
                            titleStyle={{color: theme.highlightColor}}
                            onPress={() => onReportUser(partnerInfo.id)}
                        />
                    </View>
                )}
            </ScrollView>

            {ModalChangeTheme()}
            {ModalEditConversationName()}
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    avatarNameView: {
        alignSelf: 'center',
        marginTop: '20@vs',
        alignItems: 'center',
    },
    avatar: {
        width: '100@s',
        height: '100@s',
        borderRadius: '50@s',
    },
    nameText: {
        fontWeight: 'bold',
        marginTop: '10@vs',
    },
    body: {
        width: '85%',
        alignSelf: 'center',
        marginTop: '15@vs',
    },
    customActionsView: {
        width: '100%',
        paddingVertical: '10@vs',
        paddingHorizontal: '15@s',
        borderRadius: '8@s',
        marginBottom: '15@vs',
    },
    iconGender: {
        width: '80%',
        height: '80%',
    },
    textConversationName: {
        fontSize: '20@ms',
    },
    iconAvatar: {
        width: '70%',
        height: '70%',
        borderRadius: '70@s',
    },
    contentModalScroll: {
        paddingBottom: '50@vs',
        paddingTop: '20@vs',
    },
    chooseGradientBox: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: '10@vs',
        alignSelf: 'center',
    },
    itemGradient: {
        width: '40@s',
        height: '40@s',
        borderRadius: '25@s',
    },
    textNameGradient: {
        fontSize: '16@ms',
        marginLeft: '10@s',
        fontWeight: 'bold',
    },
    inputEditNameView: {
        width: '75%',
        alignSelf: 'center',
        borderRadius: '15@ms',
        marginTop: Metrics.height / 5,
        alignItems: 'center',
    },
    titleConversationName: {
        fontSize: '15@ms',
        fontWeight: 'bold',
        marginTop: '13@vs',
    },
    contentConversationName: {
        fontSize: '12@ms',
        marginTop: '7@vs',
    },
    inputConversationName: {
        width: '85%',
        marginTop: '15@vs',
        marginBottom: 0,
        borderWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        paddingVertical: '6@vs',
        paddingHorizontal: '5@s',
        borderRadius: '5@ms',
    },
    buttonView: {
        width: '100%',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        marginTop: '15@vs',
        flexDirection: 'row',
        paddingVertical: '13@vs',
    },
    buttonBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButton: {
        fontSize: '15@ms',
    },
});

export default ChatDetailSetting;
