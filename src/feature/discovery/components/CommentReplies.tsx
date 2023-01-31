import {TypeCommentResponse} from 'api/interface';
import {apiGetListComments} from 'api/module';
import {TYPE_BUBBLE_PALACE_ACTION} from 'asset/enum';
import {StyleText, StyleTouchable} from 'components/base';
import StyleList from 'components/base/StyleList';
import usePaging from 'hook/usePaging';
import Redux from 'hook/useRedux';
import React, {useCallback, useEffect, useState} from 'react';
import {Animated, View} from 'react-native';
import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ItemComment from './ItemComment';

interface Props {
    repliedCommentId: string;
    totalReplies: number;
    postId: string;
    onPressReply?(idComment: string, personReplied: string): void;
}

const NullView = () => {
    return null;
};

const CommentReplies = (props: Props) => {
    const {repliedCommentId, totalReplies, postId, onPressReply} = props;
    const theme = Redux.getTheme();
    const bubblePalaceAction = Redux.getBubblePalaceAction();

    const [displayList, setDisplayList] = useState(false);

    const {list, onLoadMore, setList} = usePaging({
        request: apiGetListComments,
        params: {
            postId,
            replied_id: repliedCommentId,
        },
        isInitNotRunRequest: true,
    });

    const totalRemains = displayList
        ? totalReplies - list.length
        : totalReplies;
    const listHeight = displayList ? undefined : 0;
    const showButtonReplies = totalRemains > 0 || !displayList;

    useEffect(() => {
        if (
            bubblePalaceAction.action ===
                TYPE_BUBBLE_PALACE_ACTION.addReplyComment &&
            bubblePalaceAction.payload.commentReplied === repliedCommentId
        ) {
            setList((preValue: Array<TypeCommentResponse>) =>
                preValue.concat(bubblePalaceAction.payload.data),
            );
        }
        Redux.setBubblePalaceAction({
            action: TYPE_BUBBLE_PALACE_ACTION.null,
            payload: null,
        });
    }, [bubblePalaceAction.action, repliedCommentId]);

    const RenderItemComment = useCallback(
        (item: TypeCommentResponse) => {
            return (
                <ItemComment
                    item={item}
                    onPressReply={onPressReply}
                    postId={postId}
                />
            );
        },
        [postId],
    );

    return (
        <>
            <View style={styles.container}>
                <Animated.View
                    style={{
                        width: '100%',
                        height: listHeight,
                    }}>
                    <StyleList
                        data={list}
                        renderItem={({item}) => RenderItemComment(item)}
                        keyExtractor={item => item.id}
                        ListEmptyComponent={NullView}
                    />
                </Animated.View>

                <View style={styles.replyView}>
                    {showButtonReplies ? (
                        <StyleTouchable
                            customStyle={styles.replyBox}
                            onPress={() => {
                                onLoadMore();
                                setDisplayList(true);
                            }}
                            hitSlop={10}>
                            <StyleText
                                i18Text="discovery.viewReply"
                                i18Params={{
                                    value: totalRemains,
                                }}
                                style={[
                                    styles.textViewReplies,
                                    {color: theme.borderColor},
                                ]}
                            />
                            <AntDesign
                                name="down"
                                style={[
                                    styles.iconDown,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    ) : (
                        <View />
                    )}

                    {displayList && (
                        <StyleTouchable
                            customStyle={styles.replyBox}
                            onPress={() => setDisplayList(false)}
                            hitSlop={10}>
                            <StyleText
                                i18Text="discovery.hide"
                                style={[
                                    styles.textViewReplies,
                                    {color: theme.borderColor},
                                ]}
                            />
                            <AntDesign
                                name="up"
                                style={[
                                    styles.iconDown,
                                    {color: theme.borderColor},
                                ]}
                            />
                        </StyleTouchable>
                    )}
                </View>
            </View>
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: '100%',
        paddingLeft: moderateScale(30) + scale(7),
        marginTop: '5@vs',
    },
    replyView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    replyBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textViewReplies: {
        fontSize: '10@ms',
    },
    iconDown: {
        fontSize: '10@ms',
        marginLeft: '3@s',
    },
});

export default CommentReplies;
