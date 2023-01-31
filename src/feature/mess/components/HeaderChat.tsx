import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import {goBack} from 'navigation/NavigationService';
import React from 'react';
import {Platform, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
    numberNewMessages: number;
    borderMessRoute: string;
    avatar: string;
    onPressAvatar(): void;
    name: string;
    onPressName(): void;
    onGoToSetting(): void;
    holderColor: string;
}

const HeaderChat = (props: Props) => {
    const {
        numberNewMessages,
        avatar,
        onPressAvatar,
        name,
        onPressName,
        borderMessRoute,
        onGoToSetting,
        holderColor,
    } = props;

    return (
        <View style={[styles.container, {borderBottomColor: holderColor}]}>
            <StyleTouchable
                customStyle={styles.headerLeftView}
                onPress={() => {
                    Redux.setChatTagFocusing('');
                    goBack();
                }}
                hitSlop={10}>
                <AntDesign
                    name="left"
                    style={[styles.iconLeft, {color: borderMessRoute}]}
                />

                <View
                    style={[
                        styles.numberNewMessagesBox,
                        {
                            backgroundColor: numberNewMessages
                                ? borderMessRoute
                                : 'transparent',
                        },
                    ]}>
                    {!!numberNewMessages && (
                        <StyleText
                            originValue={numberNewMessages}
                            customStyle={[
                                styles.textNewMessages,
                                {color: Theme.common.textMe},
                            ]}
                        />
                    )}
                </View>
            </StyleTouchable>

            <StyleTouchable onPress={onPressAvatar}>
                <StyleImage
                    source={{uri: avatar}}
                    customStyle={styles.avatar}
                />
            </StyleTouchable>

            <StyleTouchable
                onPress={onPressName}
                customStyle={{maxWidth: '50%'}}>
                <StyleText
                    originValue={name}
                    customStyle={[styles.textName, {color: borderMessRoute}]}
                    numberOfLines={1}
                />
            </StyleTouchable>

            <StyleTouchable
                customStyle={styles.iconCloudView}
                onPress={onGoToSetting}
                hitSlop={10}>
                <AntDesign
                    name="infocirlceo"
                    style={[styles.iconCloud, {color: borderMessRoute}]}
                />
            </StyleTouchable>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingVertical: '5@vs',
        paddingHorizontal: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    headerLeftView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '12@s',
    },
    iconLeft: {
        fontSize: '20@ms',
    },
    numberNewMessagesBox: {
        width: '13@s',
        height: '15@s',
        borderRadius: '10@s',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textNewMessages: {
        fontSize: '8@ms',
    },
    avatar: {
        width: '30@ms',
        height: '30@ms',
        borderRadius: '15@ms',
    },
    textName: {
        fontSize: '15.5@ms',
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    iconCloudView: {
        position: 'absolute',
        right: '20@s',
    },
    iconCloud: {
        fontSize: '17@ms',
    },
});

export default HeaderChat;
