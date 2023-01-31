import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TypeBubblePalace} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {apiGetDetailBubble} from 'api/module';
import {
    apiLikePost,
    apiSavePost,
    apiUnLikePost,
    apiUnSavePost,
} from 'api/profile';
import {REACT, TYPE_DYNAMIC_LINK} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {
    ANDROID_APP_LINK,
    DYNAMIC_LINK_ANDROID,
    DYNAMIC_LINK_IOS,
    DYNAMIC_LINK_SHARE,
    LANDING_PAGE_URL,
} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {
    StyleIcon,
    StyleImage,
    StyleText,
    StyleTouchable,
} from 'components/base';
import IconLiked from 'components/common/IconLiked';
import IconNotLiked from 'components/common/IconNotLiked';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import ModalCommentLike from 'components/ModalCommentLike';
import StyleMoreText from 'components/StyleMoreText';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import {appAlert} from 'navigation/NavigationService';
import {showPreviewLink} from 'navigation/screen/AppStack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import Share from 'react-native-share';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    chooseIconFeeling,
    chooseTextTopic,
    fakeBubbleFocusing,
    onGoToProfile,
} from 'utility/assistant';
import {formatFromNow} from 'utility/format';

interface Props {
    route: {
        params: {
            bubbleId?: string;
            bubble?: TypeBubblePalace;
            displayComment?: boolean;
            displayLike?: boolean;
        };
    };
}

const DetailBubble = ({route}: Props) => {
    const {bubbleId, displayComment, displayLike} = route.params;
    const theme = Redux.getTheme();

    const optionsRef = useRef<any>(null);
    const modalRef = useRef<ModalCommentLike>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bubble, setBubble] = useState<TypeBubblePalace | undefined>(
        route.params.bubble,
    );

    const onShowModalComment = useCallback(
        (post: TypeBubblePalace, type: TypeShowModalCommentOrLike) => {
            modalRef.current?.show({
                post,
                type,
            });
        },
        [],
    );

    const onRefresh = async () => {
        if (bubble) {
            try {
                setIsLoading(true);
                const res = await apiGetDetailBubble(bubble.id);
                setBubble(res.data);
                if (displayComment) {
                    onShowModalComment(res.data, 'comment');
                } else if (displayLike) {
                    onShowModalComment(res.data, 'like');
                }
            } catch (err) {
                appAlert(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            if (bubbleId) {
                try {
                    setIsLoading(true);
                    const res = await apiGetDetailBubble(bubbleId);
                    setBubble(res.data);
                    if (displayComment) {
                        onShowModalComment(res.data, 'comment');
                    } else if (displayLike) {
                        onShowModalComment(res.data, 'like');
                    }
                } catch (err) {
                    appAlert(err);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        getData();
    }, []);

    const onHandleLike = async () => {
        if (bubble) {
            const currentLike = bubble.isLiked;
            const currentTotalLikes = bubble.totalLikes;

            try {
                setBubble({
                    ...bubble,
                    isLiked: !currentLike,
                    totalLikes: currentTotalLikes + (currentLike ? -1 : 1),
                });
                if (currentLike) {
                    await apiUnLikePost({
                        type: REACT.post,
                        reactedId: bubble.id,
                    });
                } else {
                    apiLikePost({
                        type: REACT.post,
                        reactedId: bubble.id,
                    });
                }
            } catch (err) {
                setBubble({
                    ...bubble,
                    isLiked: currentLike,
                    totalLikes: currentTotalLikes,
                });
                appAlert(err);
            }
        }
    };

    const onHandleSave = async () => {
        if (bubble) {
            const currentSave = bubble?.isSaved;

            try {
                setBubble({
                    ...bubble,
                    isSaved: !currentSave,
                });
                if (currentSave) {
                    await apiUnSavePost(bubble.id);
                } else {
                    await apiSavePost(bubble.id);
                }
            } catch (err) {
                setBubble({
                    ...bubble,
                    isSaved: currentSave,
                });
                appAlert(err);
            }
        }
    };

    const onShowModalShare = async () => {
        if (!bubble?.id) {
            return;
        }
        try {
            const link = await dynamicLinks().buildShortLink({
                link: `${bubble?.images?.[0] || LANDING_PAGE_URL}?type=${
                    TYPE_DYNAMIC_LINK.post
                }&post_id=${bubble.id}`,
                domainUriPrefix: DYNAMIC_LINK_SHARE,
                ios: {
                    bundleId: DYNAMIC_LINK_IOS,
                    appStoreId: '570060128',
                },
                android: {
                    packageName: DYNAMIC_LINK_ANDROID,
                    fallbackUrl: ANDROID_APP_LINK,
                },
                analytics: {
                    campaign: 'banner',
                },
            });

            // const imagePath: any = null;
            // let base64Data = '';
            // if (isIOS) {
            //     const resp = await RNFetchBlob.config({
            //         fileCache: true,
            //     }).fetch('GET', item.images[0]);
            //     base64Data = await resp.readFile('base64');
            // } else {
            //     base64Data = await RNFetchBlob.fs.readFile(
            //         item.images[0],
            //         'base64',
            //     );
            // }
            // const base64Image = `data:image/png;base64,${base64Data}`;
            // await Share.open({
            //     title: 'Title',
            //     url: base64Image,
            //     message: link,
            //     subject: 'Subject',
            // });
            // return RNFetchBlob.fs.unlink(imagePath);

            Share.open({
                message: 'Doffy share',
                url: link,
            });
        } catch (err) {
            appAlert(err);
        }
    };

    /**
     * Render view
     */
    const Header = () => {
        return (
            <View style={styles.headerView}>
                <View style={styles.avatarNameOptionBox}>
                    <StyleTouchable
                        customStyle={styles.avatarFeeling}
                        onPress={() => {
                            if (bubble?.creator) {
                                onGoToProfile(bubble.creator);
                            }
                        }}>
                        <StyleImage
                            source={{uri: bubble?.creatorAvatar}}
                            customStyle={styles.avatar}
                        />
                    </StyleTouchable>

                    {typeof bubble?.feeling === 'number' && (
                        <StyleIcon
                            source={chooseIconFeeling(bubble?.feeling)}
                            customStyle={styles.feeling}
                            size={17}
                        />
                    )}

                    <View style={styles.nameTime}>
                        <StyleText
                            originValue={bubble?.creatorName || ''}
                            customStyle={[
                                styles.textName,
                                {color: theme.textHightLight},
                            ]}
                        />
                        {bubble?.created && (
                            <StyleText
                                originValue={formatFromNow(bubble?.created)}
                                customStyle={[
                                    styles.textCreated,
                                    {color: theme.borderColor},
                                ]}
                            />
                        )}
                    </View>

                    {typeof bubble?.topic === 'number' && (
                        <StyleText
                            originValue="   ・ "
                            customStyle={[
                                styles.textTopic,
                                {color: theme.textColor},
                            ]}>
                            <StyleText
                                i18Text={chooseTextTopic(bubble.topic)}
                                customStyle={[
                                    styles.textTopic,
                                    {color: theme.textColor},
                                ]}
                            />
                        </StyleText>
                    )}

                    <StyleTouchable
                        customStyle={styles.iconMore}
                        onPress={() => optionsRef.current?.show()}>
                        <StyleIcon
                            source={Images.icons.more}
                            size={15}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>
                </View>

                {bubble?.location && (
                    <View style={styles.locationBox}>
                        <Ionicons
                            name="ios-location-sharp"
                            style={[
                                styles.iconLocationCaption,
                                {color: Theme.common.commentGreen},
                            ]}
                        />
                        <StyleText
                            originValue={bubble.location}
                            customStyle={[
                                styles.textLocation,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </View>
                )}

                {bubble?.content ? (
                    <StyleMoreText
                        value={bubble.content}
                        textStyle={[
                            styles.textCaption,
                            {color: theme.textColor},
                        ]}
                        containerStyle={styles.captionBox}
                        maxRows={3}
                    />
                ) : (
                    <View style={styles.spaceCaption} />
                )}
            </View>
        );
    };

    const Footer = () => {
        const arrayStars = Array(bubble?.stars).fill(0);

        const chooseLink = () => {
            if (bubble?.userReviewed) {
                return (
                    <StyleTouchable
                        customStyle={styles.linkBox}
                        onPress={() => showPreviewLink(bubble)}>
                        <View
                            style={[
                                styles.linkTouch,
                                {
                                    backgroundColor:
                                        theme.backgroundButtonColor,
                                },
                            ]}>
                            <StyleIcon
                                source={Images.icons.username}
                                size={15}
                                customStyle={{tintColor: theme.textColor}}
                            />
                            <StyleText
                                originValue={bubble.userReviewed?.name || ''}
                                customStyle={[
                                    styles.textSeeNow,
                                    {color: theme.textColor},
                                ]}
                            />
                        </View>
                    </StyleTouchable>
                );
            }
            if (bubble?.link) {
                return (
                    <StyleTouchable
                        customStyle={styles.linkBox}
                        onPress={() => showPreviewLink(bubble)}>
                        <View
                            style={[
                                styles.linkTouch,
                                {
                                    backgroundColor:
                                        theme.backgroundButtonColor,
                                },
                            ]}>
                            <AntDesign
                                name="link"
                                style={[
                                    styles.iconHouse,
                                    {color: theme.textColor},
                                ]}
                            />
                            <StyleText
                                i18Text="discovery.seeMore"
                                customStyle={[
                                    styles.textSeeNow,
                                    {color: theme.textColor},
                                ]}
                            />
                        </View>
                    </StyleTouchable>
                );
            }
            return null;
        };

        return (
            <View style={styles.footerView}>
                <View style={styles.starLink}>
                    <View
                        style={[
                            styles.starBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}>
                        {arrayStars.map((_, index) => (
                            <AntDesign
                                key={index}
                                name="star"
                                style={styles.star}
                            />
                        ))}
                    </View>
                    {chooseLink()}
                </View>

                <View style={styles.likeCommentShareSave}>
                    {bubble?.isLiked ? (
                        <IconLiked
                            customStyle={[
                                styles.iconLike,
                                {color: theme.likeHeart},
                            ]}
                            onPress={onHandleLike}
                        />
                    ) : (
                        <IconNotLiked
                            customStyle={[
                                styles.iconLike,
                                {color: theme.textHightLight},
                            ]}
                            onPress={onHandleLike}
                        />
                    )}

                    <StyleTouchable
                        customStyle={styles.iconComment}
                        onPress={() => {
                            if (bubble) {
                                onShowModalComment(bubble, 'comment');
                            }
                        }}>
                        <StyleIcon
                            source={Images.icons.comment}
                            size={20}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={styles.iconComment}
                        onPress={onShowModalShare}>
                        <StyleIcon
                            source={Images.icons.share}
                            size={21}
                            customStyle={{tintColor: theme.textHightLight}}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={styles.iconSave}
                        onPress={onHandleSave}>
                        {bubble?.isSaved ? (
                            <FontAwesome
                                name="bookmark"
                                style={[
                                    styles.save,
                                    {color: Theme.common.gradientTabBar1},
                                ]}
                            />
                        ) : (
                            <FontAwesome
                                name="bookmark-o"
                                style={[
                                    styles.save,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        )}
                    </StyleTouchable>
                </View>

                <StyleTouchable
                    customStyle={styles.likeTouch}
                    onPress={() => {
                        if (bubble) {
                            onShowModalComment(bubble, 'like');
                        }
                    }}>
                    <StyleText
                        i18Text={
                            bubble?.totalLikes
                                ? 'discovery.numberLike'
                                : 'discovery.like'
                        }
                        i18Params={{
                            value: bubble?.totalLikes || '',
                        }}
                        customStyle={[
                            styles.textLike,
                            {color: theme.textColor},
                        ]}
                    />
                </StyleTouchable>

                <StyleTouchable
                    customStyle={styles.commentTouch}
                    onPress={() => {
                        if (bubble) {
                            onShowModalComment(bubble, 'comment');
                        }
                    }}>
                    <StyleText
                        i18Text={
                            bubble?.totalComments
                                ? 'discovery.numberComments'
                                : 'discovery.comment'
                        }
                        i18Params={{
                            numberComments: bubble?.totalComments || '',
                        }}
                        customStyle={[
                            styles.textComment,
                            {color: theme.borderColor},
                        ]}
                    />
                </StyleTouchable>
            </View>
        );
    };

    return (
        <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
            <ViewSafeTopPadding />
            <StyleHeader title={bubble?.creatorName || ''} />
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={onRefresh}
                        tintColor={theme.highlightColor}
                        colors={[theme.highlightColor]}
                    />
                }>
                {Header()}
                <ScrollSyncSizeImage
                    images={bubble?.images || []}
                    syncWidth={Metrics.width}
                    onDoublePress={() => {
                        if (!bubble?.isLiked) {
                            onHandleLike();
                        }
                    }}
                />
                {Footer()}
            </ScrollView>

            <ModalCommentLike
                ref={modalRef}
                theme={theme}
                bubbleFocusing={bubble || fakeBubbleFocusing}
                updateBubbleFocusing={(value: TypeBubblePalace) =>
                    setBubble(preValue => ({
                        ...preValue,
                        ...value,
                    }))
                }
                setTotalComments={value =>
                    setBubble(preValue => {
                        if (preValue) {
                            return {
                                ...preValue,
                                totalComments: value,
                            };
                        }
                        return preValue;
                    })
                }
                increaseTotalComments={value => {
                    setBubble(preValue => {
                        if (preValue) {
                            return {
                                ...preValue,
                                totalComments: preValue.totalComments + value,
                            };
                        }
                        return preValue;
                    });
                }}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingBottom: Metrics.safeBottomPadding + verticalScale(20),
    },
    // header
    headerView: {
        width: '100%',
        paddingHorizontal: '15@s',
        marginTop: '10@vs',
    },
    avatarNameOptionBox: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarFeeling: {
        width: '35@s',
        height: '35@s',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: '25@s',
    },
    feeling: {
        position: 'absolute',
        bottom: '-1@s',
        left: '23@s',
    },
    nameTime: {
        maxWidth: '50%',
        marginLeft: '10@ms',
    },
    textName: {
        fontSize: '14@ms',
        fontWeight: 'bold',
    },
    textCreated: {
        fontSize: '10@ms',
        marginTop: '2@vs',
    },
    textTopic: {
        fontSize: '12@ms',
    },
    iconMore: {
        position: 'absolute',
        right: 0,
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '15@vs',
    },
    iconLocationCaption: {
        fontSize: '17@ms',
    },
    textLocation: {
        fontSize: '12@ms',
        marginLeft: '2@s',
    },
    captionBox: {
        marginVertical: '10@vs',
    },
    spaceCaption: {
        height: '10@vs',
    },
    textCaption: {
        fontSize: '14@ms',
    },
    // image
    imageView: {
        maxHeight: Metrics.width * 1.5,
    },
    // footer
    footerView: {
        width: '100%',
        paddingHorizontal: '15@s',
        marginTop: '6@vs',
    },
    starLink: {
        width: '100%',
        flexDirection: 'row',
    },
    starBox: {
        height: '22@ms',
        paddingHorizontal: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '5@ms',
    },
    star: {
        fontSize: '14@ms',
        marginHorizontal: '3@s',
        color: Theme.common.orange,
    },
    linkBox: {
        marginLeft: '10@s',
    },
    linkTouch: {
        height: '22@ms',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '5@ms',
        paddingHorizontal: '10@s',
    },
    iconHouse: {
        fontSize: '13@ms',
    },
    textSeeNow: {
        fontSize: '10@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
        marginLeft: '4@s',
    },
    likeCommentShareSave: {
        width: '100%',
        flexDirection: 'row',
        marginTop: '15@vs',
        alignItems: 'center',
    },
    iconLike: {
        fontSize: '22@ms',
    },
    iconComment: {
        marginLeft: '20@s',
    },
    iconSave: {
        position: 'absolute',
        right: 0,
    },
    save: {
        fontSize: '22@ms',
    },
    likeTouch: {
        marginTop: '10@vs',
        width: '100@s',
        paddingVertical: '5@vs',
    },
    textLike: {
        fontSize: '12@ms',
        fontWeight: 'bold',
    },
    textComment: {
        fontSize: '12@ms',
    },
    commentTouch: {
        paddingVertical: '5@vs',
        width: '50%',
    },
});

export default DetailBubble;
