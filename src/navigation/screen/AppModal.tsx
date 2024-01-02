import Store from 'app-redux/store';
import {getCurrentRoute, navigate} from 'navigation/NavigationService';
import React from 'react';
import Authentication from 'utility/authentication';
import {
  ModalActionSheet,
  ModalAlert,
  ModalDatePicker,
  ModalDateRangePicker,
  ModalInputEdit,
  ModalLikeComment,
  ModalScanQr,
  ModalTimePicker,
  Toast,
  ToolTip,
} from './modals';

type CheckAuthenticated = {
  onLoginCallback?: () => void;
  onAuthenticated: () => void;
};

export const checkAuthenticated = ({
  onLoginCallback,
  onAuthenticated,
}: CheckAuthenticated) => {
  const {modeExp} = Store.getState().accountSlice;

  if (modeExp) {
    ModalAlert.options({
      i18Content: 'alert.loginToExplore',
      icon: 'nice',
      onContinue: () => {
        const curRoute = getCurrentRoute();
        Authentication.open(() => {
          onLoginCallback?.();
          navigate(curRoute.name, {
            key: curRoute.key,
            ...curRoute.params,
          });
        });
      },
      titleButton: 'login.login',
    });
    return;
  }

  onAuthenticated();
};

const AppModal = () => {
  return (
    <>
      <ModalInputEdit />
      <ModalDateRangePicker />
      <ModalDatePicker />
      <ModalLikeComment />
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
