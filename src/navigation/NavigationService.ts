import {
  createNavigationContainerRef,
  NavigationState,
  PartialState,
  StackActions,
} from '@react-navigation/native';
import ROOT_SCREEN from 'navigation/config/routes';
import {ReactNode} from 'react';
import {I18Normalize} from 'utility/I18Next';
import {AllRoutes, AppParamsList} from './config';
import {ModalAlert} from './screen/modals';

export const navigationRef = createNavigationContainerRef();

export const navigate = <T extends AllRoutes>(
  name: T,
  params?: T extends keyof AppParamsList ? AppParamsList[T] : undefined,
) => {
  if (navigationRef.isReady()) {
    (navigationRef.navigate as any)(name, params);
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

export function resetRoot(
  params?: PartialState<NavigationState> | NavigationState,
) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(params);
  }
}

export function replace<T extends AllRoutes>(
  name: T,
  params?: T extends keyof AppParamsList ? AppParamsList[T] : undefined,
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
}

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
  if (more?.moreNotice) {
    ModalAlert.options({
      content: String(notice),
      onContinue: () => more?.moreAction?.(),
    });
  } else {
    ModalAlert.notification({
      content: String(notice),
      onClose: () => more?.actionClickOk?.(),
    });
  }
};

export const appAlertYesNo = (params: TypeAlertYesOrNo) => {
  ModalAlert.options({
    i18Content: params.i18Title,
    onContinue: params.agreeChange,
  });
};

export const showSwipeImages = (
  params: AppParamsList[ROOT_SCREEN.swipeImages],
) => {
  navigate(ROOT_SCREEN.swipeImages, params);
};
