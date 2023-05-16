import StatusPostCreated from 'navigation/components/StatusPostCreated';
import React from 'react';
import {
  ModalActionSheet,
  ModalAddLocation,
  ModalAlert,
  ModalCommentLike,
  ModalCommentLikeAllApp,
  ModalDatePicker,
  ModalDateRangePicker,
  ModalInputEdit,
  ModalScanQr,
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
      <ModalAddLocation />
    </>
  );
};

export default AppModal;
