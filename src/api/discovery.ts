import request from './request';

export const apiJoinGroupBuying = (
  params: TypeJoinGroupBookingRequest,
): Promise<TypeJoinGbResponse> => {
  return request.put(`/profile/join-group-buying/${params.postId}`, {
    money: params.money,
    amount: params.amount,
    time_will_buy: params.time_will_buy,
    note: params.note,
    is_retail: params.is_retail,
  });
};

export const apiGetListGroupPeopleJoin = ({params}: TypeParamsPaging) => {
  return request.get(`/profile/list-group-joined/${params.postId}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
    },
  });
};

export const apiGetListPeopleRetail = ({params}: TypeParamsPaging) => {
  return request.get(`/profile/list-people-retail/${params.postId}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
    },
  });
};

export const apiConfirmUserBought = (join_id: string) => {
  return request.put(`profile/confirm-user-bought/${join_id}`);
};

export const apiCreateGroupBuying = (body: TypeCreateGroupBuying) => {
  return request.post('profile/create-group-buying', body);
};

export const apiEditGroupBooking = (body: TypeEditGroupBooking) => {
  return request.put(`profile/edit-group-buying/${body.postId}`, body.data);
};

export const apiGetListEditHistory = ({params}: TypeParamsPaging) => {
  return request.get(`/common/list-edit-history/${params.postId}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
    },
  });
};

export const apiGetPassport = (): Promise<TypeGetPassportResponse> => {
  return request.get('/common/get-passport');
};

export const apiGetResource = (): Promise<TypeResourceResponse> => {
  return request.get('/common/get-resource');
};

export const apiUploadFile = (params: {
  formData: FormData;
  quality?: number;
  timeout?: number;
}) =>
  request.post('/common/upload-file', params.formData, {
    params: {
      quality: params.quality || undefined,
    },
    timeout: params.timeout || 10000,
  });

export const apiReportUser = (params: {
  userId: number;
  body: TypeReportUserRequest;
}) => {
  return request.post(`/common/report-user/${params.userId}`, params.body);
};

export const apiGetListBubbleActive = ({
  params,
}: TypeParamsPaging): Promise<TypeBubblePalace> => {
  return request.get('/common/get-list-bubble-profile', {
    params,
  });
};

export const apiGetDetailBubble = (
  idBubble: string,
): Promise<{
  success: true;
  data: TypeBubblePalace & TypeGroupBuying;
}> => {
  return request.get(`/common/detail-bubble-profile/${idBubble}`);
};

export const apiGetListComments = ({params}: TypeParamsPaging) => {
  return request.get(`/common/list-comments/${params.postId}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
      replied_id: params.replied_id || undefined,
    },
  });
};

export const apiGetListReactsPost = ({
  params,
}: TypeParamsPaging): Promise<{
  success: boolean;
  data: Array<TypeGetLikePostsResponse>;
}> => {
  return request.get(`/common/list-people-react/${params.idBubble}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
      type: params.type,
    },
  });
};

export const apiGetTopReviewers = (): Promise<{
  success: boolean;
  data: TypeGetTopReviewerResponse;
}> => {
  return request.get('/common/get-top-reputations');
};
