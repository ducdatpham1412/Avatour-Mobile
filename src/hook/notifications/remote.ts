import messaging from '@react-native-firebase/messaging';
import {Permission, PermissionsAndroid} from 'react-native';
import useSWRImmutable from 'swr/immutable';
import {isIOS} from 'utility/assistant';

const useRemoteNotification = () => {
  const {data} = useSWRImmutable('notifications.remote', async () => {
    if (isIOS) {
      await messaging().requestPermission();
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS as Permission,
      );
    }

    messaging().onNotificationOpenedApp(message => {
      console.log('In app notification: ', message);
    });

    const initNotification = await messaging().getInitialNotification();

    return {
      event: Number(initNotification?.data?.event),
      data: initNotification?.data?.data,
    };
  });

  return {
    event: data?.event,
    data: data?.data,
  };
};

export default useRemoteNotification;
