import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import Theme from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {GestureResponderEvent, StyleProp, View, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {checkIsVideo} from 'utility/validate';
import Entypo from 'react-native-vector-icons/Entypo';
import Video from 'react-native-video';

interface Props {
    item: TypeBubblePalace & TypeGroupBuying;
    onGoToDetailPost(bubble: string, e: GestureResponderEvent): void;
    containerStyle?: StyleProp<ViewStyle>;
}

const PostStatus = (props: Props) => {
    const {item, onGoToDetailPost, containerStyle} = props;
    const firstPostUrl = item.images[0] || '';
    const isPostReview = !!item?.stars;
    const isVideo = checkIsVideo(firstPostUrl);

    const ImagePreview = () => {
        if (!isVideo) {
            return (
                <StyleImage
                    source={{uri: firstPostUrl}}
                    customStyle={styles.image}
                    defaultSource={Images.images.defaultImage}
                />
            );
        }

        return (
            <Video
                source={{uri: firstPostUrl}}
                style={styles.video}
                resizeMode="cover"
                paused
                currentTime={2}
            />
        );
    };

    return (
        <StyleTouchable
            customStyle={[styles.container, containerStyle]}
            onPress={e => {
                onGoToDetailPost(item.id, e);
            }}
            activeOpacity={0.95}>
            {ImagePreview()}
            <LinearGradient
                colors={[
                    Theme.common.gradientTabBar1,
                    Theme.common.gradientTabBar2,
                ]}
                style={isPostReview ? styles.starView : styles.groupView}>
                {isPostReview &&
                    Array(item.stars)
                        .fill(0)
                        .map((_, index) => (
                            <AntDesign
                                key={index}
                                name="star"
                                style={styles.star}
                            />
                        ))}
                {!isPostReview && (
                    <StyleIcon
                        source={Images.icons.createGroup}
                        size={15}
                        customStyle={styles.iconGroup}
                    />
                )}
            </LinearGradient>
            {item.isDraft && (
                <View style={styles.draftView}>
                    <StyleText
                        i18Text="profile.draftPost"
                        customStyle={styles.textDraft}
                    />
                </View>
            )}
            {item.images.length >= 2 && (
                <MaterialCommunityIcons
                    name="file-multiple"
                    style={styles.iconMultiPage}
                />
            )}
            {isVideo && (
                <Entypo name="video-camera" style={styles.iconMultiPage} />
            )}
        </StyleTouchable>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: Metrics.width / 3 - moderateScale(0.5),
        height: Metrics.width / 3 + scale(30),
        marginBottom: '0.75@ms',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    starView: {
        position: 'absolute',
        right: '5@s',
        bottom: '5@s',
        paddingVertical: '2@vs',
        paddingHorizontal: '7@s',
        flexDirection: 'row',
        borderRadius: '2@s',
    },
    groupView: {
        position: 'absolute',
        right: '5@s',
        bottom: '5@s',
        padding: '5@vs',
        flexDirection: 'row',
        borderRadius: '20@s',
    },
    star: {
        fontSize: '8@ms',
        marginHorizontal: '1@s',
        color: Theme.common.orange,
    },
    draftView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Theme.darkTheme.backgroundOpacity(),
        alignItems: 'center',
        justifyContent: 'center',
    },
    textDraft: {
        fontSize: '14@ms',
        color: Theme.common.white,
    },
    iconMultiPage: {
        position: 'absolute',
        fontSize: '17@ms',
        color: Theme.common.white,
        right: '3@ms',
        top: '3@ms',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    iconGroup: {
        tintColor: Theme.common.black,
    },
});

export default memo(PostStatus, (preProps: Props, nextProps: any) => {
    if (!isEqual(preProps.item, nextProps.item)) {
        return false;
    }
    return true;
});
