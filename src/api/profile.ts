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
  return request.get(`/profile/sales`, {
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
): Promise<{
  success: boolean;
  data: TypeGetProfileResponse;
}> => {
  return request.get(`/profile/get-profile/${id}`);
};

export const apiEditProfile = (
  params: TypeEditProfileRequest,
): Promise<TypeEditProfileResponse> => {
  return request.put('/profile/edit-profile', params);
};

export const apiFollowUser = (id: number) => {
  return request.put(`/profile/follow/${id}`);
};
export const apiUnFollowUser = (id: number) => {
  return request.put(`/profile/un-follow/${id}`);
};

export const apiCreatePost = (
  params: TypeCreatePostRequest,
): Promise<{
  success: boolean;
  data: TypeBubblePalace;
}> => {
  return request.post('/profile/create-post', params);
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

export const apiGetListPostsArchived = ({params}: TypeParamsPaging) => {
  return request.get('/profile/list-posts-archived', {
    params,
  });
};

export const apiGetListGbJoining = ({
  params,
}: TypeParamsPaging<{userId: number}>) => {
  return request.get('/profile/sales', {
    params: {
      page_index: params.pageIndex,
      take: params.take,
      type: TYPE_SALE_SEARCH.joining,
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
  return request.get(`/profile/follow/get-list/${params.userId}`, {
    params: {
      pageIndex: params.pageIndex,
      take: params.take,
      typeFollow: params.typeFollow,
    },
  });
};
