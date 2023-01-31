import {
    TypeBubblePalace,
    TypeGetProfileResponse,
    TypeGroupBuying,
} from 'api/interface';
import {
    apiBlockUser,
    apiFollowUser,
    apiGetProfile,
    apiUnFollowUser,
} from 'api/module';
import {apiGetListGroupBuying, apiGetListReviewAboutUser} from 'api/profile';
import {ACCOUNT, POST_TYPE, RELATIONSHIP} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import {FONT_SIZE} from 'asset/standardValue';
import {StyleText, StyleTouchable} from 'components/base';
import LoadingIndicator from 'components/common/LoadingIndicator';
import NoData from 'components/common/NoData';
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import ModalCommentLike from 'components/ModalCommentLike';
import StyleTabView from 'components/StyleTabView';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import ItemGroupBuying from 'feature/common/components/ItemGroupBuying';
import Bubble from 'feature/discovery/components/Bubble';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN from 'navigation/config/routes';
import {appAlert, navigate} from 'navigation/NavigationService';
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
    fakeBubbleFocusing,
    interactBubble,
    isScrollCloseToBottom,
} from 'utility/assistant';
import AvatarBackground from './components/AvatarBackground';
import InformationProfile from './components/InformationProfile';
import SearchAndSetting from './components/SearchAndSetting';
import ToolOtherProfile from './components/ToolOtherProfile';

interface Props {
    route: {
        params: {
            id: number;
            onGoBack(): void;
            seeReviewFirst?: boolean;
        };
        [key: string]: any;
    };
}

const {width} = Metrics;

let modalBubbleOption: TypeBubblePalace | TypeGroupBuying;

const onBlockUser = async (userId: number) => {
    try {
        await apiBlockUser(userId);
    } catch (err) {
        appAlert(err);
    }
};
const onReport = async (userId: number, userName: string) => {
    navigate(ROOT_SCREEN.reportUser, {
        idUser: userId,
        nameUser: userName,
    });
};

const onSendMessage = (profile: any) => {
    if (profile) {
        interactBubble({
            userId: profile.id,
            name: profile.name,
            avatar: profile.avatar,
        });
    }
};

const OtherProfile = ({route}: Props) => {
    const {id, onGoBack} = route.params;
    const seeReviewFirst = useRef(route.params?.seeReviewFirst).current;
    const initIndex = useRef(seeReviewFirst ? 1 : 0).current;
    const shouldRenderOtherProfile = Redux.getShouldRenderOtherProfile();

    const theme = Redux.getTheme();
    const isLoading = Redux.getIsLoading();

    const modalRef = useRef<ModalCommentLike>(null);
    const optionsRef = useRef<any>(null);
    const optionPostReviewRef = useRef<any>(null);
    const tabViewRef = useRef<StyleTabView>(null);
    const translateXIndicator = useRef(
        new Animated.Value(initIndex * (width / 2)),
    ).current;

    const [profile, setProfile] = useState<TypeGetProfileResponse>();
    const [isFollowing, setIsFollowing] = useState(false);
    const [bubbleFocusing, setBubbleFocusing] =
        useState<TypeBubblePalace>(fakeBubbleFocusing);
    const [tabIndex, setTabIndex] = useState(initIndex);
    const [postIdFocusing, setPostIdFocusing] = useState('');

    const isBlock = profile?.relationship === RELATIONSHIP.block;
    const isShopAccount = profile?.account_type === ACCOUNT.shop;
    const isFocusListPost = tabIndex === 0;
    const isFocusPostReviewed = tabIndex === 1;

    const listPostsPaging = usePaging({
        request: apiGetListGroupBuying,
        params: {
            userId: id,
        },
    });
    const listPostsReviewAbout = usePaging({
        request: apiGetListReviewAboutUser,
        params: {
            userId: id,
        },
        isInitNotRunRequest: !isShopAccount,
    });

    const getData = async () => {
        try {
            Redux.setIsLoading(true);
            const res = await apiGetProfile(id);
            setIsFollowing(res.data.relationship === RELATIONSHIP.following);
            setProfile(res.data);
        } catch (err) {
            appAlert(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    useEffect(() => {
        getData();
    }, [shouldRenderOtherProfile]);

    const onHandleFollow = async () => {
        if (profile) {
            const currentFollow = isFollowing;
            const currentFollowers = profile.followers;
            try {
                setIsFollowing(!currentFollow);
                setProfile({
                    ...profile,
                    followers: currentFollowers + (currentFollow ? -1 : 1),
                });
                if (currentFollow) {
                    await apiUnFollowUser(id);
                } else {
                    await apiFollowUser(id);
                }
            } catch (err) {
                setIsFollowing(currentFollow);
                setProfile({
                    ...profile,
                    followers: currentFollowers,
                });
                appAlert(err);
            }
        }
    };

    const onShowOption = () => {
        if (isBlock) {
            return;
        }
        optionsRef.current?.show();
    };

    const onRefreshPage = async () => {
        try {
            const res = await apiGetProfile(id);
            setIsFollowing(res.data.relationship === RELATIONSHIP.following);
            setProfile(res.data);

            if (isFocusListPost) {
                listPostsPaging.onRefresh();
            } else if (isFocusPostReviewed) {
                listPostsReviewAbout.onRefresh();
            }
        } catch (err) {
            appAlert(err);
        }
    };

    const checkScrollEnd = (nativeEvent: NativeScrollEvent) => {
        if (isScrollCloseToBottom(nativeEvent)) {
            if (isFocusListPost) {
                listPostsPaging.onLoadMore();
            }
        }
    };

    /**
     * Render_view
     */
    const RenderItemMyGb = useCallback(
        (item: TypeGroupBuying) => {
            return (
                <ItemGroupBuying
                    key={item.id}
                    item={item}
                    setList={listPostsPaging.setList}
                    isHorizontal={false}
                    syncWidth={width * 0.485}
                    detailGroupTarget={ROOT_SCREEN.detailGroupBuying}
                    showName={false}
                    containerStyle={styles.itemMyGroupBuying}
                />
            );
        },
        [isShopAccount],
    );

    const RenderItemReview = useCallback(
        (item: TypeBubblePalace) => {
            if (item.postType === POST_TYPE.review) {
                return (
                    <Bubble
                        key={item.id}
                        item={item}
                        onShowMoreOption={params => {
                            modalBubbleOption = params.postModal;
                            optionPostReviewRef.current.show();
                        }}
                        onShowModalComment={(post, type) =>
                            modalRef.current?.show({
                                post,
                                type,
                            })
                        }
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
        [isShopAccount, postIdFocusing],
    );

    if (isBlock) {
        return (
            <>
                <AvatarBackground avatar={profile?.avatar || ''} />
                <View
                    style={[
                        styles.overlayView,
                        {backgroundColor: theme.backgroundColor},
                    ]}
                />
                <ViewSafeTopPadding />
                <SearchAndSetting
                    onShowOptions={onShowOption}
                    hasSettingBtn={false}
                    onGoBack={onGoBack}
                />
                <NoData content="No Data" />
            </>
        );
    }

    const Header = () => {
        return (
            <>
                {!!profile && <InformationProfile profile={profile} />}
                <View
                    style={[
                        styles.btnInteractView,
                        {
                            backgroundColor: theme.backgroundColor,
                            borderBottomColor: theme.holderColor,
                        },
                    ]}>
                    <StyleTouchable
                        customStyle={[
                            styles.buttonInteract,
                            {
                                backgroundColor: theme.backgroundButtonColor,
                                flex: isFollowing ? 0.6 : 1.5,
                            },
                        ]}
                        onPress={onHandleFollow}
                        disable={isFollowing}
                        disableOpacity={1}>
                        <StyleText
                            i18Text={
                                isFollowing
                                    ? 'profile.component.infoProfile.following'
                                    : 'profile.screen.follow'
                            }
                            customStyle={[
                                styles.textInteract,
                                {
                                    color: isFollowing
                                        ? theme.textColor
                                        : theme.highlightColor,
                                    fontWeight: 'bold',
                                },
                            ]}
                        />
                    </StyleTouchable>

                    <StyleTouchable
                        customStyle={[
                            styles.buttonInteract,
                            {
                                backgroundColor: theme.backgroundButtonColor,
                            },
                        ]}
                        onPress={() => onSendMessage(profile)}>
                        <StyleText
                            i18Text="profile.screen.sendMessage"
                            customStyle={[
                                styles.textInteract,
                                {
                                    color: theme.textHightLight,
                                },
                            ]}
                        />
                    </StyleTouchable>
                </View>
            </>
        );
    };

    const Indicator = () => {
        return (
            <View
                style={[
                    styles.indicatorView,
                    {backgroundColor: theme.backgroundColor},
                ]}>
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            flex: 1 / 2,
                            transform: [{translateX: translateXIndicator}],
                        },
                    ]}>
                    <View
                        style={[
                            styles.indicatorIn,
                            {borderTopColor: theme.borderColor},
                        ]}
                    />
                </Animated.View>
            </View>
        );
    };

    return (
        <>
            <View
                style={[
                    styles.overlayView,
                    {backgroundColor: theme.backgroundColor},
                ]}
            />
            <ViewSafeTopPadding />

            <SearchAndSetting
                onShowOptions={onShowOption}
                hasSettingBtn={false}
                onGoBack={onGoBack}
            />

            <View style={{flex: 1}}>
                <ScrollView
                    onMomentumScrollEnd={({nativeEvent}) => {
                        checkScrollEnd(nativeEvent);
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={!!listPostsPaging.refreshing}
                            onRefresh={onRefreshPage}
                            tintColor={theme.highlightColor}
                            colors={[theme.highlightColor]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.contentContainer}
                    stickyHeaderIndices={[1]}>
                    {Header()}
                    <>
                        <ToolOtherProfile
                            index={tabIndex}
                            onChangeTab={index => {
                                setTabIndex(index);
                                tabViewRef.current?.navigateToIndex(index);
                            }}
                        />
                        {Indicator()}
                    </>

                    <StyleTabView
                        ref={tabViewRef}
                        onFirstNavigateToIndex={index => {
                            if (
                                (index === 1 && isShopAccount) ||
                                seeReviewFirst
                            ) {
                                listPostsReviewAbout.onLoadMore();
                            }
                        }}
                        onScroll={e => {
                            translateXIndicator.setValue(e.position * width);
                            if (e.index !== tabIndex) {
                                setTabIndex(e.index);
                            }
                        }}
                        initIndex={initIndex}>
                        <View style={styles.tabView}>
                            {listPostsPaging.list.map(item =>
                                RenderItemMyGb(item),
                            )}
                            {listPostsPaging.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>

                        <View style={styles.tabReview}>
                            {isShopAccount &&
                                listPostsReviewAbout.list.map(item =>
                                    RenderItemReview(item),
                                )}
                            {isShopAccount && listPostsReviewAbout.loading && (
                                <LoadingIndicator
                                    color={theme.textHightLight}
                                />
                            )}
                        </View>
                    </StyleTabView>
                </ScrollView>

                {isLoading && <LoadingScreen />}
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

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={[
                    {
                        text: isFollowing
                            ? 'profile.screen.unFollow'
                            : 'profile.screen.follow',
                        action: onHandleFollow,
                    },
                    {
                        text: 'profile.modalize.block',
                        action: () => onBlockUser(id),
                    },
                    {
                        text: 'profile.modalize.report',
                        action: () => onReport(id, profile?.name || ' '),
                    },
                    {
                        text: 'common.cancel',
                        action: () => null,
                    },
                ]}
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
        </>
    );
};

const styles = ScaledSheet.create({
    body: {
        flexGrow: 1,
        alignContent: 'center',
    },
    overlayView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.75,
    },
    contentContainer: {
        paddingBottom: Metrics.safeBottomPadding,
    },
    postStatusView: {
        marginHorizontal: '0.25@ms',
    },
    buttonActivityBox: {
        width: '100%',
        flexDirection: 'row',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonActivity: {
        width: '35@s',
        height: '35@s',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10@s',
        marginTop: '30@vs',
    },
    iconButtonActivity: {
        fontSize: '30@ms',
    },
    // Button edit profile
    btnInteractView: {
        width: '100%',
        paddingHorizontal: '20@s',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: '10@vs',
        borderBottomWidth: Platform.select({
            ios: '0.5@ms',
            android: '0.5@ms',
        }),
        marginTop: '10@vs',
    },
    buttonInteract: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '3@vs',
        paddingVertical: '6@vs',
        marginHorizontal: '3@s',
    },
    textInteract: {
        fontSize: FONT_SIZE.small,
    },
    // indicator
    indicatorView: {
        width: '100%',
        flexDirection: 'row',
    },
    indicator: {
        flex: 1 / 2,
        alignItems: 'center',
    },
    indicatorIn: {
        width: '40%',
        borderTopWidth: Platform.select({
            ios: '1.5@ms',
            android: '2@ms',
        }),
    },
    // content
    tabView: {
        width,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: '2@s',
        justifyContent: 'space-between',
    },
    tabReview: {
        width,
        alignItems: 'center',
    },
    itemMyGroupBuying: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: '7@vs',
    },
});

export default OtherProfile;
