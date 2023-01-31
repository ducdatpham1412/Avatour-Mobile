/* eslint-disable react-hooks/rules-of-hooks */
import {BlurView} from '@react-native-community/blur';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
    apiGetListGroupPeopleJoin,
    apiGetListPeopleRetail,
    apiJoinGroupBuying,
} from 'api/discovery';
import {TypeGroupBuying} from 'api/interface';
import {
    TypeJoinGroupBookingRequest,
    TypePeopleJoinedResponse,
    TypeShowModalCommentOrLike,
} from 'api/interface/discovery';
import {apiGetDetailBubble} from 'api/module';
import {
    apiCreateErrorLog,
    apiDeleteGroupBooking,
    apiLikePost,
    apiUnLikePost,
} from 'api/profile';
import {
    GROUP_BUYING_STATUS,
    REACT,
    RELATIONSHIP,
    STATUS,
    TYPE_BUBBLE_PALACE_ACTION,
    TYPE_DYNAMIC_LINK,
} from 'asset/enum';
import Images from 'asset/img/images';
import {Metrics} from 'asset/metrics';
import {
    ANDROID_APP_LINK,
    DYNAMIC_LINK_ANDROID,
    DYNAMIC_LINK_IOS,
    DYNAMIC_LINK_SHARE,
    FONT_SIZE,
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
import StyleActionSheet from 'components/common/StyleActionSheet';
import LoadingScreen from 'components/LoadingScreen';
import ModalCommentLike from 'components/ModalCommentLike';
import ModalConfirmJoinGb from 'feature/common/components/ModalConfirmJoinGb';
import UpdatePriceStatus from 'feature/common/components/UpdatePriceStatus';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Platform,
    RefreshControl,
    ScrollView,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Modalize} from 'react-native-modalize';
import Share from 'react-native-share';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import appPurchase from 'utility/appPurchase';
import {
    borderWidthTiny,
    chosenBlurType,
    fakeGroupBuying,
    isIOS,
    logger,
    modeExpUsePaging,
    onGoToProfile,
    onGoToSignUp,
} from 'utility/assistant';
import {formatFromNow, formatLocaleNumber} from 'utility/format';
import {I18Normalize} from 'utility/I18Next';
import {fakeDataListGroupsJoined} from 'utility/staticData';
import ModalPeopleJoined from './components/ModalPeopleJoined';
import ModalPeopleRetail from './components/ModalPeopleRetail';

interface Props {
    route: {
        params: {
            item?: TypeGroupBuying;
            itemId?: string;
            setList?: any;
            isFromTopGroupBuying?: boolean;
        };
        [key: string]: any;
    };
}

interface ParamsInformation {
    title: I18Normalize;
    icon: any;
    titleColor: string;
    titleStyle?: StyleProp<TextStyle>;
}

const onHandleLike = async (params: {
    isModeExp: boolean;
    isLiked: boolean;
    setIsLiked: Function;
    totalLikes: number;
    setTotalLikes: Function;
    postId: string;
    setList: any;
}) => {
    const {
        isModeExp,
        isLiked,
        setIsLiked,
        totalLikes,
        setTotalLikes,
        postId,
        setList,
    } = params;

    if (!isModeExp) {
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
            if (setList) {
                setList((preValue: Array<TypeGroupBuying>) => {
                    return preValue.map(value => {
                        if (value.id !== postId) {
                            return value;
                        }
                        return {
                            ...value,
                            isLiked: !currentLike,
                            totalLikes:
                                value.totalLikes + (currentLike ? -1 : 1),
                        };
                    });
                });
            }
        } catch (err) {
            setIsLiked(currentLike);
            setTotalLikes(currentNumberLikes);
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

const TitleInformation = (props: ParamsInformation) => {
    const {icon, title, titleColor, titleStyle} = props;
    return (
        <View style={styles.informationView}>
            <StyleIcon source={icon} size={18} />
            <StyleText
                i18Text={title}
                customStyle={[
                    styles.titleInformation,
                    {color: titleColor},
                    titleStyle,
                ]}
            />
        </View>
    );
};

const CustomBlurView = () => {
    if (isIOS) {
        return (
            <BlurView
                style={StyleSheet.absoluteFill}
                blurType={chosenBlurType}
                blurAmount={3}
                blurRadius={20}
            />
        );
    }
    return (
        <View
            style={[
                StyleSheet.absoluteFill,
                {
                    backgroundColor: Theme.darkTheme.backgroundOpacity(0.6),
                },
            ]}
        />
    );
};

const onShowModalShare = async (
    item: TypeGroupBuying,
    setDisableShare: Function,
) => {
    try {
        setDisableShare(true);
        const link = await dynamicLinks().buildShortLink({
            link: `${item?.images?.[0] || LANDING_PAGE_URL}?type=${
                TYPE_DYNAMIC_LINK.groupBuying
            }&post_id=${item.id}`,
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
            message: 'Doffy share\n',
            url: link,
        });
    } catch (err) {
        appAlert(err);
    } finally {
        setDisableShare(false);
    }
};

const {width} = Metrics;

const DetailGroupBuying = ({route}: Props) => {
    const setList = useRef(route.params?.setList).current;
    const isInRoot = useRef(
        route.name === ROOT_SCREEN.detailGroupBuying,
    ).current;

    const theme = Redux.getTheme();
    const isModeExp = Redux.getModeExp();
    const isLoading = Redux.getIsLoading();
    const bubblePalaceAction = Redux.getBubblePalaceAction();
    const {listPurchases} = Redux.getResource();
    const bubbleFocusing = Redux.getBubbleFocusing();

    const modalOptionRef = useRef<any>(null);
    const modalJoinedRef = useRef<Modalize>(null);
    const modalPersonalRef = useRef<Modalize>(null);
    const modalCommentLikeRef = useRef<ModalCommentLike>(null);
    const [load, setLoad] = useState(false);
    const [item, setItem] = useState(route.params?.item || fakeGroupBuying);

    const listGroupsJoinPaging = !isModeExp
        ? usePaging({
              request: apiGetListGroupPeopleJoin,
              params: {
                  postId: item.id || route.params?.itemId,
                  take: 10,
              },
          })
        : modeExpUsePaging();

    const listJoinPersonalPaging = !isModeExp
        ? usePaging({
              request: apiGetListPeopleRetail,
              params: {
                  postId: item.id || route.params?.itemId,
                  take: 10,
              },
              isInitNotRunRequest: true,
          })
        : modeExpUsePaging();

    const {requestPurchase} = appPurchase({
        skus: listPurchases.map(purchase => purchase.product_id),
    });

    const [isLiked, setIsLiked] = useState(item.isLiked);
    const [totalLikes, setTotalLikes] = useState(item.totalLikes);
    const [disableShare, setDisableShare] = useState(false);

    const isMyBubble = item.relationship === RELATIONSHIP.self;
    const isTemporarilyClose = item.status === STATUS.temporarilyClose;

    const listOptions = useCallback((): Array<{
        text: I18Normalize;
        action(): void;
    }> => {
        if (!isMyBubble) {
            return [
                {
                    text: 'discovery.historyEdit',
                    action: () =>
                        navigate(ROOT_SCREEN.editHistory, {
                            postId: item.id,
                        }),
                },
                {
                    text: 'common.cancel',
                    action: () => null,
                },
            ];
        }
        return [
            {
                text: 'profile.post.edit',
                action: () =>
                    navigate(PROFILE_ROUTE.createGroupBuying, {
                        itemEdit: item,
                    }),
            },
            {
                text: 'profile.post.delete',
                action: () => onDeleteGroupBuying(),
            },
            {
                text: 'discovery.historyEdit',
                action: () =>
                    navigate(ROOT_SCREEN.editHistory, {
                        postId: item.id,
                    }),
            },
            {
                text: 'common.cancel',
                action: () => null,
            },
        ];
    }, [isMyBubble, item.id]);

    const onRefresh = async () => {
        if (item) {
            try {
                setLoad(true);
                const res = await apiGetDetailBubble(item.id);
                const {data} = res;
                if (setList) {
                    setList((preValue: Array<TypeGroupBuying>) => {
                        return preValue.map((gb: TypeGroupBuying) => {
                            if (gb.id !== data.id) {
                                return gb;
                            }
                            return data;
                        });
                    });
                }
                setItem(data);
                setIsLiked(data.isLiked);
                setTotalLikes(data.totalLikes);
                listGroupsJoinPaging.onRefresh();
            } catch (err) {
                appAlert(err);
            } finally {
                setLoad(false);
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            if (isModeExp) {
                return;
            }
            if (route.params.itemId) {
                try {
                    setLoad(true);
                    const res = await apiGetDetailBubble(route.params.itemId);
                    const {data} = res;
                    if (setList) {
                        setList((preValue: Array<TypeGroupBuying>) => {
                            return preValue.map((gb: TypeGroupBuying) => {
                                if (gb.id !== data.id) {
                                    return gb;
                                }
                                return data;
                            });
                        });
                    }
                    setItem(data);
                    setIsLiked(data.isLiked);
                    setTotalLikes(data.totalLikes);
                    if (!isInRoot) {
                        Redux.updateBubbleFocusing(data);
                    }
                } catch (err) {
                    appAlert(err);
                } finally {
                    setLoad(false);
                }
            } else {
                Redux.updateBubbleFocusing(item);
            }
        };
        getData();
    }, [isModeExp]);

    useEffect(() => {
        if (isMyBubble) {
            listJoinPersonalPaging.onLoadMore();
        }
    }, [isMyBubble]);

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.editGroupBuying
        ) {
            if (bubblePalaceAction.payload.id === item.id) {
                setItem(preValue => {
                    return {
                        ...preValue,
                        ...bubblePalaceAction.payload,
                    };
                });
                Redux.setBubblePalaceAction({
                    action: TYPE_BUBBLE_PALACE_ACTION.null,
                    payload: null,
                });
                if (setList) {
                    setList((preValue: Array<TypeGroupBuying>) => {
                        return preValue.map((gb: TypeGroupBuying) => {
                            if (gb.id !== bubblePalaceAction.payload.id) {
                                return gb;
                            }
                            return {
                                ...gb,
                                ...bubblePalaceAction.payload,
                            };
                        });
                    });
                }
            }
        }
    }, [bubblePalaceAction, item.id]);

    const onShowModalComment = (type: TypeShowModalCommentOrLike) => {
        if (isModeExp) {
            appAlert('discovery.bubble.goToSignUp', {
                moreNotice: 'common.letGo',
                moreAction: () => {
                    goBack();
                    onGoToSignUp();
                },
            });
        } else if (isInRoot) {
            modalCommentLikeRef.current?.show({
                post: item,
                type,
                setList,
            });
        } else {
            showCommentDiscovery({
                post: item,
                type,
                setList,
            });
        }
    };

    const onJoinGroupBuying = async (params: TypeJoinGroupBookingRequest) => {
        if (isModeExp || item.status !== GROUP_BUYING_STATUS.notJoined) {
            return;
        }

        try {
            Redux.setIsLoading(true);
            await requestPurchase(params.productId);

            try {
                await apiJoinGroupBuying({
                    ...params,
                    postId: item.id,
                });
                onRefresh();
                modalConfirmJoin.hideModal();
            } catch (err) {
                await apiCreateErrorLog(
                    `Error when deposit, gb: ${item.id}, money: ${params.money}`,
                );
                appAlert(err);
            }
        } catch (err) {
            logger(err);
        } finally {
            Redux.setIsLoading(false);
        }
    };

    const onDeleteGroupBuying = useCallback(() => {
        const agreeDelete = async () => {
            try {
                Redux.setIsLoading(true);
                goBack();
                await apiDeleteGroupBooking(item.id);
                setItem(preValue => ({
                    ...preValue,
                    postStatus: STATUS.requestingDelete,
                }));
                if (setList) {
                    setList((preValue: Array<TypeGroupBuying>) => {
                        return preValue.map(gb => {
                            if (gb.id !== item.id) {
                                return gb;
                            }
                            return {
                                ...gb,
                                postStatus: STATUS.requestingDelete,
                            };
                        });
                    });
                }
            } catch (err) {
                appAlert(err);
            } finally {
                Redux.setIsLoading(false);
            }
        };

        appAlertYesNo({
            i18Title: 'profile.post.sureDeletePost',
            agreeChange: () => agreeDelete(),
            refuseChange: () => goBack(),
        });
    }, [item.id]);

    /**
     * Render views
     */
    const Information = () => {
        let textPostStatus: I18Normalize = 'common.null';
        let colorTextPostStatus = theme.textHightLight;
        if (item.postStatus === STATUS.active) {
            textPostStatus = 'discovery.available';
        } else if (
            item.postStatus === STATUS.temporarilyClose ||
            item.postStatus === STATUS.requestingDelete
        ) {
            textPostStatus = 'discovery.temporarilyClosed';
            colorTextPostStatus = theme.highlightColor;
        } else if (item.postStatus === STATUS.notActive) {
            textPostStatus = 'discovery.closed';
            colorTextPostStatus = Theme.common.red;
        }

        const displayDontWorry =
            !isMyBubble &&
            (item.postStatus === STATUS.temporarilyClose ||
                item.postStatus === STATUS.requestingDelete) &&
            item.status === GROUP_BUYING_STATUS.joinedNotBought;
        const displayRequestSuccessfully =
            isMyBubble && item.postStatus === STATUS.requestingDelete;

        const BoxStatus = () => {
            if (!isMyBubble && item.amount !== null && item.deposit !== null) {
                return (
                    <View style={styles.depositView}>
                        <View
                            style={[
                                styles.depositBox,
                                {borderColor: theme.borderColor},
                            ]}>
                            {item.amount && (
                                <StyleText
                                    i18Text="discovery.amountBookGb"
                                    i18Params={{
                                        value: item.amount,
                                    }}
                                    customStyle={[
                                        styles.textDeposit,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                            )}
                            {item.deposit && (
                                <StyleText
                                    i18Text="discovery.depositAmount"
                                    i18Params={{
                                        value: formatLocaleNumber(item.deposit),
                                    }}
                                    customStyle={[
                                        styles.textDeposit,
                                        {color: theme.textHightLight},
                                    ]}
                                />
                            )}
                            {!!item.note && (
                                <StyleText
                                    originValue={item.note}
                                    customStyle={[
                                        styles.textDeposit,
                                        {color: theme.borderColor},
                                    ]}
                                />
                            )}
                        </View>
                    </View>
                );
            }

            if (isMyBubble && item.requestUpdatePrice) {
                return (
                    <UpdatePriceStatus
                        postId={item.id}
                        retailPrice={item.requestUpdatePrice.retailPrice}
                        prices={item.requestUpdatePrice.prices}
                    />
                );
            }

            return null;
        };

        return (
            <View style={styles.infoPart}>
                <TitleInformation
                    icon={Images.icons.calendar}
                    title={textPostStatus}
                    titleColor={theme.textHightLight}
                    titleStyle={{
                        fontWeight: 'normal',
                        color: colorTextPostStatus,
                    }}
                />
                {displayDontWorry && (
                    <View style={styles.pricesView}>
                        <StyleText
                            i18Text="discovery.notWorry"
                            style={[
                                styles.peoplePriceText,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </View>
                )}
                {displayRequestSuccessfully && (
                    <View style={[styles.pricesView, {width: '90%'}]}>
                        <StyleText
                            i18Text="alert.requestDeleteGbSuccess"
                            style={[
                                styles.peoplePriceText,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                )}

                <TitleInformation
                    icon={Images.icons.username}
                    title="discovery.retailPrice"
                    titleColor={theme.textHightLight}
                />
                <View style={styles.pricesView}>
                    <View style={styles.priceBox}>
                        <StyleText
                            originValue={`${formatLocaleNumber(
                                item.retailPrice,
                            )} vnd`}
                            style={[
                                styles.peoplePriceText,
                                {color: theme.highlightColor},
                            ]}
                        />
                    </View>
                </View>

                <TitleInformation
                    icon={Images.icons.dollar}
                    title="discovery.groupBuyingPrice"
                    titleColor={theme.textHightLight}
                />
                <View style={styles.pricesView}>
                    {item.prices.map((price, index) => (
                        <View
                            key={index}
                            style={[styles.priceBox, {marginBottom: 5}]}>
                            <StyleText
                                i18Text="discovery.numberPeople"
                                i18Params={{
                                    value: price.number_people,
                                }}
                                customStyle={[
                                    styles.peoplePriceText,
                                    {width: '32%', color: theme.textColor},
                                ]}
                            />
                            <StyleText
                                originValue="-"
                                customStyle={[
                                    styles.peoplePriceText,
                                    {
                                        color: theme.borderColor,
                                        marginRight: '12%',
                                    },
                                ]}
                            />
                            <StyleText
                                originValue={`${formatLocaleNumber(
                                    price.value,
                                )} vnd`}
                                style={[
                                    styles.peoplePriceText,
                                    {color: theme.highlightColor},
                                ]}
                            />
                        </View>
                    ))}
                </View>

                <View style={styles.informationView}>
                    <Ionicons
                        name="ios-location-sharp"
                        style={[
                            styles.iconLocation,
                            {color: Theme.common.commentGreen},
                        ]}
                    />
                    <StyleText
                        originValue={item.creatorLocation}
                        customStyle={[
                            styles.titleInformation,
                            {
                                color: theme.textColor,
                                fontWeight: 'normal',
                                marginLeft: 5,
                            },
                        ]}
                    />
                </View>

                {BoxStatus()}

                {isMyBubble && (
                    <StyleTouchable
                        customStyle={styles.updateStatusBox}
                        onPress={() =>
                            navigate(PROFILE_ROUTE.createGroupBuying, {
                                itemEdit: item,
                            })
                        }>
                        <StyleText
                            i18Text="setting.updateStatus"
                            customStyle={[
                                styles.textUpdateStatus,
                                {color: theme.borderColor},
                            ]}
                        />
                    </StyleTouchable>
                )}
            </View>
        );
    };

    const ToolReaction = () => {
        const totalComments = isInRoot
            ? item.totalComments
            : bubbleFocusing.totalComments;
        return (
            <View
                style={[
                    styles.reactionView,
                    {borderTopColor: theme.holderColor},
                ]}>
                <View style={styles.starBox}>
                    {isLiked ? (
                        <IconLiked
                            customStyle={[
                                styles.star,
                                {color: theme.likeHeart},
                            ]}
                            onPress={() =>
                                onHandleLike({
                                    isModeExp,
                                    isLiked,
                                    setIsLiked,
                                    totalLikes,
                                    setTotalLikes,
                                    postId: item.id,
                                    setList,
                                })
                            }
                            touchableStyle={[
                                styles.starTouch,
                                {backgroundColor: theme.backgroundButtonColor},
                            ]}
                        />
                    ) : (
                        <IconNotLiked
                            customStyle={[
                                styles.star,
                                {color: theme.unLikeHeart},
                            ]}
                            onPress={() =>
                                onHandleLike({
                                    isModeExp,
                                    isLiked,
                                    setIsLiked,
                                    totalLikes,
                                    setTotalLikes,
                                    postId: item.id,
                                    setList,
                                })
                            }
                            touchableStyle={[
                                styles.starTouch,
                                {backgroundColor: theme.backgroundButtonColor},
                            ]}
                        />
                    )}
                    <StyleText
                        i18Text={
                            totalLikes
                                ? 'discovery.numberLike'
                                : 'discovery.like'
                        }
                        i18Params={{
                            value: 23,
                        }}
                        customStyle={[
                            styles.textStar,
                            {color: theme.borderColor},
                        ]}
                        onPress={() => onShowModalComment('like')}
                    />
                </View>

                <View style={styles.starBox}>
                    <StyleTouchable
                        onPress={() => onShowModalComment('comment')}
                        customStyle={[
                            styles.starTouch,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}>
                        <StyleIcon
                            source={Images.icons.comment}
                            size={20}
                            customStyle={{tintColor: theme.textColor}}
                        />
                    </StyleTouchable>
                    <StyleText
                        i18Text={
                            totalComments
                                ? 'discovery.numberComments'
                                : 'discovery.comment'
                        }
                        i18Params={{
                            numberComments: totalComments,
                        }}
                        customStyle={[
                            styles.textStar,
                            {color: theme.borderColor},
                        ]}
                        onPress={() => onShowModalComment('comment')}
                    />
                </View>

                <View style={styles.starBox}>
                    <StyleTouchable
                        customStyle={[
                            styles.starTouch,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        disable={disableShare}
                        onPress={() => onShowModalShare(item, setDisableShare)}>
                        <StyleIcon
                            source={Images.icons.share}
                            size={22}
                            customStyle={{tintColor: theme.textColor}}
                        />
                    </StyleTouchable>
                    <StyleText
                        i18Text="discovery.share.title"
                        customStyle={[
                            styles.textStar,
                            {color: theme.borderColor},
                        ]}
                        onPress={() => onShowModalShare(item, setDisableShare)}
                    />
                </View>

                <View style={styles.starBox}>
                    <StyleTouchable
                        customStyle={[
                            styles.starTouch,
                            {backgroundColor: theme.backgroundButtonColor},
                        ]}
                        onPress={() =>
                            onGoToProfile(item.creator, {
                                seeReviewFirst: true,
                            })
                        }>
                        <StyleIcon
                            source={Images.icons.reputation}
                            size={21}
                            customStyle={{tintColor: theme.textColor}}
                        />
                    </StyleTouchable>
                    <StyleText
                        i18Text="profile.rating"
                        customStyle={[
                            styles.textStar,
                            {color: theme.borderColor},
                        ]}
                        onPress={() =>
                            onGoToProfile(item.creator, {
                                seeReviewFirst: true,
                            })
                        }
                    />
                </View>
            </View>
        );
    };

    const ListGroupJoined = () => {
        const isBiggerThanSix = item.totalGroups > 6;
        const displayPeople: Array<TypePeopleJoinedResponse> = [];
        listGroupsJoinPaging.list.every(group => {
            group.listPeople.every((join: any) => {
                if (displayPeople.length < 6) {
                    displayPeople.push(join);
                    return true;
                }
                return false;
            });
            if (displayPeople.length < 6) {
                return true;
            }
            return false;
        });

        const displayText =
            (isMyBubble && item.totalGroups) ||
            (!isMyBubble && item.status === GROUP_BUYING_STATUS.notJoined);

        return (
            <>
                {displayText && (
                    <StyleText
                        i18Text={
                            3
                                ? 'discovery.numberGroupJoined'
                                : 'discovery.beTheFirstJoin'
                        }
                        customStyle={[
                            styles.titleListPeopleBuying,
                            {color: theme.textHightLight},
                        ]}
                        i18Params={{
                            value: 3,
                        }}
                        onPress={() => modalJoinedRef.current?.open()}
                    />
                )}
                <StyleTouchable
                    customStyle={styles.peopleJoinView}
                    onPress={() => modalJoinedRef.current?.open()}>
                    {fakeDataListGroupsJoined[0].listPeople.map(
                        (
                            peopleJoin: TypePeopleJoinedResponse,
                            index: number,
                        ) => (
                            <StyleImage
                                key={index}
                                source={{uri: peopleJoin.creatorAvatar}}
                                customStyle={[
                                    styles.peopleJoinAvatar,
                                    {marginLeft: index > 0 ? -5 : 0},
                                ]}
                            />
                        ),
                    )}
                    {isBiggerThanSix && (
                        <View
                            style={[
                                styles.peopleMoreBox,
                                {
                                    backgroundColor: theme.holderColor,
                                },
                            ]}>
                            <StyleImage
                                source={{
                                    uri: displayPeople[5]?.creatorAvatar || '',
                                }}
                                customStyle={styles.avatarMore}
                            />
                            <StyleText
                                originValue={`+${
                                    item.totalGroups - displayPeople.length
                                }`}
                                customStyle={[
                                    styles.textJoinMore,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </View>
                    )}
                </StyleTouchable>
            </>
        );
    };

    const ListPeopleRetail = () => {
        if (!isMyBubble) {
            return null;
        }

        const isBiggerThanSix = item.totalGroups > 6;
        const displayPeople: Array<TypePeopleJoinedResponse> = [];
        listJoinPersonalPaging.list.every(
            (personal: TypePeopleJoinedResponse) => {
                if (displayPeople.length < 6) {
                    displayPeople.push(personal);
                    return true;
                }
                return false;
            },
        );

        return (
            <>
                <StyleText
                    i18Text="discovery.numberRetailTurns"
                    customStyle={[
                        styles.titleListPeopleBuying,
                        {color: theme.textHightLight},
                    ]}
                    i18Params={{
                        value: item.totalPersonals,
                    }}
                    onPress={() => modalPersonalRef.current?.open()}
                />
                <StyleTouchable
                    customStyle={styles.peopleJoinView}
                    onPress={() => modalPersonalRef.current?.open()}>
                    {displayPeople.map(
                        (
                            peopleJoin: TypePeopleJoinedResponse,
                            index: number,
                        ) => (
                            <StyleImage
                                key={index}
                                source={{uri: peopleJoin.creatorAvatar}}
                                customStyle={[
                                    styles.peopleJoinAvatar,
                                    {marginLeft: index > 0 ? -5 : 0},
                                ]}
                            />
                        ),
                    )}
                    {isBiggerThanSix && (
                        <View
                            style={[
                                styles.peopleMoreBox,
                                {
                                    backgroundColor: theme.holderColor,
                                },
                            ]}>
                            <StyleImage
                                source={{
                                    uri: displayPeople[5]?.creatorAvatar || '',
                                }}
                                customStyle={styles.avatarMore}
                            />
                            <StyleText
                                originValue={`+${
                                    item.totalGroups - displayPeople.length
                                }`}
                                customStyle={[
                                    styles.textJoinMore,
                                    {color: theme.textHightLight},
                                ]}
                            />
                        </View>
                    )}
                </StyleTouchable>
            </>
        );
    };

    const ButtonCheckJoin = () => {
        if (isMyBubble) {
            return null;
        }
        if (item.status === GROUP_BUYING_STATUS.bought) {
            return (
                <>
                    <StyleIcon
                        source={Images.images.successful}
                        size={60}
                        customStyle={styles.iconSuccessfully}
                    />
                    <StyleText
                        i18Text="discovery.thanksForJoin"
                        customStyle={[
                            styles.textSuccessfully,
                            {color: theme.highlightColor},
                        ]}
                    />

                    <LinearGradient
                        colors={[
                            Theme.common.gradientTabBar1,
                            Theme.common.gradientTabBar2,
                        ]}
                        style={styles.groupBuyingBox}>
                        <StyleTouchable
                            customStyle={styles.touchGroupBuying}
                            onPress={() => {
                                navigate(ROOT_SCREEN.detailGroupBuying, {
                                    itemId: item.id,
                                });
                            }}>
                            <StyleText
                                i18Text="discovery.continueJoin"
                                customStyle={styles.textGroupBuying}
                            />
                        </StyleTouchable>
                    </LinearGradient>
                </>
            );
        }

        if (item.status === GROUP_BUYING_STATUS.joinedNotBought) {
            return (
                <>
                    <View
                        style={[
                            styles.depositedBox,
                            {
                                opacity: isTemporarilyClose ? 0.5 : 1,
                                borderColor: theme.highlightColor,
                            },
                        ]}>
                        <View style={styles.touchGroupBuying}>
                            <StyleText
                                i18Text="discovery.deposited"
                                customStyle={[
                                    styles.textGroupBuying,
                                    {color: theme.highlightColor},
                                ]}
                            />
                        </View>
                    </View>

                    {/* {isTemporarilyClose && (
                        <StyleText
                            i18Text="discovery.gbExpired"
                            customStyle={styles.expiredText}
                        />
                    )} */}
                </>
            );
        }

        if (item.status === GROUP_BUYING_STATUS.notJoined) {
            return (
                <>
                    <View style={styles.buttonJoinView}>
                        <StyleTouchable
                            customStyle={[
                                styles.buySeparatelyBox,
                                {backgroundColor: theme.backgroundButtonColor},
                            ]}
                            onPress={() =>
                                modalConfirmJoin.showModal({
                                    isRetail: true,
                                })
                            }
                            disable={isTemporarilyClose}>
                            <StyleText
                                i18Text="discovery.buySeparately"
                                customStyle={[
                                    styles.textGroupBuying,
                                    {
                                        color: theme.textColor,
                                        fontWeight: 'normal',
                                    },
                                ]}
                            />
                        </StyleTouchable>
                        <View style={{width: '3%'}} />
                        <LinearGradient
                            colors={[
                                Theme.common.gradientTabBar1,
                                Theme.common.gradientTabBar2,
                            ]}
                            style={[
                                styles.groupBuyingBox,
                                {
                                    opacity: isTemporarilyClose ? 0.5 : 1,
                                    marginTop: 0,
                                },
                            ]}>
                            <StyleTouchable
                                customStyle={styles.groupJoinBox}
                                onPress={() =>
                                    modalConfirmJoin.showModal({
                                        isRetail: false,
                                    })
                                }
                                disable={isTemporarilyClose}
                                disableOpacity={1}>
                                <StyleIcon
                                    source={Images.icons.createGroup}
                                    size={15}
                                    customStyle={styles.iconGroup}
                                />
                                <StyleText
                                    i18Text="discovery.joinGroupBuying"
                                    customStyle={styles.textGroupBuying}
                                />
                            </StyleTouchable>
                        </LinearGradient>
                    </View>

                    {isTemporarilyClose && (
                        <StyleText
                            i18Text="discovery.gbExpired"
                            customStyle={styles.expiredText}
                        />
                    )}
                </>
            );
        }

        return null;
    };

    const Content = () => {
        return (
            <View
                style={[
                    styles.contentBox,
                    {borderTopColor: theme.holderColor},
                ]}>
                <View style={styles.creatorAvatarTouch}>
                    <StyleTouchable
                        customStyle={styles.creatorAvatar}
                        onPress={() => onGoToProfile(item.creator)}>
                        <StyleImage
                            source={{uri: item.creatorAvatar}}
                            customStyle={styles.creatorAvatar}
                        />
                    </StyleTouchable>
                    <View style={styles.nameTimeTouch}>
                        <StyleText
                            originValue={item.creatorName}
                            customStyle={[
                                styles.creatorNameText,
                                {color: theme.textColor},
                            ]}
                            numberOfLines={1}
                            onPress={() => onGoToProfile(item.creator)}
                        />
                        <StyleText
                            originValue={formatFromNow(item.created)}
                            customStyle={[
                                styles.timeText,
                                {color: theme.borderColor},
                            ]}
                        />
                    </View>
                </View>
                <StyleText
                    originValue={item.content}
                    customStyle={[styles.textContent, {color: theme.textColor}]}
                />
            </View>
        );
    };

    const modalConfirmJoin = ModalConfirmJoinGb({
        onConfirm: onJoinGroupBuying,
        retailPrice: item.retailPrice,
        prices: item.prices,
    });

    return (
        <>
            <ScrollView
                style={[
                    styles.container,
                    {backgroundColor: theme.backgroundColor},
                ]}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={load}
                        onRefresh={onRefresh}
                        tintColor={theme.highlightColor}
                        colors={[theme.highlightColor]}
                    />
                }
                showsVerticalScrollIndicator={false}>
                <SharedElement
                    id={`item.group_buying.${item.id}.${!!route.params
                        ?.isFromTopGroupBuying}`}
                    style={styles.imageView}>
                    <ScrollSyncSizeImage
                        images={[
                            'https://www.vietnambooking.com/wp-content/uploads/2020/05/tour-ha-giang-2-ngay-3-dem-4.jpg',
                        ]}
                        syncWidth={width}
                        onDoublePress={() => {
                            if (!isLiked) {
                                onHandleLike({
                                    isModeExp,
                                    isLiked,
                                    setIsLiked,
                                    totalLikes,
                                    setTotalLikes,
                                    postId: item.id,
                                    setList,
                                });
                            }
                        }}
                        containerStyle={styles.imagePreview}
                        defaultRatio={0.5}
                    />

                    <StyleTouchable
                        customStyle={styles.iconOptionView}
                        onPress={() => {
                            modalOptionRef.current?.show();
                        }}
                        hitSlop={20}>
                        <CustomBlurView />
                        <StyleIcon source={Images.icons.more} size={15} />
                    </StyleTouchable>
                </SharedElement>

                {Information()}
                {ToolReaction()}
                {ButtonCheckJoin()}
                {ListGroupJoined()}
                {ListPeopleRetail()}
                {Content()}
            </ScrollView>

            <StyleTouchable
                customStyle={styles.iconBackView}
                onPress={goBack}
                hitSlop={10}>
                <CustomBlurView />
                <Ionicons name="arrow-back" style={styles.iconBack} />
            </StyleTouchable>

            {!isModeExp && (
                <ModalPeopleJoined
                    ref={modalJoinedRef}
                    postId={item.id}
                    listPaging={listGroupsJoinPaging}
                    isMyBubble={isMyBubble}
                    totalGroups={item.totalGroups}
                />
            )}

            {!isModeExp && isMyBubble && (
                <ModalPeopleRetail
                    ref={modalPersonalRef}
                    postId={item.id}
                    listPaging={listJoinPersonalPaging}
                    totalRetailTurns={item.totalPersonals}
                />
            )}

            <ModalCommentLike
                ref={modalCommentLikeRef}
                theme={theme}
                bubbleFocusing={item}
                updateBubbleFocusing={(value: TypeGroupBuying) => {
                    setItem({
                        ...item,
                        ...value,
                    });
                }}
                setTotalComments={value =>
                    setItem(preValue => {
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
                    setItem(preValue => {
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
            {modalConfirmJoin.jsx()}

            {isLoading && <LoadingScreen />}

            <StyleActionSheet
                ref={modalOptionRef}
                listTextAndAction={listOptions()}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: '30@vs',
    },
    imageView: {
        width: '100%',
    },
    imagePreview: {
        width,
    },
    iconBackView: {
        position: 'absolute',
        left: '10@s',
        top: Metrics.safeTopPadding + verticalScale(5),
        padding: '5@ms',
        borderRadius: '15@ms',
    },
    iconBack: {
        fontSize: '20@ms',
        color: Theme.common.white,
    },
    iconOptionView: {
        position: 'absolute',
        right: '10@s',
        top: Metrics.safeTopPadding + verticalScale(5),
        paddingHorizontal: '7@ms',
        borderRadius: '15@ms',
    },
    avatar: {
        borderRadius: '30@s',
    },
    timeView: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '5@vs',
        alignSelf: 'center',
    },
    textTime: {
        fontSize: FONT_SIZE.small,
        marginRight: '17@s',
    },
    pricesView: {
        width: '80%',
        marginTop: '5@vs',
        alignSelf: 'center',
    },
    priceBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    peoplePriceText: {
        fontSize: FONT_SIZE.small,
    },
    infoPart: {
        width: '100%',
    },
    updateStatusBox: {
        position: 'absolute',
        top: 0,
        right: '10@s',
        marginVertical: '10@vs',
    },
    textUpdateStatus: {
        fontSize: FONT_SIZE.small,
        textDecorationLine: 'underline',
    },
    informationView: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
        alignSelf: 'center',
    },
    titleInformation: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        marginLeft: '10@s',
    },
    reactionView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
        marginTop: '10@vs',
        paddingHorizontal: '20@s',
        paddingTop: '10@vs',
    },
    starBox: {
        flex: 1,
        alignItems: 'center',
    },
    starTouch: {
        width: '40@ms',
        height: '40@ms',
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '25@ms',
    },
    star: {
        fontSize: '20@ms',
    },
    textStar: {
        fontSize: FONT_SIZE.small,
        marginTop: '10@vs',
    },
    buttonJoinView: {
        width: '100%',
        marginTop: '15@vs',
        flexDirection: 'row',
        paddingHorizontal: '20@s',
    },
    buySeparatelyBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10@ms',
    },
    groupBuyingBox: {
        width: '65%',
        backgroundColor: Theme.common.gradientTabBar1,
        alignSelf: 'center',
        marginTop: '15@vs',
        borderRadius: '10@ms',
    },
    depositedBox: {
        width: '65%',
        alignSelf: 'center',
        marginTop: '15@vs',
        borderRadius: '10@ms',
        borderWidth: '1@ms',
    },
    groupJoinBox: {
        width: '100%',
        paddingVertical: '5@vs',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconGroup: {
        marginRight: '5@s',
        tintColor: Theme.common.white,
    },
    touchGroupBuying: {
        width: '100%',
        paddingVertical: '5@vs',
        alignItems: 'center',
    },
    textGroupBuying: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
        color: Theme.common.white,
    },
    expiredText: {
        fontSize: FONT_SIZE.small,
        color: Theme.common.red,
        alignSelf: 'center',
        marginTop: '5@vs',
    },
    titleListPeopleBuying: {
        fontSize: FONT_SIZE.normal,
        marginTop: '15@vs',
        alignSelf: 'center',
    },
    peopleJoinView: {
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: '5@vs',
    },
    peopleJoinAvatar: {
        width: '35@ms',
        height: '35@ms',
        borderRadius: '20@s',
    },
    peopleMoreBox: {
        width: '35@s',
        height: '35@s',
        borderRadius: '20@s',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -5,
    },
    avatarMore: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '20@s',
        opacity: 0.2,
    },
    textJoinMore: {
        fontSize: FONT_SIZE.normal,
    },
    contentBox: {
        width: '85%',
        alignSelf: 'center',
        marginTop: '20@vs',
        borderTopWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    creatorAvatarTouch: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '10@vs',
    },
    creatorAvatar: {
        width: '40@ms',
        height: '40@ms',
        borderRadius: '25@s',
    },
    nameTimeTouch: {
        flex: 1,
        paddingLeft: '10@s',
    },
    creatorNameText: {
        fontSize: FONT_SIZE.normal,
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: FONT_SIZE.normal,
    },
    textContent: {
        fontSize: FONT_SIZE.normal,
        marginTop: '10@vs',
    },
    iconLocation: {
        fontSize: '20@ms',
    },
    iconSuccessfully: {
        alignSelf: 'center',
        marginTop: '20@vs',
    },
    textSuccessfully: {
        fontSize: FONT_SIZE.small,
        alignSelf: 'center',
    },
    depositView: {
        marginTop: '10@vs',
        flexDirection: 'row',
        paddingHorizontal: '20@s',
        justifyContent: 'center',
    },
    depositBox: {
        borderWidth: borderWidthTiny,
        paddingHorizontal: '15@s',
        paddingVertical: '5@vs',
        borderRadius: '5@ms',
    },
    textDeposit: {
        fontSize: FONT_SIZE.normal,
    },
});

export default DetailGroupBuying;
