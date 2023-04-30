import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import ROOT_SCREEN from 'navigation/config/routes';
import {ReactNode} from 'react';
import {I18Normalize} from 'utility/I18Next';
import {AllRoutes, AppParamsList} from './config';

export const navigationRef = createNavigationContainerRef();

export const navigate = <T extends AllRoutes>(
  name: T,
  params?: T extends keyof AppParamsList ? AppParamsList[T] : undefined,
) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
};

export const goBack = () => {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};

export const push = <T extends AllRoutes>(
  name: T,
  params?: T extends keyof AppParamsList ? AppParamsList[T] : undefined,
) => {
  navigationRef.dispatch(StackActions.push(name, params));
};

export const getCurrentRoute = () => {
  return navigationRef.getCurrentRoute();
};

interface TypeMoreChoiceAlert {
  actionClickOk?: () => void;
  moreNotice?: I18Normalize;
  moreAction?(): void;
}

interface TypeAlertYesOrNo {
  i18Title: I18Normalize;
  agreeText?: I18Normalize;
  refuseText?: I18Normalize;
  i18Params?: object;
  agreeChange(): void;
  refuseChange(): void;
  headerNode?: ReactNode;
  displayButton?: boolean;
  touchOutBack?: boolean;
  agreeButtonOpacity?: number;
}

export const appAlert = (notice: any, more?: TypeMoreChoiceAlert) => {
  navigate(ROOT_SCREEN.alert, {
    notice: notice as I18Normalize,
    actionClickOk: more?.actionClickOk,
    moreNotice: more?.moreNotice,
    moreAction: more?.moreAction,
  });
};

export const appAlertYesNo = (params: TypeAlertYesOrNo) => {
  navigate(ROOT_SCREEN.alertYesNo, params);
};

export const showSwipeImages = (
  params: AppParamsList[ROOT_SCREEN.swipeImages],
) => {
  navigate(ROOT_SCREEN.swipeImages, params);
};

export const popUpPicker = (params: AppParamsList[ROOT_SCREEN.picker]) => {
  navigate(ROOT_SCREEN.picker, params);
};
