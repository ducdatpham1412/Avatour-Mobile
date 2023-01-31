/* eslint-disable no-shadow */
import {useIsFocused} from '@react-navigation/native';
import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {apiGetListBubbleActive} from 'api/module';
import {apiLikePost, apiUnLikePost} from 'api/profile';
import {POST_TYPE, REACT, TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import ROOT_SCREEN, {DISCOVERY_ROUTE} from 'navigation/config/routes';
import {appAlert, goBack, navigate} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Vibration, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {onGoToSignUp} from 'utility/assistant';
import {useNotification} from 'utility/notification';
import BannerTopGb from './components/BannerTopGb';
import BubbleGroupBuying, {ParamsLikeGB} from './components/BubbleGroupBuying';
import HeaderDoffy from './components/HeaderDoffy';

export interface TypeMoreOptionsMe {
    postModal: TypeBubblePalace | TypeGroupBuying;
}

let modalOptions: TypeBubblePalace | TypeGroupBuying;

const onGoToSignUpFromAlert = () => {
    goBack();
    onGoToSignUp();
};

const DiscoveryScreen = () => {
    useNotification();
    const isFocused = useIsFocused();

    const listRef = useRef<FlatList>(null);
    const optionsRef = useRef<any>(null);
    const headerRef = useRef<HeaderDoffy>(null);

    const theme = Redux.getTheme();
    const token = Redux.getToken();
    const isModeExp = Redux.getModeExp();
    const bubblePalace = Redux.getBubblePalaceAction();
    const {profile} = Redux.getPassport();
    const numberNewMessages = Redux.getNumberNewMessages();

    const hadLogan = token && !isModeExp;

    const [postIdFocusing, setPostIdFocusing] = useState('');

    const {list, setList, onLoadMore, refreshing, onRefresh} = usePaging({
        request: apiGetListBubbleActive,
        params: {
            take: 30,
            topics: undefined,
            postTypes: `[${String([POST_TYPE.groupBuying])}]`,
        },
    });

    useEffect(() => {
        if (
            bubblePalace.action ===
            TYPE_BUBBLE_PALACE_ACTION.scrollToTopDiscovery
        ) {
            listRef.current?.scrollToOffset({
                offset: 0,
                animated: true,
            });
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        }
    }, [bubblePalace.action]);

    useEffect(() => {
        if (isFocused) {
            Redux.setScrollMainAndChatEnable(true);
        } else {
            Redux.setScrollMainAndChatEnable(false);
        }
    }, [isFocused]);

    /**
     * Functions
     */
    const onShowModalComment = useCallback(
        (
            post: TypeBubblePalace | TypeGroupBuying,
            type: TypeShowModalCommentOrLike,
        ) => {
            if (!hadLogan) {
                Vibration.vibrate([0.1], false);
                appAlert('discovery.bubble.goToSignUp', {
                    moreNotice: 'common.letGo',
                    moreAction: onGoToSignUpFromAlert,
                });
            } else {
                showCommentDiscovery({
                    post,
                    setList,
                    type,
                });
            }
        },
        [hadLogan],
    );

    const onShowOptions = useCallback((params: TypeMoreOptionsMe) => {
        modalOptions = params.postModal;
        optionsRef.current?.show();
    }, []);

    /**
     * Render views
     */
    const onHandleLikeGB = useCallback(
        async (params: ParamsLikeGB) => {
            const {isLiked, setIsLiked, totalLikes, setTotalLikes, postId} =
                params;

            if (hadLogan) {
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
                                totalLikes:
                                    value.totalLikes + (currentLike ? -1 : 1),
                            };
                        });
                    });
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
        },
        [hadLogan],
    );

    const RenderItemBubble = useCallback(
        (item: TypeBubblePalace & TypeGroupBuying) => {
            if (item.postType === POST_TYPE.groupBuying) {
                return (
                    <BubbleGroupBuying
                        item={item}
                        onGoToDetailGroupBuying={value =>
                            navigate(DISCOVERY_ROUTE.detailGroupBuying, {
                                item: value,
                                setList,
                            })
                        }
                        onShowMoreOption={onShowOptions}
                        onHandleLike={onHandleLikeGB}
                        onShowModalComment={(post, type) =>
                            onShowModalComment(post, type)
                        }
                        onChangePostIdFocusing={postId =>
                            setPostIdFocusing(postId)
                        }
                        detailGroupTarget={DISCOVERY_ROUTE.detailGroupBuying}
                    />
                );
            }
            return null;
        },
        [postIdFocusing],
    );

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <HeaderDoffy
                ref={headerRef}
                theme={theme}
                profile={profile}
                numberNewMessages={numberNewMessages}
            />

            <View style={{flex: 1, overflow: 'hidden'}}>
                <StyleList
                    ref={listRef}
                    data={list}
                    renderItem={({item}) => RenderItemBubble(item)}
                    keyExtractor={(_, index) => String(index)}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    onLoadMore={onLoadMore}
                    ListHeaderComponent={BannerTopGb}
                    ListEmptyComponent={null}
                    maxToRenderPerBatch={20}
                    directionalLockEnabled
                    contentContainerStyle={{
                        paddingBottom: 40,
                    }}
                />
            </View>

            <StyleActionSheet
                ref={optionsRef}
                listTextAndAction={[
                    {
                        text: 'discovery.report.title',
                        action: () => {
                            if (hadLogan && modalOptions) {
                                navigate(ROOT_SCREEN.reportUser, {
                                    idUser: modalOptions.creator,
                                    nameUser: modalOptions.creatorName,
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
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
    },
});

export default DiscoveryScreen;
