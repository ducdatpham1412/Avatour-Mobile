import request from './request';

export const apiChangeLanguage = (newLanguage: number) => {
  return request.put('/setting/extend/change-language', {
    newLanguage,
  });
};

export const apiChangeTheme = (newTheme: number) => {
  return request.put('/setting/extend/change-theme', {
    newTheme,
  });
};

export const apiChangePassword = (params: TypeChangePasswordRequest) => {
  return request.put('/setting/security/change-password', params);
};

export const apiBlockUser = (id: number) => {
  return request.post(`/setting/blocks/${id}`);
};
export const apiUnBlockUser = (id: number) => {
  return request.delete(`/setting/blocks/${id}`);
};

export const apiGetListBlocked = (): Promise<TypeGetListBlockedResponse> => {
  return request.get('/setting/block/get-list');
};

export const apiStopConversation = (chatTagId: string) => {
  return request.put(`/setting/stop-conversation/${chatTagId}`);
};

export const apiOpenConversation = (chatTagId: string) => {
  return request.put(`/setting/open-conversation/${chatTagId}`);
};

export const apiChangeInformation = (
  body: TypeChangeInformationRequest,
): Promise<TypeChangeInformationResponse> => {
  return request.put('/setting/change-information', body);
};
