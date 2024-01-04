import {APP_EVENT} from 'asset/enum';
import {AppEventList} from 'navigation/config';
import {useEffect} from 'react';
import {NativeAppEventEmitter} from 'react-native';

const useAppEvent = <T extends APP_EVENT>(
  name: T,
  callBack?: (
    e: T extends keyof AppEventList ? AppEventList[T] : undefined,
  ) => void,
) => {
  useEffect(() => {
    const appEvent = NativeAppEventEmitter.addListener(name, e =>
      callBack?.(e),
    );
    return () => {
      appEvent.remove();
    };
  }, [name]);
};

export const emitAppEvent = <T extends APP_EVENT>(
  name: T,
  params?: T extends keyof AppEventList ? AppEventList[T] : undefined,
) => {
  NativeAppEventEmitter.emit(name, params);
};

export default useAppEvent;
