import {useIsFocused, useRoute} from '@react-navigation/native';
import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {
    apiGetListGBJoined,
    apiGetListGbJoining,
    apiGetListPostsLiked,
    apiGetProfile,
} from 'api/module';
import {
    apiGetListGroupBuying,
    apiGetListReviewAboutUser,
    apiLikePost,
    apiUnLikePost,
} from 'api/profile';
import {ACCOUNT, POST_TYPE, REACT, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleImage, StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import LoadingIndicator from 'components/common/LoadingIndicator';
import StyleActionSheet from 'components/common/StyleActionSheet';
import ModalCommentLike from 'components/ModalCommentLike';
import StyleTabView from 'components/StyleTabView';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import ItemGroupBuying from 'feature/common/components/ItemGroupBuying';
import Bubble from 'feature/discovery/components/Bubble';
import BubbleGroupBuying, {
    ParamsLikeGB,
} from 'feature/discovery/components/BubbleGroupBuying';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import {tabBarViewHeight} from 'navigation/components/TabNavigator';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Animated,
    NativeScrollEvent,
    Platform,
    RefreshControl,
    ScrollView,
    View,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {
    fakeGroupBuying,
    isScrollCloseToBottom,
    modalizeMyProfile,
    modalizeMyProfileShop,
    onGoToSignUp,
} from 'utility/assistant';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting, {
    searchSettingHeight,
} from './components/SearchAndSetting';
import ToolMyProfile, {toolProfileHeight} from './components/ToolMyProfile';

const {width, safeBottomPadding} = Metrics;

/** ------------------------
 * Profile Enjoy
 * -------------------------
 */
const ProfileEnjoy = () => {
    const {profile} = Redux.getPassport();
    const theme = Redux.getTheme();

    const optionRef = useRef<any>(null);

    const onShowOption = () => {
        optionRef.current.show();
    };

    return (
        <>
            <ViewSafeTopPadding />
            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <SearchAndSetting
                    onShowOptions={onShowOption}
                    hasBackBtn={false}
                    hasGuideButton
                />

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <InformationProfile profile={profile} />
                    <ToolMyProfile
                        index={0}
                        onChangeTab={() => null}
                        isShopAccount={false}
                    />
                    <View style={styles.signUpBox}>
                        <StyleImage
                            customStyle={styles.imageTellSignUp}
                            source={Images.images.signUpNow}
                            resizeMode="contain"
                        />

                        <StyleTouchable
                            customStyle={[
                                styles.buttonTellSignUp,
                                {backgroundColor: theme.highlightColor},
                            ]}
                            onPress={onGoToSignUp}>
                            <StyleText
                                i18Text="profile.component.infoProfile.tellSignUp"
                                customStyle={[
                                    styles.textTellSignUp,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </StyleTouchable>
                    </View>
                </ScrollView>
            </View>

            <StyleActionSheet
                ref={optionRef}
                listTextAndAction={modalizeMyProfile}
            />
        </>
    );
};

/** ------------------------
 * Profile User
 * -------------------------
 */
const safeLoadMoreStyle: any = {
    overflow: 'hidden',
    height:
        Metrics.height -
        tabBarViewHeight -
        toolProfileHeight -
        searchSettingHeight, // check to remove this
};

let modalBubbleOption: TypeBubblePalace | TypeGroupBuying;

const onHandleLike = async (params: ParamsLikeGB, setList: any) => {
    const {isLiked, setIsLiked, totalLikes, setTotalLikes, postId} = params;
    const currentLike = isLiked;
    const currentNumberLikes = totalLikes;
    try {
        setIsLiked(!currentLike);
        setTotalLikes(currentNumberLikes + (currentLike ? -1 : 1));
        if (currentLike) {
            await apiUnLikePost({
                type: REACT.post,
                reactedId: postId,
            });
        } else {
            await apiLikePost({
                type: REACT.post,
                reactedId: postId,
            });
        }

        setList((preValue: Array<TypeGroupBuying>) => {
            return preValue.map(value => {
                if (value.id !== postId) {
                    return value;
                }
                return {
                    ...value,
                    isLiked: !currentLike,
                    totalLikes: value.totalLikes + (currentLike ? -1 : 1),
                };
            });
        });
    } catch (err) {
        setIsLiked(currentLike);
        setTotalLikes(currentNumberLikes);
        appAlert(err);
    }
};

const ProfileAccount = () => {
    const route = useRoute();
    const isFocused = useIsFocused();

    const {profile} = Redux.getPassport();
    const bubblePalaceAction = Redux.getBubblePalaceAction();
    const theme = Redux.getTheme();

    const isShopAccount = profile.account_type === ACCOUNT.shop;

    const isInTabProfile = useRef(
        route.name === PROFILE_ROUTE.myProfile,
    ).current;
    const detailGroupTarget = isInTabProfile
        ? PROFILE_ROUTE.detailGroupBuying
        : ROOT_SCREEN.detailGroupBuying;
    const checkIsFocus = useRef(true);
    const listCheckTabLazy = useRef<Array<boolean>>([
        true,
        false,
        false,
        false,
    ]);
    const modalRef = useRef<ModalCommentLike>(null);

    const myGbPaging = usePaging({
        request: apiGetListGroupBuying,
        params: {
            userId: profile.id,
        },
    });
    const postsLikedPaging = usePaging({
        request: apiGetListPostsLiked,
        isInitNotRunRequest: true,
    });
    const gbJoiningPaging = usePaging({
        request: apiGetListGbJoining,
        isInitNotRunRequest: true,
    });
    const gbJoinedPaging = usePaging({
        request: apiGetListGBJoined,
        isInitNotRunRequest: true,
    });
    const postReviewPaging = usePaging({
        request: apiGetListReviewAboutUser,
        isInitNotRunRequest: true,
        params: {
            userId: profile.id,
        },
    });

    const initIndex = useRef(isShopAccount ? 0 : 1).current;
    const numberTabs = useRef(isShopAccount ? 4 : 3).current;
    const translateXIndicator = useRef(
        new Animated.Value(initIndex * (width / numberTabs)),
    ).current;
    const optionRef = useRef<any>(null);
    const optionPostReviewRef = useRef<any>(null);
    const tabViewRef = useRef<StyleTabView>(null);
    const scrollRef = useRef<ScrollView>(null);

    const [tabIndex, setTabIndex] = useState(initIndex);
    const [postIdFocusing, setPostIdFocusing] = useState('');
    const [bubbleFocusing, setBubbleFocusing] = useState(fakeGroupBuying);
    const isFocusMyPost = tabIndex === 0;
    const isFocusPostLiked = tabIndex === 1;
    const isFocusJoinOrder = tabIndex === 2;
    const isFocusListReview = tabIndex === 3;

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.createNewGroupBuying
        ) {
            myGbPaging.setList((preValue: Array<TypeBubblePalace>) =>
                [bubblePalaceAction.payload].concat(preValue),
            );
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        } else if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.editGroupBuying
        ) {
            myGbPaging.setList((preValue: Array<TypeBubblePalace>) =>
                preValue.map(item => {
                    if (item.id !== bubblePalaceAction.payload.id) {
                        return item;
                    }
                    return {
                        ...item,
                        ...bubblePalaceAction.payload,
                    };
                }),
            );
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        } else if (
            checkIsFocus &&
            bubblePalaceAction.action ===
                TYPE_BUBBLE_PALACE_ACTION.scrollToTopMyProfile
        ) {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
            });
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        }
    }, [bubblePalaceAction]);

    useEffect(() => {
        let x: any;
        if (!isFocused) {
            checkIsFocus.current = false;
        } else {
            x = setTimeout(() => {
                checkIsFocus.current = true;
            }, 200);
        }
        return () => {
            clearTimeout(x);
        };
    }, [isFocused]);

    /**
     * Functions
     */
    const onRefreshPage = async () => {
        try {
            const res = await apiGetProfile(profile.id);
            Redux.updatePassport({
                profile: res.data,
            });

            if (isFocusMyPost) {
                myGbPaging.onRefresh();
            } else if (isFocusPostLiked) {
                postsLikedPaging.onRefresh();
            } else if (isFocusJoinOrder) {
                gbJoiningPaging.onRefresh();
                gbJoinedPaging.onRefresh();
            } else if (isFocusListReview) {
                postReviewPaging.onRefresh();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const checkScrollEnd = (nativeEvent: NativeScrollEvent) => {
        if (isScrollCloseToBottom(nativeEvent)) {
            if (isFocusMyPost) {
                myGbPaging.onLoadMore();
            } else if (isFocusPostLiked) {
                postsLikedPaging.onLoadMore();
            } else if (isFocusJoinOrder) {
                gbJoinedPaging.onLoadMore();
            } else if (isFocusListReview) {
                postReviewPaging.onLoadMore();
            }
        }
    };

    /**
     * Render views
     */
    const RenderItemMyGb = useCallback(
        (item: TypeGroupBuying) => {
            return (
                <ItemGroupBuying
                    key={item.id}
                    item={item}
                    setList={myGbPaging.setList}
                    isHorizontal={false}
                    syncWidth={width * 0.485}
                    detailGroupTarget={detailGroupTarget}
                    containerStyle={styles.itemMyGroupBuying}
                    showName={false}
                />
            );
        },
        [isShopAccount],
    );

    const RenderItemGbJoined = useCallback(
        (item: TypeGroupBuying) => {
            return (
                <BubbleGroupBuying
                    key={item.joinId}
                    item={item}
                    onGoToDetailGroupBuying={() => {
                        navigate(detailGroupTarget, {
                            item,
                            setList: gbJoinedPaging.setList,
                        });
                    }}
                    onShowMoreOption={() => null}
                    onHandleLike={params =>
                        onHandleLike(params, gbJoinedPaging.setList)
                    }
                    onShowModalComment={(post, type) => {
                        if (isInTabProfile) {
                            showCommentDiscovery({
                                post,
                                type,
                                setList: gbJoinedPaging.setList,
                            });
                        } else {
                            modalRef.current?.show({
                                post,
                                type,
                                setList: gbJoinedPaging.setList,
                            });
                        }
                    }}
                    onChangePostIdFocusing={() => null}
                    detailGroupTarget={PROFILE_ROUTE.detailGroupBuying}
                    containerWidth={width * 0.93}
                />
            );
        },
        [isShopAccount],
    );

    const RenderItemGbFavoriteJoined = useCallback(
        (item: TypeGroupBuying & TypeBubblePalace, setList: any) => {
            if (item.postType === POST_TYPE.groupBuying) {
                return (
                    <BubbleGroupBuying
                        key={item.id}
                        item={item}
                        onGoToDetailGroupBuying={() => {
                            navigate(detailGroupTarget, {
                                item,
                                setList,
                            });
                        }}
                        onShowMoreOption={() => null}
                        onHandleLike={params => onHandleLike(params, setList)}
                        onShowModalComment={(post, type) => {
                            if (isInTabProfile) {
                                showCommentDiscovery({
                                    post,
                                    type,
                                    setList,
                                });
                            } else {
                                modalRef.current?.show({
                                    post,
                                    type,
                                    setList,
                                });
                            }
                        }}
                        onChangePostIdFocusing={() => null}
                        detailGroupTarget={detailGroupTarget}
                        containerWidth={width * 0.93}
                        containerStyle={styles.itemGroupBuying}
                    />
                );
            }
            if (item.postType === POST_TYPE.review) {
                return (
                    <Bubble
                        key={item.id}
                        item={item}
                        onShowMoreOption={params => {
                            modalBubbleOption = params.postModal;
                            optionPostReviewRef.current?.show();
                        }}
                        onShowModalComment={(post, type) => {
                            if (isInTabProfile) {
                                showCommentDiscovery({
                                    post,
                                    type,
                                    setList: postReviewPaging.setList,
                                });
                            } else {
                                modalRef.current?.show({
                                    post,
                                    type,
                                    setList: postReviewPaging.setList,
                                });
                            }
                        }}
                        isFocusing={item.id === postIdFocusing}
                        onChangePostIdFocusing={postId =>
                            setPostIdFocusing(postId)
                        }
                        containerWidth={width * 0.93}
                    />
                );
            }
            return null;
        },
        [isShopAccount],
    );

    const RenderItemGbJoining = useCallback(
        (item: TypeGroupBuying, setList: any) => {
            if (item.postType === POST_TYPE.groupBuying) {
                return (
                    <ItemGroupBuying
                        key={item.id}
                        item={item}
                        setList={setList}
                        isHorizontal={false}
                        syncWidth={width * 0.43}
                        detailGroupTarget={detailGroupTarget}
                        containerStyle={styles.itemJoiningContainer}
                    />
                );
            }
            return null;
        },
        [isShopAccount],
    );

    const RenderItemReview = useCallback(
        (item: TypeBubblePalace) => {
            return (
                <Bubble
                    key={item.id}
                    item={item}
                    onShowMoreOption={params => {
                        modalBubbleOption = params.postModal;
                        optionPostReviewRef.current?.show();
                    }}
                    onShowModalComment={(post, type) => {
                        if (isInTabProfile) {
                            showCommentDiscovery({
                                post,
                                type,
                                setList: postReviewPaging.setList,
                            });
                        } else {
                            modalRef.current?.show({
                                post,
                                type,
                                setList: postReviewPaging.setList,
                            });
                        }
                    }}
                    isFocusing={item.id === postIdFocusing}
                    onChangePostIdFocusing={postId => setPostIdFocusing(postId)}
                    containerWidth={width * 0.93}
                />
            );
        },
        [postIdFocusing],
    );

    return (
        <>
            <ViewSafeTopPadding />

            <View style={{flex: 1, backgroundColor: theme.backgroundColor}}>
                <SearchAndSetting
                    onShowOptions={() => optionRef.current.show()}
                    hasBackBtn={!isInTabProfile}
                    hasGuideButton={isInTabProfile}
                />
                <ScrollView
                    ref={scrollRef}
                    stickyHeaderIndices={[1]}
                    onMomentumScrollEnd={({nativeEvent}) => {
                        checkScrollEnd(nativeEvent);
                    }}
                    directionalLockEnabled
                    refreshControl={
                        <RefreshControl
                            refreshing={!!myGbPaging.refreshing}
                            onRefresh={onRefreshPage}
                            tintColor={theme.highlightColor}
                            colors={[theme.highlightColor]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: isInTabProfile ? 0 : safeBottomPadding,
                    }}>
                    <InformationProfile profile={profile} />
                    <>
                        <ToolMyProfile
                            index={tabIndex}
                            onChangeTab={index => {
                                setTabIndex(index);
                                tabViewRef.current?.navigateToIndex(index);
                            }}
                            isShopAccount={isShopAccount}
                        />
                        <View
                            style={[
                                styles.indicatorView,
                                {backgroundColor: theme.backgroundColor},
                            ]}>
                            <Animated.View
                                style={[
                                    styles.indicator,
                                    {
                                        flex: 1 / numberTabs,
                                        transform: [
                                            {translateX: translateXIndicator},
                                        ],
                                    },
                                ]}>
                                <View
                                    style={[
                                        styles.indicatorIn,
                                        {
                                            borderTopColor: theme.borderColor,
                                        },
                                    ]}
                                />
                            </Animated.View>
                        </View>
                    </>

                    <StyleTabView
                        ref={tabViewRef}
                        onFirstNavigateToIndex={index => {
                            listCheckTabLazy.current[index] = true;
                            if (index === 1) {
                                postsLikedPaging.onLoadMore();
                            } else if (index === 2) {
                                gbJoiningPaging.onLoadMore();
                                gbJoinedPaging.onLoadMore();
                            } else if (index === 3) {
                                if (isShopAccount) {
                                    postReviewPaging.onLoadMore();
                                }
                            }
                        }}
                        initIndex={initIndex}
                        onScroll={e => {
                            translateXIndicator.setValue(e.position * width);
                            if (e.index !== tabIndex) {
                                setTabIndex(e.index);
                            }
                        }}>
                        <View
                            style={[
                                styles.contentContainerPost,
                                isFocusMyPost ? {} : safeLoadMoreStyle,
                                {
                                    justifyContent: isShopAccount
                                        ? 'space-between'
                                        : 'center',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                },
                            ]}>
                            {myGbPaging.list.map(RenderItemMyGb)}
                            {myGbPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>

                        <View
                            style={[
                                styles.contentContainerPost,
                                isFocusPostLiked ? {} : safeLoadMoreStyle,
                            ]}>
                            {postsLikedPaging.list.map(item =>
                                RenderItemGbFavoriteJoined(
                                    item,
                                    postsLikedPaging.setList,
                                ),
                            )}
                            {postsLikedPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>

                        <View
                            style={[
                                styles.contentContainerPost,
                                isFocusJoinOrder ? {} : safeLoadMoreStyle,
                                {
                                    flexDirection: 'column',
                                },
                            ]}>
                            <View style={{width: '100%'}}>
                                <StyleText
                                    i18Text="profile.joining"
                                    customStyle={[
                                        styles.textJoining,
                                        {color: theme.borderColor},
                                    ]}
                                />
                                <StyleList
                                    onTouchStart={() =>
                                        tabViewRef.current?.disableTouchable()
                                    }
                                    onTouchEnd={() =>
                                        tabViewRef.current?.enableTouchable()
                                    }
                                    horizontal
                                    data={gbJoiningPaging.list}
                                    renderItem={({item}) =>
                                        RenderItemGbJoining(
                                            item,
                                            gbJoiningPaging.setList,
                                        )
                                    }
                                    keyExtractor={item => item?.joinId}
                                    directionalLockEnabled
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={() => null}
                                />
                            </View>

                            <StyleText
                                i18Text="profile.joinedSuccess"
                                customStyle={[
                                    styles.textJoinedSuccess,
                                    {
                                        color: theme.borderColor,
                                        alignSelf: 'flex-start',
                                    },
                                ]}
                            />
                            {gbJoinedPaging.list.map(item =>
                                RenderItemGbJoined(item),
                            )}
                            {gbJoinedPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>

                        {isShopAccount && (
                            <View
                                style={[
                                    styles.contentContainerPost,
                                    isFocusListReview ? {} : safeLoadMoreStyle,
                                ]}>
                                {postReviewPaging.list.map(item =>
                                    RenderItemReview(item),
                                )}
                                {postReviewPaging.loading && (
                                    <LoadingIndicator
                                        color={theme.textHightLight}
                                    />
                                )}
                            </View>
                        )}
                    </StyleTabView>
                </ScrollView>

                <StyleActionSheet
                    ref={optionRef}
                    listTextAndAction={
                        isShopAccount
                            ? modalizeMyProfileShop
                            : modalizeMyProfile
                    }
                />

                <StyleActionSheet
                    ref={optionPostReviewRef}
                    listTextAndAction={[
                        {
                            text: 'discovery.report.title',
                            action: () => {
                                if (modalBubbleOption) {
                                    navigate(ROOT_SCREEN.reportUser, {
                                        idUser: modalBubbleOption.creator,
                                        nameUser: modalBubbleOption.creatorName,
                                    });
                                }
                            },
                        },
                        {
                            text: 'common.cancel',
                            action: () => null,
                        },
                    ]}
                />
            </View>

            <ModalCommentLike
                ref={modalRef}
                theme={theme}
                bubbleFocusing={bubbleFocusing}
                updateBubbleFocusing={value =>
                    setBubbleFocusing((preValue: any) => ({
                        ...preValue,
                        ...value,
                    }))
                }
                setTotalComments={value => {
                    setBubbleFocusing(preValue => {
                        if (preValue) {
                            return {
                                ...preValue,
                                totalComments: value,
                            };
                        }
                        return preValue;
                    });
                }}
                increaseTotalComments={value => {
                    setBubbleFocusing(preValue => {
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
        </>
    );
};

/**
 * BOSS HERE
 */
const MyProfile = () => {
    const isModeExp = Redux.getModeExp();
    const token = Redux.getToken();

    if (!isModeExp && token) {
        return <ProfileAccount />;
    }
    return <ProfileEnjoy />;
};

const styles = ScaledSheet.create({
    contentContainer: {
        paddingBottom: '100@vs',
        flexGrow: 1,
    },
    signUpBox: {
        width: '100%',
        height: '100@s',
        marginTop: '20@vs',
    },
    imageTellSignUp: {
        position: 'absolute',
        right: '30@s',
        width: '100@s',
        height: '100@s',
    },
    buttonTellSignUp: {
        position: 'absolute',
        right: '140@s',
        top: '50@s',
        paddingHorizontal: '30@vs',
        paddingVertical: '8@vs',
        borderRadius: '50@vs',
    },
    textTellSignUp: {
        fontSize: '15@ms',
    },
    contentContainerPost: {
        width,
        alignItems: 'center',
        paddingHorizontal: '2@s',
    },
    itemPostView: {
        marginHorizontal: '0.25@ms',
    },
    // input
    inputCommentView: {
        paddingBottom: '14@vs',
    },
    // indicator
    indicatorView: {
        width: '100%',
        flexDirection: 'row',
    },
    indicator: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    indicatorIn: {
        width: '60%',
        borderTopWidth: Platform.select({
            ios: '1.5@ms',
            android: '2@ms',
        }),
    },
    itemJoiningContainer: {
        marginLeft: '10@s',
        marginRight: '5@s',
        marginTop: 0,
    },
    textJoining: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        marginLeft: '20@s',
        marginTop: '5@vs',
        marginBottom: '10@vs',
    },
    textJoinedSuccess: {
        fontSize: FONT_SIZE.big,
        fontWeight: 'bold',
        marginLeft: '20@s',
        marginTop: '15@vs',
        marginBottom: '0@vs',
    },
    itemMyGroupBuying: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: '7@vs',
    },
    itemGroupBuying: {
        marginBottom: '20@vs',
    },
});

export default MyProfile;
