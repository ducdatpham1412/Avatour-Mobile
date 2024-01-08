import {logicSliceAction} from '../account/logicSlice';
import Store, {RootState} from '../store';

type ResourceType = Partial<RootState['logicSlice']['resource']>;

export const setNewNotifications = (value: number) => {
  Store.dispatch(logicSliceAction.setNewNotification(value));
};

export const setToken = (newToken: string | null) => {
  Store.dispatch(logicSliceAction.setToken(newToken));
};

export const updateResource = (update: ResourceType) => {
  const newResource = {
    ...Store.getState().logicSlice.resource,
    ...update,
  };
  Store.dispatch(logicSliceAction.setResource(newResource));
};

export const setBorderMessRoute = (color: string) => {
  Store.dispatch(logicSliceAction.setBorderMessRoute(color));
};

export const setSearchParams = (value: TypeSearchParams) => {
  Store.dispatch(logicSliceAction.setSearchParams(value));
};
