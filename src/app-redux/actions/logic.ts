import {logicSliceAction, ReduxPostCreatedHandle} from '../account/logicSlice';
import Store, {RootState} from '../store';

type ResourceType = Partial<RootState['logicSlice']['resource']>;

export const setPostCreatedHandling = (value: ReduxPostCreatedHandle) => {
  Store.dispatch(logicSliceAction.setPostCreatedHandling(value));
};

export const setIsLogOut = (value: boolean) => {
  Store.dispatch(logicSliceAction.setIsLogOut(value));
};

export const setNumberNewNotifications = (value: number) => {
  Store.dispatch(logicSliceAction.setNumberNewNotification(value));
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

export const updateListChatTag = (newList: any) => {
  Store.dispatch(logicSliceAction.setListChatTag(newList));
};
