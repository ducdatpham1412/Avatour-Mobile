import {TypeNotificationResponse} from 'api/interface';
import {TYPE_NOTIFICATION} from 'asset/enum';
import Images from 'asset/img/images';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import Redux from 'hook/useRedux';
import React from 'react';
import {View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {onGoToProfile} from 'utility/assistant';
import {formatFromNow} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';

interface Props {
    item: TypeNotificationResponse;
    onGoToDetailNotification(item: TypeNotificationResponse): void;
}

const chooseTextNotification = (type: number): I18Normalize => {
    switch (type) {
        case TYPE_NOTIFICATION.comment:
            return 'notification.comment';
        case TYPE_NOTIFICATION.follow:
            return 'notification.follow';
        case TYPE_NOTIFICATION.friendPostNew:
            return 'notification.friendPostNew';
        case TYPE_NOTIFICATION.likePost:
            return 'notification.likePost';
        case TYPE_NOTIFICATION.likeGroupBuying:
            return 'notification.likeGroupBuying';
        default:
            return 'common.null';
    }
};

const ItemNotification = (props: Props) => {
    const {item, onGoToDetailNotification} = props;
    const theme = Redux.getTheme();
    const textColor = item.isRead ? theme.textColor : theme.textHightLight;

    return (
        <StyleTouchable
            customStyle={styles.container}
            onPress={() => onGoToDetailNotification(item)}>
            <StyleTouchable
                customStyle={styles.avatarBox}
                onPress={() => onGoToProfile(item.creator)}>
                <StyleImage
                    source={{uri: item.creatorAvatar}}
                    customStyle={styles.avatar}
                />
            </StyleTouchable>

            <View style={styles.textView}>
                <StyleText
                    originValue={item.creatorName}
                    customStyle={[
                        styles.textNotification,
                        {color: textColor, fontWeight: 'bold'},
                    ]}
                    numberOfLines={2}>
                    <StyleText
                        i18Text={chooseTextNotification(item.type)}
                        customStyle={[
                            styles.textNotification,
                            {color: textColor, fontWeight: 'normal'},
                        ]}
                        numberOfLines={2}
                    />
                </StyleText>
                <StyleText
                    originValue={formatFromNow(item.created)}
                    customStyle={[
                        styles.textTime,
                        {color: theme.holderColorLighter},
                    ]}
                />
            </View>

            {!!item.image && (
                <View style={styles.imageView}>
                    <StyleImage
                        source={{uri: item.image}}
                        customStyle={styles.image}
                        defaultSource={Images.images.defaultImage}
                    />
                </View>
            )}
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        marginBottom: '20@vs',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarBox: {
        marginRight: '10@s',
    },
    avatar: {
        width: '40@vs',
        height: '40@vs',
        borderRadius: '20@vs',
    },
    textView: {
        flex: 1,
    },
    textNotification: {
        fontSize: FONT_SIZE.normal,
    },
    imageView: {
        width: '60@s',
        alignItems: 'flex-end',
    },
    image: {
        width: '30@s',
        height: '35@s',
    },
    textTime: {
        fontSize: FONT_SIZE.small,
        marginTop: '5@vs',
    },
});

export default ItemNotification;
