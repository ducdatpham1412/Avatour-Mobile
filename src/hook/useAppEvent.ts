import {APP_EVENT} from 'asset/enum';
import {AppEventList} from 'navigation/config';
import {useEffect} from 'react';
import {NativeAppEventEmitter} from 'react-native';

const useAppEvent = <T extends APP_EVENT>(
  name: T,
  callBack?: (
    data: T extends keyof AppEventList ? AppEventList[T] : undefined,
  ) => void,
) => {
  useEffect(() => {
    const appEvent = NativeAppEventEmitter.addListener(name, data =>
      callBack?.(data),
    );
    return () => {
      appEvent.remove();
    };
  }, []);

  const emit = (
    params: T extends keyof AppEventList ? AppEventList[T] : undefined,
  ) => {
    if (params) {
      NativeAppEventEmitter.emit(name, params);
    }
  };

  return {
    emit,
  };
};

export const emitAppEvent = <T extends APP_EVENT>(
  name: T,
  params?: T extends keyof AppEventList ? AppEventList[T] : undefined,
) => {
  NativeAppEventEmitter.emit(name, params);
};

export default useAppEvent;
