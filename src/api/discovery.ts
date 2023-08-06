import {TYPE_GET_TOUR} from 'asset/enum';
import request from './request';

export const apiJoinSale = (
  params: TypeJoinRequest,
): Promise<TemplateApiResponse<TypeJoinEstimate>> => {
  return request.post(`/profile/sales/join/${params.saleId}`, {
    amount: params.amount,
    time_will_buy: params.time_will_buy,
    note: params.note,
  });
};

export const apiEstimate = (
  joinEstimateId: number,
): Promise<TemplateApiResponse<TypeJoinEstimate>> => {
  return request.get(`/profile/sales/join/${joinEstimateId}`, {
    params: {
      type: 'estimate',
    },
  });
};

export const apiDeleteEstimate = (joinEstimateId: number) => {
  return request.delete(`/profile/sales/join/${joinEstimateId}`);
};

export const apiEditEstimate = (
  params: TypeEditEstimate,
): Promise<TemplateApiResponse<TypeJoinEstimate>> => {
  return request.put(`/profile/sales/join/${params.estimateId}`, {
    amount: params?.amount,
    time_will_buy: params.time_will_buy,
    note: params.note,
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

export const apiConfirmUserBought = (list_joins_id: number[]) => {
  return request.put(`profile/sales/confirm`, {
    list_joins_id,
  });
};

export const apiCreateSale = (
  body: TypeCreateSale,
): Promise<TypeCreateSaleResponse> => {
  const payload = new FormData();

  payload.append('name', body.name);
  payload.append('content', body.content);
  body.images.forEach(path => {
    const formatImage = {
      uri: path,
      type: 'image/jpeg',
      name: 'avatar',
    };
    payload.append('images', formatImage);
  });
  payload.append('prices', JSON.stringify(body.prices));

  return request.post('profile/sales', payload, {timeout: 15000});
};

export const apiEditSale = (body: TypeEditSale) => {
  return request.put(`profile/sales/${body.post_id}`, body.data);
};

export const apiUpdateStatusSale = (saleId: number, status: number) => {
  // Only for supplier switch between status_active and status_temporarily_closed
  return request.put(`profile/sales/${saleId}`, {
    status,
  });
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
  return request.get('/common/passport');
};

export const apiGetResource = (): Promise<TypeResourceResponse> => {
  return request.get('/common/resource');
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
}: TypeParamsPaging): Promise<TypeSearchResponse> => {
  return request.get('/common/search', {
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

export const apiSearch = ({
  params,
}: TypeParamsPaging<TypeSearchRequest>): Promise<TypeSearchResponse> => {
  return request.get('/common/search', {
    params,
  });
};

export const apiGetListTours = ({
  params,
}: TypeParamsPaging<{user_id: number}>) => {
  return request.get('/common/tours', {
    params: {
      page_index: params.pageIndex,
      take: params.take,
      user_id: params.user_id,
      type: TYPE_GET_TOUR.list,
    },
  });
};

export const apiGetListToursFavorite = ({params}: TypeParamsPaging<{}>) => {
  return request.get('/common/tours', {
    params: {
      page_index: params.pageIndex,
      take: params.take,
      type: TYPE_GET_TOUR.favorite,
    },
  });
};

export const apiEditTour = (tourId: number, body: TypeEditTour) => {
  return request.put(`/common/tours/${tourId}`, body);
};

export const apiCreateTour = (body: TypeCreateTour) => {
  return request.post('/common/tours', body);
};

export const apiScanJoinResult = (
  shopId: number,
): Promise<TemplateApiResponse<TypeJoinResult>> => {
  return request.post('/common/scan', {
    type: 'get-money-sale',
    shop_id: shopId,
  });
};
