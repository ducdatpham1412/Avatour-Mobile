import {TYPE_SALE_SEARCH} from 'asset/enum';
import request from './request';

export const apiSavePost = (postId: string) => {
  return request.put(`/profile/save-post/${postId}`);
};

export const apiUnSavePost = (postId: string) => {
  return request.put(`/profile/un-save-post/${postId}`);
};

export const apiLikePost = (params: TypeReactRequest) => {
  return request.post(
    `/profile/like/${params.reactedId}`,
    {},
    {params: {type: params.type}},
  );
};
export const apiUnLikePost = (params: TypeReactRequest) => {
  return request.delete(`/profile/like/${params.reactedId}`, {
    params: {
      type: params.type,
    },
  });
};

export const apiGetListGroupBuying = ({
  params,
}: TypeParamsPaging<{userId: number}>) => {
  return request.get('/profile/sales', {
    params: {
      user_id: params.userId,
      page_index: params.pageIndex,
      take: params.take,
      type: TYPE_SALE_SEARCH.list,
    },
  });
};

export const apiGetListReviewAboutUser = ({params}: TypeParamsPaging) => {
  return request.get(`/profile/list-posts-review-user/${params.userId}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
    },
  });
};

export const apiCreatePurchaseHistory = (body: TypeCreatePurchaseRequest) => {
  return request.post('/profile/create-purchase-history', body);
};

export const apiCreateErrorLog = (error: string) => {
  return request.post('/profile/create-error-log', {
    error,
  });
};

export const apiDeleteGroupBooking = (postId: string) => {
  return request.put(`/profile/delete-group-buying/${postId}`);
};

export const apiGetProfile = (
  id: number,
): PromiseApiResponse<TypeGetProfileResponse> => {
  return request.get(`/profile/${id}`);
};

export const apiEditProfile = (
  body: TypeEditProfileRequest,
): Promise<TypeEditProfileResponse> => {
  const payload = new FormData();

  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key !== 'avatar') {
        payload.append(key, value);
      } else {
        const formatAvatar = {
          uri: body.avatar,
          type: 'image/jpeg',
          name: 'avatar',
        };
        payload.append('avatar', formatAvatar);
      }
    }
  });

  return request.put('/profile/edit', payload, {timeout: 30000});
};

export const apiFollowUser = (id: number) => {
  return request.post(`/profile/follow/${id}`);
};
export const apiUnFollowUser = (id: number) => {
  return request.delete(`/profile/follow/${id}`);
};

export const apiEditPost = (params: {
  idPost: string;
  data: TypeEditPostRequest;
}) => {
  return request.put(`/profile/edit-post/${params.idPost}`, params.data);
};

export const apiDeletePost = (idPost: string) => {
  return request.put(`/profile/delete-post/${idPost}`);
};

export const apiGetListSalesLiked = ({params}: TypeParamsPaging) => {
  return request.get('/profile/sales', {
    params: {
      page_index: params.pageIndex,
      take: params.take,
      type: TYPE_SALE_SEARCH.favorite,
    },
  });
};

export const apiGetListGBJoined = ({params}: TypeParamsPaging) => {
  return request.get('/profile/sales', {
    params: {
      page_index: params.pageIndex,
      take: params.take,
      type: TYPE_SALE_SEARCH.joined,
    },
  });
};

export const apiGetListFollow = ({params}: TypeParamsPaging) => {
  return request.get(`/profile/follow/${params.userId}`, {
    params: {
      page_index: params.pageIndex,
      take: params.take,
      type: params.type,
    },
  });
};

export const apiRequestBought = (params: TypeRequestBought) => {
  return request.post('/profile/sales/confirm', {
    list_joins_id: params.list_joins_id,
  });
};

export const apiDeleteSale = (saleId: number) => {
  return request.delete(`/profile/sales/${saleId}`);
};
