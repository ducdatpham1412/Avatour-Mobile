import StatusPostCreated from 'navigation/components/StatusPostCreated';
import React from 'react';
import {
  ModalCommentLikeAllApp,
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
    </>
  );
};

export default AppModal;
