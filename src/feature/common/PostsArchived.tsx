import {TypeBubblePalace, TypeGroupBuying} from 'api/interface';
import {apiGetListPostsArchived} from 'api/module';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import {Metrics} from 'asset/metrics';
import StyleList from 'components/base/StyleList';
import ModalCommentLike, {
    TypeModalCommentPost,
} from 'components/ModalCommentLike';
import ListShareElement from 'feature/profile/post/ListShareElement';
import PostStatus from 'feature/profile/post/PostStatus';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import StyleHeader from 'navigation/components/StyleHeader';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import {fakeBubbleFocusing} from 'utility/assistant';

const extraHeight = -(Metrics.safeBottomPadding + verticalScale(7));

const PostsArchived = () => {
    const theme = Redux.getTheme();
    const {profile} = Redux.getPassport();
    const bubblePalaceAction = Redux.getBubblePalaceAction();

    const modalLikeCommentRef = useRef<ModalCommentLike>(null);
    const shareRef = useRef<ListShareElement>(null);
    const listShareElement = useRef<Array<TypeBubblePalace & TypeGroupBuying>>(
        [],
    );

    const [bubbleFocusing, setBubbleFocusing] = useState<TypeBubblePalace>();

    const postPaging = usePaging({
        request: apiGetListPostsArchived,
    });

    useEffect(() => {
        listShareElement.current = postPaging.list;
    }, [postPaging.list]);

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
            TYPE_BUBBLE_PALACE_ACTION.unArchivePost
        ) {
            const archivedPost: TypeBubblePalace = bubblePalaceAction.payload;
            postPaging.setList(preValue => {
                return preValue.filter(item => item.id !== archivedPost.id);
            });
            Redux.setBubblePalaceAction({
                action: TYPE_BUBBLE_PALACE_ACTION.null,
                payload: null,
            });
        }
    }, [bubblePalaceAction]);

    const onGoToDetailPost = useCallback((postId: string) => {
        const initIndex = listShareElement.current.findIndex(
            item => item.id === postId,
        );
        shareRef.current?.show({
            index: initIndex === -1 ? 0 : initIndex,
            postId,
        });
    }, []);

    const showModalLikeComment = useCallback((params: TypeModalCommentPost) => {
        modalLikeCommentRef.current?.show(params);
    }, []);

    const RenderItem = useCallback(
        (item: TypeBubblePalace & TypeGroupBuying) => {
            return (
                <PostStatus
                    item={item}
                    onGoToDetailPost={onGoToDetailPost}
                    containerStyle={styles.itemPostView}
                />
            );
        },
        [],
    );

    return (
        <View
            style={[
                styles.container,
                {backgroundColor: theme.backgroundColor},
            ]}>
            <View style={styles.body}>
                <StyleHeader title="profile.postsArchived" />

                <StyleList
                    data={postPaging.list}
                    numColumns={3}
                    renderItem={({item}) => RenderItem(item)}
                    keyExtractor={item => String(item.id)}
                    refreshing={postPaging.refreshing}
                    onRefresh={postPaging.onRefresh}
                    onLoadMore={postPaging.onLoadMore}
                />

                <ListShareElement
                    ref={shareRef}
                    title={profile.name}
                    listPaging={postPaging}
                    containerStyle={{
                        backgroundColor: theme.backgroundColorSecond,
                    }}
                    onShowModalComment={showModalLikeComment}
                />
            </View>

            <ModalCommentLike
                ref={modalLikeCommentRef}
                theme={theme}
                bubbleFocusing={bubbleFocusing || fakeBubbleFocusing}
                updateBubbleFocusing={value => {
                    setBubbleFocusing((preValue: any) => ({
                        ...preValue,
                        ...value,
                    }));
                }}
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
                inputCommentContainerStyle={styles.inputCommentView}
                extraHeight={extraHeight}
            />
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingTop: Metrics.safeTopPadding,
    },
    body: {
        flex: 1,
    },
    itemPostView: {
        marginHorizontal: '0.25@ms',
    },
    inputCommentView: {
        paddingBottom: '14@vs',
    },
});

export default PostsArchived;
