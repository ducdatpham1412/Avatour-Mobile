import StatusPostCreated from 'navigation/components/StatusPostCreated';
import React from 'react';
import {
  ModalActionSheet,
  ModalAlert,
  ModalCommentLike,
  ModalCommentLikeAllApp,
  ModalDatePicker,
  ModalDateRangePicker,
  ModalInputEdit,
  ModalScanQr,
  Toast,
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
      <ModalScanQr />
      <ModalActionSheet />
      <ModalAlert />
      <Toast />
    </>
  );
};

export default AppModal;
