import Notifee, {EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import useSWR from 'swr';

import {Vibration} from 'react-native';
import {logger} from 'utility/assistant';

interface ShowLocalParams {
  title: string;
  content: string;
  data?: TypeNotificationData;
}

export const showLocalNotification = async ({
  title,
  content,
  data,
}: ShowLocalParams) => {
  try {
    await Notifee.requestPermission();

    const channelId = await Notifee.createChannel({
      id: 'channel_android_id',
      name: 'Chanel Android',
    });

    await Notifee.displayNotification({
      title,
      body: content,
      android: {
        channelId,
        pressAction: {
          id: 'channel_android_id',
        },
      },
      data,
    });
    Vibration.vibrate();
  } catch (err) {
    logger('Error local notification: ', err);
  }
};

const useNotifications = () => {
  const {data, mutate} = useSWR<TypeNotificationData>(
    'notification.getInitialURL',
    async () => {
      await Notifee.requestPermission();
      const initMessage = await Notifee.getInitialNotification();
      if (initMessage) {
        return {
          link: String(initMessage.notification.data?.link ?? ''),
        };
      }

      const initMessageFirebase = await messaging().getInitialNotification();
      return {
        link: initMessageFirebase?.data?.link ?? '',
      };
    },
  );

  useEffect(() => {
    Notifee.onBackgroundEvent(async message => {
      if (message.type === EventType.PRESS) {
        await mutate(
          {link: String(message.detail.notification?.data?.link ?? '')},
          {
            revalidate: false,
          },
        );
      }
    });

    Notifee.onForegroundEvent(async message => {
      if (message.type === EventType.PRESS) {
        await mutate(
          {link: String(message.detail.notification?.data?.link ?? '')},
          {
            revalidate: false,
          },
        );
      }
    });

    const subscribeBackground = messaging().onNotificationOpenedApp(
      async message => {
        await mutate(
          {link: message.data?.link ?? ''},
          {
            revalidate: false,
          },
        );
      },
    );

    const subscribeForeGround = messaging().onMessage(async message => {
      await showLocalNotification({
        title: message.notification?.title ?? '',
        content: message.notification?.body ?? '',
        data: {link: message.data?.link ?? ''},
      });
    });

    return () => {
      subscribeBackground();
      subscribeForeGround();
    };
  }, []);

  const resetNotification = () => {
    mutate({link: ''}, {revalidate: false});
  };

  return {
    link: data?.link,
    resetNotification,
  };
};

export default useNotifications;
