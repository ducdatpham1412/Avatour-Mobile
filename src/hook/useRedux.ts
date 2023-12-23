import {
  ReduxPostCreatedHandle,
  logicSliceAction,
} from 'app-redux/account/logicSlice';
import FindmeStore from 'app-redux/store';

export const Redux = {};

export const setPostCreatedHandling = (value: ReduxPostCreatedHandle) => {
  FindmeStore.dispatch(logicSliceAction.setPostCreatedHandling(value));
};

export default Redux;
