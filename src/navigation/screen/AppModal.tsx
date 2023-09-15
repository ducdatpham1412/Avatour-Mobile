import React from 'react';
import {
  ModalActionSheet,
  ModalAlert,
  ModalCommentLike,
  ModalDatePicker,
  ModalDateRangePicker,
  ModalInputEdit,
  ModalScanQr,
  ModalTimePicker,
  Toast,
  ToolTip,
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
      <ToolTip />
      <ModalTimePicker />
    </>
  );
};

export default AppModal;
