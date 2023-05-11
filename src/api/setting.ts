import {TYPE_CHANGE} from 'asset/enum';
import request from './request';

export const apiChangeLanguage = (new_language: number) => {
  return request.put(
    '/setting/changes',
    {
      new_language,
    },
    {
      params: {
        type: TYPE_CHANGE.language,
      },
    },
  );
};

export const apiChangeTheme = (new_theme: number) => {
  return request.put(
    '/setting/changes',
    {
      new_theme,
    },
    {
      params: {
        type: TYPE_CHANGE.theme,
      },
    },
  );
};

export const apiChangePassword = (body: TypeChangePasswordRequest) => {
  return request.put('/setting/changes', body, {
    params: {
      type: TYPE_CHANGE.password,
    },
  });
};

export const apiBlockUser = (id: number) => {
  return request.post(`/setting/blocks/${id}`);
};
export const apiUnBlockUser = (id: number) => {
  return request.delete(`/setting/blocks/${id}`);
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
  return request.put('/setting/changes', body, {
    params: {
      type: TYPE_CHANGE.information,
    },
  });
};
