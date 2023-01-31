import {
    TypeBubblePalace,
    TypeCreatePostRequest,
    TypeEditPostRequest,
} from 'api/interface';
import {apiCreatePost, apiEditPost} from 'api/module';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {LIST_FEELINGS, LIST_TOPICS, NUMBER_STARS} from 'asset/standardValue';
import Theme from 'asset/theme/Theme';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import ScrollSyncSizeImage from 'components/common/ScrollSyncSizeImage';
import LoadingScreen from 'components/LoadingScreen';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    Animated,
    Keyboard,
    KeyboardEvent,
    Platform,
    ScrollView,
    TextInput,
    Vibration,
    View,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {onGoToSignUp} from 'utility/assistant';
import ImageUploader from 'utility/ImageUploader';
import ItemToolCreatePost from './components/ItemToolCreatePost';
import PreviewVideo from './components/PreviewVideo';
import ModalAddLink from './post/ModalAddLink';
import ModalCheckIn from './post/ModalCheckIn';
import ModalFeeling from './post/ModalFeeling';
import ModalPickStars from './post/ModalPickStars';
import ModalTopic from './post/ModalTopic';

interface Props {
    route: {
        params: {
            itemNew?: {
                images: Array<string>;
                isVideo: boolean;
                userReviewed?: {
                    id: number;
                    name: string;
                    avatar: string;
                };
            };
            itemEdit?: TypeBubblePalace;
            itemDraft?: TypeBubblePalace;
            itemError?: TypeCreatePostRequest;
        };
    };
}

const IconStar = () => (
    <AntDesign
        name="star"
        style={[styles.starTool, {color: Theme.common.orange}]}
    />
);

const IconLink = () => (
    <FontAwesome5
        name="link"
        style={[styles.starTool, {color: Theme.common.gradientTabBar1}]}
    />
);

const IconEmotion = () => (
    <MaterialCommunityIcons
        name="emoticon-lol-outline"
        style={[styles.starTool, {color: Theme.common.darkPink}]}
    />
);
const IconTag = () => (
    <AntDesign
        name="tag"
        style={[styles.starTool, {color: Theme.common.gradientTabBar2}]}
    />
);
const IconCheckIn = () => (
    <Ionicons
        name="ios-location-sharp"
        style={[styles.starTool, {color: Theme.common.commentGreen}]}
    />
);

const screenWidth = Metrics.width;
let shouldShowToolHorizontal = false;

const CreatePostPreview = ({route}: Props) => {
    const itemNew = route.params?.itemNew;
    const itemEdit = route.params?.itemEdit;
    const itemError = route.params?.itemError;
    const itemDraft = route.params?.itemDraft;
    const {t} = useTranslation();

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();
    const isLoading = Redux.getIsLoading();

    const translateXTool = useRef(new Animated.Value(0)).current;
    const scaleStars = useRef(new Animated.Value(1)).current;
    const translateXStars = useRef(new Animated.Value(0)).current;
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const starRef = useRef<Modalize>(null);
    const linkRef = useRef<ModalAddLink>(null);
    const checkInRef = useRef<ModalCheckIn>(null);
    const feelingRef = useRef<Modalize>(null);
    const topicRef = useRef<Modalize>(null);

    const initValue = useMemo(() => {
        return {
            content:
                itemEdit?.content ||
                itemError?.content ||
                itemDraft?.content ||
                '',
            images:
                itemEdit?.images ||
                itemError?.images ||
                itemDraft?.images ||
                itemNew?.images ||
                [],
            stars: itemEdit?.stars || itemError?.stars || itemDraft?.stars || 0,
            topics:
                itemEdit?.topic || itemError?.topic || itemDraft?.topic || [],
            feeling:
                itemEdit?.feeling || itemError?.feeling || itemDraft?.feeling,
            location:
                itemEdit?.location ||
                itemError?.location ||
                itemDraft?.location,
            link: itemEdit?.link || itemError?.link || itemDraft?.link,
            userReviewed:
                itemNew?.userReviewed ||
                itemEdit?.userReviewed ||
                itemDraft?.userReviewed ||
                itemError?.userReviewed ||
                undefined,
        };
    }, []);

    const [content, setContent] = useState(initValue.content);
    const [images] = useState(initValue.images);
    const [stars, setStars] = useState(initValue.stars);

    const [topics, setTopics] = useState(initValue.topics);
    const [feeling, setFeeling] = useState(initValue.feeling);
    const [location, setLocation] = useState(initValue.location);
    const [link, setLink] = useState(initValue.link);

    const onKeyBoardDidShow = (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
        if (shouldShowToolHorizontal) {
            Animated.timing(translateXTool, {
                toValue: -screenWidth,
                useNativeDriver: true,
                duration: 100,
            }).start();
        }
    };

    const onKeyboardDidHide = () => {
        Animated.timing(translateXTool, {
            toValue: 0,
            useNativeDriver: true,
            duration: 100,
        }).start();
    };

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', onKeyBoardDidShow);
        Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
        return () => {
            Keyboard.removeListener('keyboardDidShow', onKeyBoardDidShow);
            Keyboard.removeListener('keyboadDidHide', onKeyboardDidHide);
        };
    }, []);

    /**
     * Functions
     */
    const onChooseStar = useCallback(() => {
        starRef.current?.open();
    }, []);

    const onAddLink = useCallback(() => {
        shouldShowToolHorizontal = false;
        linkRef.current?.show();
    }, []);

    const onFeeling = useCallback(() => {
        feelingRef.current?.open();
    }, []);

    const onTopic = useCallback(() => {
        topicRef.current?.open();
    }, []);

    const onCheckIn = useCallback(() => {
        shouldShowToolHorizontal = false;
        checkInRef.current?.show();
    }, []);

    const onGoBack = () => {
        if (
            content !== initValue.content ||
            stars !== initValue.stars ||
            link !== initValue.link ||
            feeling !== initValue.feeling ||
            topics !== initValue.topics ||
            location !== initValue.location ||
            itemError
        ) {
            appAlertYesNo({
                i18Title: 'common.wantToDiscard',
                agreeText: 'common.discard',
                refuseText: 'common.stay',
                agreeChange: () => {
                    goBack();
                    goBack();
                },
                refuseChange: goBack,
            });
        } else {
            goBack();
        }
    };

    const onConfirmPost = async (isDraft: boolean) => {
        if (stars === 0) {
            scrollViewRef.current?.scrollToEnd();
            Vibration.vibrate();
            Animated.timing(scaleStars, {
                toValue: 1.5,
                useNativeDriver: true,
                duration: 100,
            }).start(() => {
                Animated.sequence([
                    Animated.timing(translateXStars, {
                        toValue: 10,
                        duration: 60,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateXStars, {
                        toValue: -10,
                        duration: 60,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateXStars, {
                        toValue: 10,
                        duration: 60,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateXStars, {
                        toValue: 0,
                        duration: 60,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    Animated.timing(scaleStars, {
                        toValue: 1,
                        useNativeDriver: true,
                        duration: 100,
                    }).start();
                });
            });
            return;
        }
        if (images.length === 0) {
            return;
        }

        if (!isModeExp && token) {
            const newPost: TypeCreatePostRequest = {
                content,
                images,
                stars,
                feeling,
                topic: topics,
                location,
                link,
                isDraft,
                userId: initValue.userReviewed?.id,
            };
            try {
                Redux.setPostCreatedHandling({
                    status: 'loading',
                    data: newPost,
                });
                navigate(ROOT_SCREEN.mainScreen);
                const listNameImages = await ImageUploader.upLoadManyImg(
                    newPost.images,
                    1000,
                );
                const res = await apiCreatePost({
                    ...newPost,
                    images: listNameImages,
                });
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.createNewPost,
                    payload: res.data,
                });
                Redux.setPostCreatedHandling({
                    status: 'success',
                    data: newPost,
                });
            } catch (err) {
                Redux.setPostCreatedHandling({
                    status: 'error',
                    data: {
                        ...newPost,
                        userReviewed: initValue.userReviewed,
                    },
                });
                appAlert(err);
            }
        } else {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: () => {
                    goBack();
                    onGoToSignUp();
                },
            });
        }
    };

    const onEditPost = async () => {
        const updateObject: TypeEditPostRequest = {};
        if (content !== initValue.content) {
            updateObject.content = content;
        }
        if (stars !== initValue.stars) {
            updateObject.stars = stars;
        }
        if (topics !== initValue.topics) {
            updateObject.topic = topics;
        }
        if (feeling !== initValue.feeling) {
            updateObject.feeling = feeling;
        }
        if (location !== initValue.location) {
            updateObject.location = location;
        }
        if (link !== initValue.link) {
            updateObject.link = link;
        }

        try {
            Redux.setIsLoading(true);
            if (itemEdit?.id) {
                await apiEditPost({
                    idPost: itemEdit.id,
                    data: updateObject,
                });

                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.editPostFromProfile,
                    payload: {
                        id: itemEdit.id,
                        ...updateObject,
                    },
                });
                goBack();
            } else if (itemDraft?.id) {
                updateObject.isDraft = false;
                await apiEditPost({
                    idPost: itemDraft.id,
                    data: updateObject,
                });
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.editPostFromProfile,
                    payload: {
                        id: itemDraft.id,
                        ...updateObject,
                    },
                });
                goBack();
            }
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    /**
     * Render views
     */
    const Header = () => {
        return (
            <View
                style={[
                    styles.headerView,
                    {borderBottomColor: theme.borderColor},
                ]}>
                <StyleTouchable
                    customStyle={styles.iconCloseView}
                    onPress={onGoBack}>
                    <Ionicons
                        name="chevron-back"
                        style={[styles.iconClose, {color: theme.textColor}]}
                    />
                </StyleTouchable>

                {!!initValue.userReviewed && (
                    <StyleImage
                        source={{uri: initValue.userReviewed.avatar}}
                        customStyle={styles.avatarHeader}
                    />
                )}

                {(itemNew || itemError || itemDraft) && (
                    <StyleTouchable
                        customStyle={[
                            styles.postBox,
                            {
                                borderColor: theme.highlightColor,
                            },
                        ]}
                        onPress={() => {
                            if (itemDraft) {
                                onEditPost();
                            } else {
                                onConfirmPost(false);
                            }
                        }}>
                        <StyleText
                            i18Text="profile.post.post"
                            customStyle={[
                                styles.textPost,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </StyleTouchable>
                )}

                {(itemNew || itemError) && (
                    <StyleTouchable
                        customStyle={[
                            styles.draftBox,
                            {
                                borderColor: theme.borderColor,
                            },
                        ]}
                        onPress={() => onConfirmPost(true)}>
                        <StyleText
                            i18Text="profile.post.draft"
                            customStyle={[
                                styles.textDraft,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                )}

                {itemEdit && (
                    <StyleTouchable
                        customStyle={[
                            styles.postBox,
                            {borderColor: theme.highlightColor},
                        ]}
                        onPress={onEditPost}>
                        <StyleText
                            i18Text="profile.post.edit"
                            customStyle={[
                                styles.textPost,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>
        );
    };

    const FeelingTopicLocation = () => {
        const chooseFeeling = LIST_FEELINGS.find(item => item.id === feeling);
        return (
            <View style={styles.feelingTopicLocationView}>
                {(!!chooseFeeling || !!topics.length) && (
                    <View style={styles.locationBox}>
                        {!!chooseFeeling && (
                            <StyleImage
                                source={chooseFeeling.icon}
                                customStyle={styles.iconFeeling}
                            />
                        )}
                        {topics.map(item => {
                            const chooseTopic = LIST_TOPICS.find(
                                _to => _to.id === item,
                            );
                            if (chooseTopic) {
                                return (
                                    <>
                                        <StyleText
                                            originValue="  ・  "
                                            customStyle={[
                                                styles.textTopic,
                                                {color: theme.textColor},
                                            ]}
                                        />
                                        <StyleText
                                            i18Text={chooseTopic.text}
                                            customStyle={[
                                                styles.textTopic,
                                                {color: theme.textColor},
                                            ]}
                                        />
                                    </>
                                );
                            }
                            return null;
                        })}
                    </View>
                )}
                {!!location && (
                    <View style={styles.locationBox}>
                        <Ionicons
                            name="ios-location-sharp"
                            style={[
                                styles.iconLocationCaption,
                                {color: Theme.common.commentGreen},
                            ]}
                        />
                        <StyleText
                            originValue={location}
                            customStyle={[
                                styles.textLocation,
                                {color: theme.textColor},
                            ]}
                        />
                    </View>
                )}
            </View>
        );
    };

    const ImagePreview = useMemo(() => {
        if (itemNew?.isVideo) {
            return <PreviewVideo uri={images[0]} />;
        }
        return <ScrollSyncSizeImage images={images} syncWidth={screenWidth} />;
    }, []);

    const StarLink = () => {
        const Link = () => {
            if (initValue.userReviewed) {
                return (
                    <StyleTouchable
                        customStyle={[
                            styles.linkBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={onAddLink}>
                        <StyleImage
                            source={{uri: initValue.userReviewed.avatar}}
                            customStyle={styles.iconHouseTouch}
                        />
                        <StyleText
                            originValue={initValue.userReviewed.name}
                            customStyle={styles.textNumberStar}
                        />
                    </StyleTouchable>
                );
            }
            if (link) {
                return (
                    <StyleTouchable
                        customStyle={[
                            styles.linkBox,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={onAddLink}>
                        <View style={styles.iconHouseTouch}>
                            <StyleImage
                                source={Images.icons.house}
                                customStyle={styles.iconHouse}
                            />
                        </View>
                        <StyleText
                            originValue={'See now'}
                            customStyle={styles.textNumberStar}
                        />
                    </StyleTouchable>
                );
            }
            return (
                <StyleTouchable
                    customStyle={[
                        styles.addLinkBox,
                        {borderColor: theme.textColor},
                    ]}
                    onPress={onAddLink}>
                    <AntDesign
                        name="plus"
                        style={[styles.textAddLink, {color: theme.textColor}]}
                    />
                    <StyleText
                        i18Text="profile.post.addLink"
                        customStyle={[
                            styles.textAddLink,
                            {color: theme.textColor, marginLeft: 10},
                        ]}
                    />
                </StyleTouchable>
            );
        };

        return (
            <View style={styles.starLinkView}>
                <Animated.View
                    style={[
                        styles.starBox,
                        {
                            transform: [
                                {scale: scaleStars},
                                {translateX: translateXStars},
                            ],
                            backgroundColor: theme.backgroundButtonColor,
                        },
                    ]}>
                    <StyleTouchable
                        onPress={onChooseStar}
                        customStyle={styles.starTouch}>
                        {NUMBER_STARS.map((_, index) => {
                            if (index < (stars || 0)) {
                                return (
                                    <AntDesign
                                        key={index}
                                        name="star"
                                        style={[
                                            styles.star,
                                            {color: Theme.common.orange},
                                        ]}
                                    />
                                );
                            }
                            return (
                                <AntDesign
                                    key={index}
                                    name="staro"
                                    style={[
                                        styles.star,
                                        {color: Theme.common.white},
                                    ]}
                                />
                            );
                        })}
                        <StyleText
                            originValue={stars}
                            customStyle={styles.textNumberStar}
                        />
                    </StyleTouchable>
                </Animated.View>
                {Link()}
            </View>
        );
    };

    const ToolHorizontal = () => {
        return (
            <Animated.View
                style={[
                    styles.toolHorizontalView,
                    {
                        bottom: keyboardHeight,
                        right: -screenWidth,
                        transform: [{translateX: translateXTool}],
                        backgroundColor: theme.backgroundColor,
                    },
                ]}>
                <View style={{flex: 1}} />
                <View style={styles.buttonToolBox}>
                    <StyleTouchable
                        customStyle={styles.buttonStarTool}
                        onPress={onChooseStar}>
                        {IconStar}
                    </StyleTouchable>
                    <StyleTouchable
                        customStyle={styles.buttonStarTool}
                        onPress={onAddLink}>
                        {IconLink}
                    </StyleTouchable>
                    <View
                        style={[
                            styles.divider,
                            {backgroundColor: theme.textColor},
                        ]}
                    />
                    <StyleTouchable
                        customStyle={styles.buttonStarTool}
                        onPress={onFeeling}>
                        {IconEmotion}
                    </StyleTouchable>
                    <StyleTouchable
                        customStyle={styles.buttonStarTool}
                        onPress={onTopic}>
                        {IconTag}
                    </StyleTouchable>
                    <StyleTouchable
                        customStyle={styles.buttonStarTool}
                        onPress={onCheckIn}>
                        {IconCheckIn}
                    </StyleTouchable>
                </View>
            </Animated.View>
        );
    };

    const ModalVertical = () => {
        return (
            <View
                style={[
                    styles.modalVerticalView,
                    {
                        backgroundColor: theme.backgroundColor,
                        shadowColor: theme.textColor,
                    },
                ]}>
                <ItemToolCreatePost
                    icon={IconEmotion()}
                    title="profile.post.feeling"
                    onPress={onFeeling}
                />
                <ItemToolCreatePost
                    icon={IconTag()}
                    title="profile.post.topic"
                    onPress={onTopic}
                />
                <ItemToolCreatePost
                    icon={IconCheckIn()}
                    title="profile.post.checkIn"
                    onPress={onCheckIn}
                />
            </View>
        );
    };

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            {Header()}

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}>
                {FeelingTopicLocation()}
                <View style={styles.captionView}>
                    <TextInput
                        style={[
                            styles.captionInputBox,
                            {color: theme.textHightLight},
                        ]}
                        multiline
                        placeholder={t('common.writeSomething')}
                        placeholderTextColor={theme.holderColorLighter}
                        defaultValue={initValue.content}
                        onChangeText={text => setContent(text)}
                        onFocus={() => {
                            shouldShowToolHorizontal = true;
                        }}
                    />
                </View>

                {ImagePreview}

                {StarLink()}
                {ModalVertical()}
                {isLoading && <LoadingScreen />}
            </ScrollView>

            {ToolHorizontal()}

            {/* Modalize */}
            <ModalPickStars
                ref={starRef}
                numberStars={stars}
                onChangeNumberStars={value => setStars(value)}
            />
            <ModalAddLink
                ref={linkRef}
                link={link || ''}
                onChangeLink={value => setLink(value)}
                theme={theme}
                userReviewed={initValue.userReviewed}
            />
            <ModalCheckIn
                ref={checkInRef}
                location={location || ''}
                onChangeLocation={value => setLocation(value)}
                theme={theme}
            />
            <ModalFeeling
                ref={feelingRef}
                onChangeFeeling={value => setFeeling(value)}
            />
            <ModalTopic
                ref={topicRef}
                topics={topics}
                onChangeListTopics={value => {
                    setTopics(value);
                }}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    // feelingTopicLocation
    feelingTopicLocationView: {
        width: '100%',
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
        paddingHorizontal: '10@s',
    },
    iconFeeling: {
        width: '30@ms',
        height: '30@ms',
    },
    textTopic: {
        fontSize: '13.5@ms',
        fontWeight: 'bold',
    },
    iconLocationCaption: {
        fontSize: '17@ms',
    },
    textLocation: {
        fontSize: '13.5@ms',
        fontWeight: 'bold',
        marginLeft: '2@s',
    },
    // write caption
    captionView: {
        width: '100%',
        maxHeight: '130@vs',
        marginVertical: '10@vs',
    },
    captionInputBox: {
        width: '100%',
        fontSize: '13.5@ms',
        paddingHorizontal: '15@s',
    },
    // header
    headerView: {
        width: '100%',
        paddingVertical: '5@vs',
        paddingHorizontal: '15@s',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderBottomWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    iconCloseView: {
        position: 'absolute',
        right: '10@s',
    },
    iconClose: {
        fontSize: '25@ms',
    },
    avatarHeader: {
        position: 'absolute',
        right: '50@s',
        height: '20@s',
        width: '20@s',
        borderRadius: '10@s',
    },
    postBox: {
        borderWidth: Platform.select({
            ios: '0.5@ms',
            android: '1@ms',
        }),
        paddingHorizontal: '25@s',
        paddingVertical: '3@vs',
        borderRadius: '8@ms',
    },
    textPost: {
        fontSize: '14@ms',
        fontWeight: 'bold',
    },
    draftBox: {
        borderWidth: Platform.select({
            ios: '0.5@ms',
            android: '1@ms',
        }),
        paddingHorizontal: '15@s',
        paddingVertical: '3@vs',
        borderRadius: '8@ms',
        marginRight: '10@s',
    },
    textDraft: {
        fontSize: '14@ms',
    },
    // start
    starLinkView: {
        width: '100%',
        marginVertical: '10@vs',
        paddingHorizontal: '10@s',
        flexDirection: 'row',
    },
    starBox: {
        borderRadius: '5@ms',
    },
    starTouch: {
        height: '30@ms',
        paddingHorizontal: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        fontSize: '14@ms',
        marginHorizontal: '3@s',
    },
    textNumberStar: {
        fontSize: '10@ms',
        fontWeight: 'bold',
        color: Theme.common.white,
        marginLeft: '7@s',
    },
    linkBox: {
        marginLeft: '10@s',
        height: '30@ms',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '5@ms',
        paddingHorizontal: '10@s',
    },
    linkTouch: {
        height: '30@ms',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '5@ms',
        paddingHorizontal: '10@s',
    },
    iconHouseTouch: {
        width: '20@ms',
        height: '20@ms',
        backgroundColor: Theme.common.white,
        borderRadius: '15@ms',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconHouse: {
        width: '10@ms',
        height: '10@ms',
    },
    addLinkBox: {
        marginLeft: '10@s',
        borderWidth: '1@ms',
        borderRadius: '5@ms',
        paddingHorizontal: '10@s',
        flexDirection: 'row',
        alignItems: 'center',
        height: '30@ms',
    },
    textAddLink: {
        fontSize: '12@ms',
    },
    // tool horizontal
    toolHorizontalView: {
        position: 'absolute',
        width: screenWidth,
        paddingVertical: '7@vs',
        right: -screenWidth,
        borderTopLeftRadius: '5@ms',
        borderTopRightRadius: '5@ms',
        flexDirection: 'row',
    },
    divider: {
        height: '100%',
        width: Platform.select({
            ios: '0.5@ms',
            android: '1@ms',
        }),
        marginHorizontal: '5@s',
    },
    buttonToolBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonStarTool: {
        paddingHorizontal: '5@s',
        marginHorizontal: '7@s',
    },
    starTool: {
        fontSize: '23@ms',
    },
    // modal vertical
    modalVerticalView: {
        paddingBottom: Metrics.safeBottomPadding + verticalScale(20),
        shadowOffset: {
            width: 0,
            height: -verticalScale(3),
        },
        shadowOpacity: 0.1,
    },
});

export default CreatePostPreview;
