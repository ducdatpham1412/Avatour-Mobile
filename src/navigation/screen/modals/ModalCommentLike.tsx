import {View, Text} from 'react-native';
import React, {forwardRef, memo, useState} from 'react';

interface Props {
  postId: number;
  type: string; // sale | tour | post_review
}

const ModalCommentLikeInstance = forwardRef(
  memo(
    () => {
      return <View />;
    },
    (preProps: any, nextProps: any) => false,
  ),
);

const ModalCommentLike = () => {
  const [listPostIds, setListPostIds] = useState([]);
  return (
    <View>
      <Text>ModalCommentLike</Text>
    </View>
  );
};

export default ModalCommentLike;
