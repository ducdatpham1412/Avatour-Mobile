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

export const updateBubbleFocusing = (value: Partial<TypeBubblePalace>) => {
  Store.dispatch(
    logicSliceAction.setBubbleFocusing({
      ...Store.getState().logicSlice.bubbleFocusing,
      ...value,
    }),
  );
};

export const setGestureHandle = (
  key: keyof RootState['logicSlice']['gestureHandle'],
  value: boolean,
) => {
  const newGestureHandle = {
    ...Store.getState().logicSlice.gestureHandle,
    [key]: value,
  };
  Store.dispatch(logicSliceAction.setGestureHandle(newGestureHandle));
};

export const setBubblePalaceAction = (newBubble: TypeBubblePalaceAction) => {
  Store.dispatch(logicSliceAction.setBubblePalace(newBubble));
};

export const setBorderMessRoute = (color: string) => {
  Store.dispatch(logicSliceAction.setBorderMessRoute(color));
};

export const setScrollMainAndChatEnable = (value: boolean) => {
  Store.dispatch(logicSliceAction.setScrollMainAndChatEnable(value));
};

export const setSearchParams = (value: TypeSearchParams) => {
  Store.dispatch(logicSliceAction.setSearchParams(value));
};
