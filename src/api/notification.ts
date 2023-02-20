import request from './request';

export const apiGetListNotifications = ({params}: TypeParamsPaging) => {
  return request.get('/common/list-notifications', {
    params,
  });
};

export const apiReadNotification = (idNotification: string) => {
  return request.put(`/common/read-notification/${idNotification}`);
};
