import {useLocalNotification, useRemoteNotification} from 'hook/notifications';

const Notification = () => {
  useLocalNotification();
  useRemoteNotification();

  return null;
};

export default Notification;
