import React, {forwardRef, memo, useState} from 'react';
import {View} from 'react-native';

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
  return null;
};

export default ModalCommentLike;
