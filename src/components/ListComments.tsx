import {
    TypeBubblePalace,
    TypeCommentResponse,
    TypeGroupBuying,
} from 'api/interface';
import {Metrics} from 'asset/metrics';
import ItemComment from 'feature/discovery/components/ItemComment';
import Redux from 'hook/useRedux';
import {socketAddComment, useSocketComment} from 'hook/useSocketIO';
import React, {useCallback, useRef, useState} from 'react';
import {
    FlatList,
    Platform,
    StyleProp,
    TextInput,
    ViewStyle,
} from 'react-native';
import {ScaledSheet, verticalScale} from 'react-native-size-matters';
import StyleList from './base/StyleList';
import InputComment from './common/InputComment';
import StyleKeyboardAwareView from './StyleKeyboardAwareView';

interface Props {
    bubbleFocusing: TypeBubblePalace | TypeGroupBuying;
    setTotalComments(value: number): void;
    increaseTotalComments(value: number): void;
    inputCommentContainerStyle?: StyleProp<ViewStyle>;
    extraHeight?: number;
}

const defaultExtraHeight = verticalScale(7);

const ListComments = (props: Props) => {
    const {
        bubbleFocusing,
        setTotalComments,
        increaseTotalComments,
        inputCommentContainerStyle,
        extraHeight = defaultExtraHeight,
    } = props;
    const listCommentRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);

    const {profile} = Redux.getPassport();
    const token = Redux.getToken();
    const theme = Redux.getTheme();

    const [textComment, setTextComment] = useState('');
    const [personReplied, setPersonReplied] = useState('');
    const [commentReplied, setCommentReplied] = useState('');

    const {list, refreshing, onRefresh, onLoadMore} = useSocketComment({
        bubbleFocusingId: bubbleFocusing.id,
        setTotalComments,
        increaseTotalComments,
        scrollToIndex: (value: number) => {
            listCommentRef.current?.scrollToIndex({
                index: value,
                animated: true,
            });
        },
        scrollToEnd: () => {
            listCommentRef.current?.scrollToEnd();
        },
        myId: profile.id,
        clearText: () => {
            setCommentReplied('');
            inputRef.current?.clear();
        },
    });

    const onSendComment = async () => {
        socketAddComment({
            token: String(token),
            comment: {
                postId: bubbleFocusing.id,
                commentReplied: commentReplied || null,
                content: textComment,
                images: [],
                creatorName: profile.name,
                creatorAvatar: profile.avatar,
            },
        });
    };

    const onPresReply = useCallback(
        (commentId: string, _personReplied: string) => {
            setCommentReplied(commentId);
            setPersonReplied(_personReplied);
            inputRef.current?.focus();
        },
        [],
    );

    const onDeleteReply = useCallback(() => {
        setCommentReplied('');
        setPersonReplied('');
    }, []);

    const RenderItemComment = useCallback(
        (item: TypeCommentResponse) => {
            return (
                <ItemComment
                    item={item}
                    onPressReply={onPresReply}
                    containerStyle={styles.itemCommentTouch}
                    postId={bubbleFocusing.id}
                />
            );
        },
        [bubbleFocusing.id],
    );

    return (
        <StyleKeyboardAwareView
            containerStyle={[
                styles.container,
                {borderRightColor: theme.holderColor},
            ]}
            extraHeight={extraHeight}>
            <StyleList
                ref={listCommentRef}
                style={styles.listCommentBox}
                data={list}
                renderItem={({item}) => RenderItemComment(item)}
                keyExtractor={(_, index) => String(index)}
                contentContainerStyle={{paddingBottom: 100}}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
            />

            <InputComment
                ref={inputRef}
                text={textComment}
                onChangeText={(text: string) => setTextComment(text)}
                onSendComment={onSendComment}
                commentIdReplied={commentReplied}
                personNameReplied={personReplied}
                onDeleteReply={onDeleteReply}
                containerStyle={inputCommentContainerStyle}
            />
        </StyleKeyboardAwareView>
    );
};

const styles = ScaledSheet.create({
    container: {
        width: Metrics.width,
        height: '100%',
        borderRightWidth: Platform.select({
            ios: '0.25@ms',
            android: '0.5@ms',
        }),
    },
    listCommentBox: {
        flex: 1,
    },
    itemCommentTouch: {
        paddingHorizontal: '15@s',
    },
});

export default ListComments;
