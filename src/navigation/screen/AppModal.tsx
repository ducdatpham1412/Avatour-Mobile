import StatusPostCreated from 'navigation/components/StatusPostCreated';
import React from 'react';
import {
  ModalCommentLike,
  ModalCommentLikeAllApp,
  ModalDatePicker,
  ModalDateRangePicker,
  ModalInputEdit,
} from './modals';

const AppModal = () => {
  return (
    <>
      <StatusPostCreated />
      <ModalCommentLikeAllApp />
      <ModalInputEdit />
      <ModalDateRangePicker />
      <ModalDatePicker />
      <ModalCommentLike />
    </>
  );
};

export default AppModal;
