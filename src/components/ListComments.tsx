import {Metrics} from 'asset/metrics';
import ItemComment from 'feature/discovery/components/ItemComment';
import {useTheme} from 'hook';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, StyleProp, TextInput, ViewStyle} from 'react-native';
import {verticalScale} from 'react-native-size-matters';
import {borderWidthTiny} from 'utility/assistant';
import StyleKeyboardAwareView from './StyleKeyboardAwareView';
import StyleList from './base/StyleList';
import InputComment from './common/InputComment';

interface Props {
  bubbleFocusing: TypeGroupBuying;
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
  const theme = useTheme();

  const [textComment, setTextComment] = useState('');
  const [personReplied, setPersonReplied] = useState('');
  const [commentReplied, setCommentReplied] = useState('');

  const {list, refreshing, onRefresh, onLoadMore} = {} as any;

  const onSendComment = async () => {};

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
    (item: any) => {
      return <ItemComment item={item} onPressReply={onPresReply} />;
    },
    [bubbleFocusing.id],
  );

  return (
    <StyleKeyboardAwareView
      containerStyle={[$container, {borderRightColor: theme.gray_300}]}
      extraHeight={extraHeight}>
      <StyleList
        ref={listCommentRef}
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

const $container: ViewStyle = {
  width: Metrics.width,
  height: '100%',
  borderRightWidth: borderWidthTiny,
};

export default ListComments;
