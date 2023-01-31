import {logicSliceAction, ReduxPostCreatedHandle} from './account/logicSlice';
import FindmeStore from './store';

export const setPostCreatedHandling = (value: ReduxPostCreatedHandle) => {
  FindmeStore.dispatch(logicSliceAction.setPostCreatedHandling(value));
};
