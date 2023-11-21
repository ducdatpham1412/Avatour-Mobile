import request from './request';

export const apiGetListNotifications = ({params}: TypeParamsPaging) => {
  return request.get('/common/notifications', {
    params,
  });
};

export const apiReadNotification = (id: number) => {
  return request.put(
    '/common/notifications',
    {},
    {
      params: {
        notification_id: id,
        type: 'read',
      },
    },
  );
};
