import Store from 'app-redux/store';
import Images from 'asset/img/images';
import {StyleIcon} from 'components/base';
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
import Authentication from 'utility/authentication';
import {getCurrentRoute, navigate} from 'navigation/NavigationService';

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
      icon: <StyleIcon source={Images.icons.nice} size={70} />,
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
