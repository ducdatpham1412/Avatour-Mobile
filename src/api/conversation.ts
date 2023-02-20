import request from './request';

export const apiGetListConversations = ({
  params,
}: TypeParamsPaging): Promise<{
  success: boolean;
  pageIndex: number;
  take: number;
  totalPages: number;
  data: Array<TypeChatTagResponse>;
}> => {
  return request.get('/chat/list-conversations', {
    params,
  });
};

export const apiGetListMessages = ({
  params,
}: TypeParamsPaging): Promise<{
  success: boolean;
  data: Array<TypeChatMessageResponse>;
}> => {
  return request.get(`/chat/list-messages/${params.chatTagId}`, {
    params,
  });
};

export const apiDeleteMessage = (messageId: string) => {
  return request.put(`/chat/delete-message/${messageId}`);
};

export const apiGetDetailConversation = (conversationId: string) => {
  return request.get(`/chat/detail-conversation/${conversationId}`);
};

export const apiChangeChatColor = (params: TypeChangeChatColor) => {
  return request.put(`/chat/change-chat-color/${params.conversationId}`, {
    color: params.color,
  });
};

export const apiChangeChatName = (params: TypeChangeChatName) => {
  return request.put(`/chat/change-chat-name/${params.conversationId}`, {
    name: params.name,
  });
};
