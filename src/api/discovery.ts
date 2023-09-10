import request from './request';

export const apiJoinSale = (
  params: TypeJoinRequest,
): PromiseApiResponse<TypeJoinEstimate> => {
  return request.post(`/profile/sales/join/${params.saleId}`, {
    amount: params.amount,
    time_will_buy: params.time_will_buy,
    note: params.note,
  });
};

export const apiDeleteEstimate = (joinEstimateId: number) => {
  return request.delete(`/profile/sales/join/${joinEstimateId}`);
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

export const apiGetPassport = (): Promise<TypeGetPassportResponse> => {
  return request.get('/common/passport');
};

export const apiGetResource = (): Promise<TypeResourceResponse> => {
  return request.get('/common/resource');
};

export const apiReportUser = (params: {
  userId: number;
  body: TypeReportUserRequest;
}) => {
  return request.post(`/common/report-user/${params.userId}`, params.body);
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
      type: 'list',
    },
  });
};

export const apiGetListToursFavorite = ({params}: TypeParamsPaging<{}>) => {
  return request.get('/common/tours', {
    params: {
      page_index: params.pageIndex,
      take: params.take,
      type: 'favorite',
    },
  });
};

export const apiEditTour = (tourId: number, body: TypeEditTour) => {
  return request.put(`/common/tours/${tourId}`, body);
};

export const apiCreateTour = (
  body: TypeCreateTour,
): PromiseApiResponse<TypeCreateTourResponse> => {
  return request.post('/common/tours', body);
};

export const apiScanJoinResult = (
  shopId: number,
): PromiseApiResponse<TypeJoinResult> => {
  return request.post('/common/scan', {
    type: 'get-money-sale',
    shop_id: shopId,
  });
};
