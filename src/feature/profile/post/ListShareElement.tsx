/* eslint-disable no-underscore-dangle */
import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {TypeShowModalCommentOrLike} from 'api/interface/discovery';
import {apiDeletePost} from 'api/module';
import {apiLikePost, apiUnLikePost} from 'api/profile';
import FindmeStore from 'app-redux/store';
import {POST_TYPE, REACT} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import StyleList from 'components/base/StyleList';
import StyleActionSheet from 'components/common/StyleActionSheet';
import {TypeModalCommentPost} from 'components/ModalCommentLike';
import ViewSafeTopPadding from 'components/ViewSafeTopPadding';
import Bubble from 'feature/discovery/components/Bubble';
import BubbleGroupBuying, {
    ParamsLikeGB,
} from 'feature/discovery/components/BubbleGroupBuying';
import {TypeMoreOptionsMe} from 'feature/discovery/DiscoveryScreen';
import StyleHeader from 'navigation/components/StyleHeader';
import ROOT_SCREEN, {PROFILE_ROUTE} from 'navigation/config/routes';
import {
    appAlert,
    appAlertYesNo,
    goBack,
    navigate,
} from 'navigation/NavigationService';
import {showCommentDiscovery} from 'navigation/screen/MainTabs';
import React, {Component} from 'react';
import {
    Animated,
    FlatList,
    GestureResponderEvent,
    StyleProp,
    ViewStyle,
} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {DefaultTransitionSpec} from 'utility/animation';
import {logger} from 'utility/assistant';

interface Props {
    title: string;
    listPaging: any;
    containerStyle?: StyleProp<ViewStyle>;
    isSaveTop?: boolean;
    onShowModalComment?(params: TypeModalCommentPost): void;
}

interface States {
    postIdFocusing: string;
}

interface TypeShow {
    index: number;
    postId: string;
    e?: GestureResponderEvent;
}

let postModal: TypeBubblePalace | TypeGroupBuying;

const onGoToEditPost = () => {
    if (postModal) {
        navigate(PROFILE_ROUTE.createPostPreview, {
            itemEdit: postModal,
        });
    }
};

export default class ListShareElement extends Component<Props, States> {
    pan = new Animated.ValueXY();

    scaleX = new Animated.Value(0);

    scaleY = new Animated.Value(0);

    listRef = React.createRef<FlatList>();

    myOptionRef = React.createRef<any>();

    draftOptionRef = React.createRef<any>();

    friendOptionRef = React.createRef<any>();

    state: States = {
        postIdFocusing: '',
    };

    // When press "Go to detail post in ProfileScreen",
    // Disable catch scroll fail to avoid scroll to other index => Low performance
    private enableCatchScrollFail = true;

    // When show ListShareElement
    // Disable hearing scrollEvent in ProfileScreen to avoid scrollToEnd
    private enableHearingScrollEvent = true;

    isShowing() {
        return this.scaleX._value === 1 && this.scaleY._value === 1;
    }

    show(params: TypeShow) {
        this.enableCatchScrollFail = false;
        this.enableHearingScrollEvent = false;
        this.listRef.current?.scrollToIndex({
            index: params.index,
            animated: false,
        });
        Animated.parallel([
            Animated.timing(this.scaleX, {
                toValue: 1,
                duration: 350,
                useNativeDriver: false,
            }),
            Animated.timing(this.scaleY, {
                toValue: 1,
                duration: 350,
                useNativeDriver: false,
            }),
        ]).start(() => {
            this.setState({
                postIdFocusing: params.postId,
            });
        });
    }

    hide() {
        const {timing, ...transitionConfig} = DefaultTransitionSpec;
        Animated.parallel([
            timing(this.scaleX, {
                ...transitionConfig,
                toValue: 0,
                useNativeDriver: false,
            }),
            timing(this.scaleY, {
                ...transitionConfig,
                toValue: 0,
                useNativeDriver: false,
            }),
        ]).start(() => {
            this.enableHearingScrollEvent = true;
            this.setState({
                postIdFocusing: '',
            });
        });
    }

    scrollToNearingEnd() {
        if (this.enableHearingScrollEvent) {
            if (this.enableCatchScrollFail === false) {
                this.enableCatchScrollFail = true;
            }
            const indexLast = this.props.listPaging.list.length - 2;
            if (indexLast >= 1) {
                this.listRef.current?.scrollToIndex({
                    index: indexLast,
                    animated: false,
                });
            }
        }
    }

    private onDeletePost(postId: string) {
        const agreeDelete = async () => {
            try {
                await apiDeletePost(postId);
                this.props.listPaging.setList(
                    (preValue: Array<TypeBubblePalace>) => {
                        return preValue.filter(item => item.id !== postId);
                    },
                );
            } catch (err) {
                appAlert(err);
            }
        };

        appAlertYesNo({
            i18Title: 'profile.post.sureDeletePost',
            agreeChange: agreeDelete,
            refuseChange: goBack,
        });
    }

    private showOptions(params: TypeMoreOptionsMe) {
        const {id} = FindmeStore.getState().accountSlice.passport.profile;
        postModal = params.postModal;
        if (postModal.creator === id) {
            if (postModal.isDraft) {
                this.draftOptionRef.current?.show();
            } else {
                this.myOptionRef.current?.show();
            }
        } else {
            this.friendOptionRef.current?.show();
        }
    }

    private showModalComment(
        post: TypeBubblePalace | TypeGroupBuying,
        type: TypeShowModalCommentOrLike,
    ) {
        if (this.props.onShowModalComment) {
            this.props.onShowModalComment({
                post,
                setList: this.props.listPaging.setList,
                type,
            });
        } else {
            showCommentDiscovery({
                post,
                setList: this.props.listPaging.setList,
                type,
            });
        }
    }

    private async onHandleLike(params: ParamsLikeGB) {
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

            this.props.listPaging.setList(
                (preValue: Array<TypeGroupBuying>) => {
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
                },
            );
        } catch (err) {
            setIsLiked(currentLike);
            setTotalLikes(currentNumberLikes);
            appAlert(err);
        }
    }

    RenderItemBubble = (item: TypeBubblePalace | TypeGroupBuying) => {
        if (item.postType === POST_TYPE.review) {
            return (
                <Bubble
                    item={item}
                    onShowMoreOption={value => this.showOptions(value)}
                    onShowModalComment={(post, type) =>
                        this.showModalComment(post, type)
                    }
                    isFocusing={this.state.postIdFocusing === item.id}
                    onChangePostIdFocusing={postId =>
                        this.setState({postIdFocusing: postId})
                    }
                />
            );
        }
        if (item.postType === POST_TYPE.groupBuying) {
            return (
                <BubbleGroupBuying
                    item={item}
                    onGoToDetailGroupBuying={() => {
                        navigate(PROFILE_ROUTE.detailGroupBuying, {
                            item,
                            setList: this.props.listPaging.setList,
                        });
                    }}
                    onHandleLike={value => this.onHandleLike(value)}
                    onShowMoreOption={value => this.showOptions(value)}
                    onChangePostIdFocusing={postId =>
                        this.setState({postIdFocusing: postId})
                    }
                    onShowModalComment={(post, type) =>
                        this.showModalComment(post, type)
                    }
                />
            );
        }
        return null;
    };

    render() {
        const {listPaging, containerStyle, title, isSaveTop} = this.props;

        const MyModalOption = () => {
            return (
                <StyleActionSheet
                    ref={this.myOptionRef}
                    listTextAndAction={[
                        {
                            text: 'profile.post.edit',
                            action: onGoToEditPost,
                        },
                        {
                            text: 'profile.post.delete',
                            action: () => {
                                if (postModal) {
                                    this.onDeletePost(postModal.id);
                                }
                            },
                        },
                        {
                            text: 'common.cancel',
                            action: () => null,
                        },
                    ]}
                />
            );
        };

        const DraftOption = () => {
            return (
                <StyleActionSheet
                    ref={this.draftOptionRef}
                    listTextAndAction={[
                        {
                            text: 'profile.post.edit',
                            action: onGoToEditPost,
                        },
                        {
                            text: 'profile.post.delete',
                            action: () => {
                                if (postModal?.id) {
                                    this.onDeletePost(postModal.id);
                                }
                            },
                        },
                        {
                            text: 'common.cancel',
                            action: () => null,
                        },
                    ]}
                />
            );
        };

        const FriendModalOptions = () => {
            return (
                <StyleActionSheet
                    ref={this.friendOptionRef}
                    listTextAndAction={[
                        {
                            text: 'discovery.report.title',
                            action: () => {
                                navigate(ROOT_SCREEN.reportUser, {
                                    idUser: postModal.creator,
                                    nameUser: postModal.creatorName,
                                });
                            },
                        },
                        {
                            text: 'common.cancel',
                            action: () => null,
                        },
                    ]}
                />
            );
        };

        return (
            <>
                <Animated.View
                    style={[
                        styles.container,
                        {
                            transform: [
                                {translateX: this.pan.x},
                                {translateY: this.pan.y},
                                {scaleX: this.scaleX},
                                {scaleY: this.scaleY},
                            ],
                        },
                        containerStyle,
                    ]}>
                    {!!isSaveTop && <ViewSafeTopPadding />}
                    <StyleHeader onGoBack={() => this.hide()} title={title} />
                    <StyleList
                        ref={this.listRef}
                        data={listPaging.list}
                        maxToRenderPerBatch={50}
                        initialNumToRender={50}
                        renderItem={({item}) => this.RenderItemBubble(item)}
                        keyExtractor={(_, index) => String(index)}
                        onEndReached={listPaging.onLoadMore}
                        refreshing={listPaging.loading}
                        onRefresh={listPaging.onRefresh}
                        onScrollToIndexFailed={e => {
                            if (this.enableCatchScrollFail) {
                                logger(e.highestMeasuredFrameIndex);
                                if (e.highestMeasuredFrameIndex - 1 >= 1) {
                                    this.listRef.current?.scrollToIndex({
                                        index: e.highestMeasuredFrameIndex - 1,
                                        animated: false,
                                    });
                                }
                            }
                        }}
                        contentContainerStyle={styles.contentContainer}
                    />
                </Animated.View>

                {MyModalOption()}
                {DraftOption()}
                {FriendModalOptions()}
            </>
        );
    }
}

const styles = ScaledSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        paddingBottom: Metrics.safeBottomPadding,
    },
});
