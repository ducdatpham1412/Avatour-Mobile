import Notifee, {EventType} from '@notifee/react-native';
import {useEffect} from 'react';
import {Vibration} from 'react-native';
import {logger} from 'utility/assistant';

interface ShowLocalParams {
  title: string;
  content: string;
  data?: Record<string, any>;
}

const useLocalNotification = () => {
  const handleEvent = (
    event: number,
    data: Record<string, any> | undefined,
  ) => {
    console.log('Event: ', event, ' - ', data);
  };

  useEffect(
    () =>
      Notifee.onForegroundEvent(({type, detail}) => {
        if (type === EventType.PRESS) {
          const {event, data} = detail.notification?.data ?? {};
          handleEvent(
            Number(event),
            data ? JSON.parse(String(data)) : undefined,
          );
        }
      }),
    [],
  );
};

export const showLocalNotification = async (
  event: number,
  {title, content, data}: ShowLocalParams,
) => {
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
      data: {
        event,
        data: data ? JSON.stringify(data) : '',
      },
    });
    Vibration.vibrate();
  } catch (err) {
    logger('Error local notification: ', err);
  }
};

export default useLocalNotification;
