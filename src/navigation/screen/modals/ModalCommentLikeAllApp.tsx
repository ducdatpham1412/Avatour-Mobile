import {updateBubbleFocusing} from 'app-redux';
import Store, {useAppSelector} from 'app-redux/store';
import ModalCommentLike from 'components/ModalCommentLike';
import {useTheme} from 'hook';
import Redux from 'hook/useRedux';
import React from 'react';

export const modalCommentLikeAllAppRef = React.createRef<ModalCommentLike>();

const ModalCommentLikeAllApp = () => {
  const theme = useTheme();
  const {bubbleFocusing} = useAppSelector(state => state.logicSlice);

  return (
    <ModalCommentLike
      ref={modalCommentLikeAllAppRef}
      theme={theme}
      bubbleFocusing={bubbleFocusing}
      updateBubbleFocusing={value => updateBubbleFocusing(value)}
      setTotalComments={value => {
        updateBubbleFocusing({
          totalComments: value,
        });
      }}
      increaseTotalComments={value => {
        const currentComments =
          Store.getState().logicSlice.bubbleFocusing.totalComments;
        Redux.updateBubbleFocusing({
          totalComments: currentComments + value,
        });
      }}
    />
  );
};

export default ModalCommentLikeAllApp;
