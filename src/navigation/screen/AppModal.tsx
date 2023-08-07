import React from 'react';
import {
  ModalActionSheet,
  ModalAlert,
  ModalCommentLike,
  ModalDatePicker,
  ModalDateRangePicker,
  ModalInputEdit,
  ModalScanQr,
  Toast,
} from './modals';

const AppModal = () => {
  return (
    <>
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
